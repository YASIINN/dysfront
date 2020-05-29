<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" headerTitle="Filtreleme Seçenekleri">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>Ad Soyad</label>
              <div class="input-group input-group-merge">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                </div>
                <v-input
                  placeholder="Ad Soyad"
                  class
                  v-model="filterData.personFullName"
                  :inputType="'text'"
                ></v-input>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="form-group">
              <label>E-Mail Adresi</label>
              <div class="input-group input-group-merge">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
                <v-input
                  placeholder="Email"
                  class
                  v-model="filterData.personMail"
                  :inputType="'text'"
                ></v-input>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12 col-lg-12 col-sm-12">
            <label class="radio-inline pl-4">
              <input type="radio" value="2" v-model="filterData.isActive" name="optradio" checked/>Tüm Personellerde
              Aransın
            </label>
            <label class="radio-inline pl-4">
              <input type="radio" value="1" v-model="filterData.isActive" name="optradio"/>Aktif Personellerde
              Aransın
            </label>
            <label class="radio-inline pl-4">
              <input type="radio" value="0" v-model="filterData.isActive" name="optradio"/>Pasif Personellerde
              Aransın
            </label>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6"></div>
        </div>
        <v-button
          :btnIcon="'fa-search'"
          :className="'btn-info float-right'"
          btnName="Ara"
          @onClick="onSearchPersons($event)"
        ></v-button>
      </div>
    </flex-card>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card-wrapper">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">Personeller</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-12 col-sm-12 col-lg-12">
                <div class="float-right mb-5">
                  <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
                  <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm"
                            @onClick="alldataExport"/>
                </div>

                <div class="table-responsive">
                  <vuetable
                    ref="vuetable"
                    :append-params="moreParams"
                    :fields="personHeader"
                    noDataTemplate="Kayıt Bulunamadı"
                    :http-fetch="onFetchApi"
                    pagination-path
                    :per-page="5"
                    @vuetable:load-success="onSuccess"
                    @vuetable:load-error="onError"
                    @vuetable:pagination-data="onPaginationData"
                    @vuetable:loading="onLoading"
                    @vuetable:loaded="onLoaded"
                  >
                    <template slot="pimage" scope="props">
                      <img
                        v-if="props.rowData.file.path==''"
                        :src="defaultPreview"
                        width="50"
                        height="50"
                      />
                      <img v-else :src="props.rowData.file.path" width="50" height="50"/>
                    </template>
                    <template slot="isActive" scope="props">
                      <span
                        class="badge badge-pill badge-success"
                        :class="props.rowData.uİsActive=='Aktif'?'badge-success':'badge-danger'"
                      >{{props.rowData.uİsActive}}</span>
                    </template>
                    <template slot="details" scope="props">
                      <router-link
                        tag="a"
                        style="cursor:pointer !important;"
                        class="font-weight-bold pl-5"
                        :to="'userdetail/'+props.rowData.id"
                      >Detaylar
                      </router-link>
                    </template>
                    <template slot="actions" scope="props">
                      <div class="custom-actions">
                        <v-tooltip-button
                          :icon="'fa-user-edit'"
                          :title="'Düzenle'"
                          :btnColor="'orange'"
                          @onClick="onSelectData(props.rowData)"
                        ></v-tooltip-button>
                        <v-tooltip-button
                          :icon="'fas fa-trash'"
                          :title="'Sil'"
                          :btnColor="'red'"
                          @onClick="onDelete(props.rowData, props.rowIndex)"
                        ></v-tooltip-button>
                      </div>
                    </template>
                  </vuetable>
                  <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
                  <div class="dataTables_paginate paging_simple_numbers float-right">
                    <vuetable-pagination-bootstrap
                      class="float-right"
                      ref="pagination"
                      @vuetable-pagination:change-page="onChangePage"
                    ></vuetable-pagination-bootstrap>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex>
  </div>
</template>

<script>
  import defaultImage from '@/assets/img/defaultavatar.png'
  import {
    Swal,
    appPlugin,
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'
  import vuetableMixins from '@/mixins/vuetable'
  import defaulcomponentsMixins from '@/mixins/defaultcomponents'
  export default {
    name: 'index',
    mixins: [loadingMixins,defaulcomponentsMixins,vuetableMixins],
    methods: {
      onSelectData (item, i) {
        this.$router.push('/editperson/' + item.id)
      },
      onDelete (item, i) {
        Swal.fire({
          title:
            item.uFullName + ' ' + 'Kaydını Silmek İstediğinize Emin Misiniz ?',
          confirmButtonText: 'Evet',
          confirmButtonColor: 'red',
          cancelButtonText: 'Vazgeç',
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch('deletePerson', {
                deleted: item,
                index: i
              })
              .then(res => {
                if (res.status) {
                  if (res.status === 200) {
                    appPlugin.showalert(
                      'Kayıt Başarıyla Silindi',
                      '',
                      'success',
                      'Tamam'
                    )
                  }
                } else {
                  appPlugin.showalert(
                    'Kayıt Silinirken Hata Gerçekleşti',
                    '',
                    'error',
                    'Tamam'
                  )
                }

                this.onRefreshTableContent()

                this.onCloseIndıcator()
              })
          }
        })
      },
      onSearchPersons () {
        let query
        if (
          this.filterData.personFullName != '' ||
          this.filterData.personMail != ''
        ) {
          if (this.filterData.isActive == 2) {
            if (this.filterData.personFullName == '') {
              query = appPlugin.urlParse('uEmail%' + this.filterData.personMail)
            }
            if (this.filterData.personMail == '') {
              query = appPlugin.urlParse(
                'uFullName%' + this.filterData.personFullName
              )
            }
          } else {
            query = appPlugin.urlParse(
              'uFullName%' +
              this.filterData.personFullName +
              '& uEmail%' +
              this.filterData.personMail +
              '& uİsActive=' +
              this.filterData.isActive
            )
          }
        } else {
          if (this.filterData.isActive == '2') {
            query = ''
          } else {
            query = appPlugin.urlParse('uİsActive=' + this.filterData.isActive)
          }
        }
        this.query = query
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      alldataExport () {
        let query
        if (
          this.filterData.personFullName != '' ||
          this.filterData.personMail != ''
        ) {
          if (this.filterData.isActive == 2) {
            if (this.filterData.personFullName == '') {
              query = appPlugin.urlParse('uEmail%' + this.filterData.personMail)
            }
            if (this.filterData.personMail == '') {
              query = appPlugin.urlParse(
                'uFullName%' + this.filterData.personFullName
              )
            }
          } else {
            query = appPlugin.urlParse(
              'uFullName%' +
              this.filterData.personFullName +
              '& uEmail%' +
              this.filterData.personMail +
              '& uİsActive=' +
              this.filterData.isActive
            )
          }
        } else {
          if (this.filterData.isActive == '2') {
            query = ''
          } else {
            query = appPlugin.urlParse('uİsActive=' + this.filterData.isActive)
          }
        }
        this.query = query
        this.onOpenIndıcator()
        this.$store
          .dispatch('fetchAllPersonExportExcel', {
            query: this.query
          })
          .then(res => {
            if (res.length > 0) {
              res.forEach(item => {
                item.utName = item.title.tName
                item.upName = item.province.pName
              })
              let data = res
              let keys = [
                'uName',
                'uSurname',
                'uPhone',
                'uEmail',
                'utName',
                'upName',
                'uGender',
                'uİsActive'
              ]
              const header = [
                'Personel Adı',
                'Personel Soyadı',
                'Personel Telefon Numarası',
                'Personel Email Adresi',
                'Personel Ünvanı',
                'Personel Branşı',
                'Personel Cinsiyeti',
                'Personel Aktifliği'
              ]
              appPlugin.exportExcelTable(data, 'Personeller', 14, keys, header)
            } else {
              appPlugin.showalert(
                this.$t('warning'),
                this.$t('excelExportWarning'),
                'info',
                this.$t('ok')
              )
            }

            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      },
      onFetchApi (apiUrl, httpOptions) {
        var data

        // if(this.filterData.personMail.trim()=="" && this.filterData.personFullName.trim()==""){
        // if(this.filterData.isActive==2){
        //       query=""
        //       }else{
        //         query=appPlugin.urlParse("uİsActive="+this.filterData.isActive)
        //       }
        // }else{
        //     if(this.filterData.isActive==2){
        //       query=appPlugin.urlParse("")
        //       }else{
        //         query=appPlugin.urlParse("uİsActive="+this.filterData.isActive)
        //       }
        // }
        if (this.query != '') {
          data = this.$store.dispatch('fetchPersons', {
            httpOpt: httpOptions,
            query: this.query
          })
          data.then(res => {
            console.log(res.data.data)
            res.data.data.forEach(item => {
              item.utName = item.title.tName
              item.upName = item.province.pName
            })
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchPersons', {
            httpOpt: httpOptions
          })
          data.then(res => {
            console.log(res.data.data)
            res.data.data.forEach(item => {
              item.utName = item.title.tName
              item.upName = item.province.pName
            })
            this.currentData = res
          })
          return data
        }

        // if (this.txt.trim() != "") {
        //   data = this.$store.dispatch("fetchPersons", {
        //     httpOpt: httpOptions,
        //     query: appPlugin.urlParse("sName%" + this.txt)
        //   });
        //   data.then(res => {
        //     console.log(res.data);
        //     res.data.data.forEach(item => {});
        //     this.currentData = res;
        //   });
        //   return data;
        // } else {
        //   data = this.$store.dispatch("fetchPersons", {
        //     httpOpt: httpOptions,
        //     query: appPlugin.urlParse("uİsActive=" + "1")
        //   });
        //   data.then(res => {
        //
        //     console.log(res.data.data);
        //     res.data.data.forEach(item => {});
        //     this.currentData = res;
        //   });
        //   return data;
        // }
      },
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data
          console.log(data)
          let keys = [
            'uName',
            'uSurname',
            'uPhone',
            'uEmail',
            'utName',
            'upName',
            'uGender',
            'uİsActive'
          ]
          const header = [
            'Personel Adı',
            'Personel Soyadı',
            'Personel Telefon Numarası',
            'Personel Email Adresi',
            'Personel Ünvanı',
            'Personel Branşı',
            'Personel Cinsiyeti',
            'Personel Aktifliği'
          ]
          appPlugin.exportExcelTable(data, 'Personeller', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
    },
    data () {
      return {
        defaultPreview: defaultImage,
        query: [
          { PropertyName: 'uİsActive', Operation: 'EQ', PropertyValue: '1' }
        ],
        personHeader: [
          {
            name: '__sequence',
            title: '#',
            titleClass: 'center aligned',
            dataClass: 'right aligned'
          },
          {
            name: '__slot:pimage',
            title: '<i class="fas fa-image"></i>'
          },
          {
            name: 'uName',
            title: '<i class="fas fa-lightbulb"></i>Ad '
          },
          {
            name: 'uSurname',
            title: '<i class="fas fa-graduation-cap"></i>Soyad'
          },
          {
            name: 'uPhone',
            title: '<i class="fas fa-building"></i>Telefon Numarası'
          },
          {
            name: 'uEmail',
            title: '<i class="fas fa-building"></i>Mail Adresi'
          },
          {
            name: 'province.pName',
            title: '<i class="fas fa-building"></i>Branş '
          },
          {
            name: 'uGender',
            title: '<i class="fas fa-building"></i>Cinsiyet '
          },
          {
            name: '__slot:isActive',
            title: '<i class="fas fa-building"></i>Aktiflik Durumu '
          },
          {
            name: 'title.tName',
            title: '<i class="fas fa-building"></i>Ünvan'
          },
          {
            name: '__slot:details',
            title: '<i class="fas fa-info"></i>Detaylar'
          },
          {
            name: '__slot:actions',
            title: '<i class="fas fa-pen-fancy"></i>İşlemler'
          }
        ],
        filterCopy: {
          isActive: 1,
          personMail: '',
          personFullName: ''
        },
        filterData: {
          isActive: 1,
          personMail: '',
          personFullName: ''
        }
      }
    },
  }
</script>

<style scoped>
</style>
