<template>
  <div>
    <div>
      <Loading v-if="loading"></Loading>
      <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('addschool')">
        <div class="card-body">
          <div>
            <div class="row">
              <div class="col-md-2 col-sm-2 col-lg-2">
                <div class="form-group" :class="{'has-danger':$v.schoolData.company.$error}">
                  <div class="input-group input-group-merge">
                    <v-select
                      :className="{'is-invalid':$v.schoolData.company.$error}"
                      v-model.trim="$v.schoolData.company.$model"
                      :propName="'cName'"
                      :bindData="'id'"
                      @onBlur="$v.schoolData.company.$touch"
                      :optionData="$store.getters.getCompanies"
                    ></v-select>
                    <div class="invalid-feedback">
                      <small v-if="!$v.schoolData.company.required">Lütfen Şirket Seçiniz</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-lg-2">
                <div class="form-group" :class="{'has-danger':$v.schoolData.code.$error}">
                  <div class="input-group input-group-merge">
                    <v-input
                      @onBlurInput="$v.schoolData.code.$touch"
                      v-model="$v.schoolData.code.$model"
                      :className="{'is-invalid':$v.schoolData.code.$error}"
                      :placeHolder="$t('enterschoolcode')"
                      :inputType="'text'"
                    ></v-input>
                    <div class="invalid-feedback">
                      <small v-if="!$v.schoolData.code.required">{{$t('pleaseenterschoolcode')}}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6 col-sm-6 col-lg-6">
                <div class="form-group" :class="{'has-danger':$v.schoolData.name.$error}">
                  <div class="input-group input-group-merge">
                    <v-input
                      @onBlurInput="$v.schoolData.name.$touch"
                      v-model="$v.schoolData.name.$model"
                      :className="{'is-invalid':$v.schoolData.name.$error}"
                      :placeHolder="$t('enterschoolname')"
                      :inputType="'text'"
                    ></v-input>
                    <div class="invalid-feedback">
                      <small v-if="!$v.schoolData.name.required">{{$t('pleaseenterschoolname')}}</small>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-2 col-sm-2 col-lg-2">
                <v-button
                  :btnIcon="'fa-edit'"
                  :className="'btn-info btn-sm mt-2'"
                  v-if="dataselected"
                  :disabled="$v.schoolData.$invalid"
                  :btnName="$t('update')"
                  @onClick="onUpdate($event)"
                ></v-button>
                <v-button
                  :btnIcon="'fa-times'"
                  :className="'btn-danger btn-sm mt-2'"
                  v-if="dataselected"
                  :btnName="$t('cancel')"
                  @onClick="onCancel($event)"
                ></v-button>
                <v-button
                  :btnIcon="'fa-plus-circle'"
                  :className="'btn-primary'"
                  v-if="!dataselected"
                  :btnName="$t('add')"
                  :disabled="$v.schoolData.$invalid"
                  @onClick="onCreateHandler($event)"
                ></v-button>
              </div>
            </div>
          </div>
          <alert-box className="alert-secondary" iconName="fa fa-check-circle"
                     v-if="showAlert"
                     @onClose="onCloseAlert($event)">
            Sisteme Okul Ekleyebilmek İçin Sisteme Firma Kayıt Edilmelidir. Eklemek İçin
            <router-link tag="a" target="_blank" :to="'/company'">
              Buraya Tıklayın.
            </router-link>
          </alert-box>
        </div>

      </flex-card>

      <flex column="col-md-12 col-sm-12 col-lg-12">
        <div class="card">
          <div class="card-header border-0">
            <h3 class="mb-0">{{$t('schoollist')}}</h3>

            <div class="row">

              <div class="col-lg-12 col-md-12 col-sm-12 text-right">
                <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
                <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <small class="text ml-3">{{$t('searchScoolName')}}</small>
            <SearchBox @search="onSearchHandler($event)"></SearchBox>
            <vuetable
              ref="vuetable"
              noDataTemplate="Kayıt Bulunamadı"
              :append-params="moreParams"
              :fields="$store.getters.getSchoolsHeader"
              :http-fetch="onFetchApi"
              pagination-path
              :per-page="5"
              @vuetable:load-success="onSuccess"
              @vuetable:load-error="onError"
              @vuetable:pagination-data="onPaginationData"
              @vuetable:loading="onLoading"
              @vuetable:loaded="onLoaded"
            >
              <template slot="details" scope="props">
                <router-link to="a" class="font-weight-bold pl-5" :to="'/schools/'+props.rowData.id+'/students'">
                  {{$t('schoolstudents')}}
                </router-link>
                <router-link
                  tag="a"
                  style="cursor:pointer !important;"
                  class="font-weight-bold pl-5"
                  :to="'schools/'+props.rowData.id+'/clases'"
                >
                  {{$t('schoolclases')}}
                </router-link>
                <router-link tag="a" class="font-weight-bold pl-5" :to="'schools/'+props.rowData.id+'/persons'">
                  {{$t('schoolpersons')}}
                </router-link>
                <router-link
                  tag="a"
                  class="font-weight-bold pl-5"
                  :to="'/schools/'+props.rowData.id+'/lessons'"
                >
                  {{$t('schoollessons')}}
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
      </flex>
    </div>
  </div>
</template>

<script>

  import {
    Swal,
    appPlugin,
    required,
    AlertBox,
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'
  import vuetableMixins from '@/mixins/vuetable'
  import defaulcomponentsMixins from '@/mixins/defaultcomponents'
  export default {
    name: 'schollist',
    components: {
      AlertBox,
    },

    mixins: [loadingMixins,defaulcomponentsMixins,vuetableMixins],
    created () {
      this.onOpenIndıcator()
      this.$store.dispatch('fetchAllCompanies').then(res => {
        this.onCloseIndıcator()
        if (res.data.length < 1) {
          this.showAlert = true
        }
      })
    },
    methods: {
      exportallData () {
        this.onOpenIndıcator()
        this.$store.dispatch('fetchAllSchools').then((res) => {
          if (res.length > 0) {
            res.forEach((item) => {
              item.cName = item.get_companies.cName
            })
            let data = res
            let keys = ['sCode', 'sName', 'cName']
            const header = ['Okul Kodu', 'Okul Adı', 'Firma Adı']
            appPlugin.exportExcelTable(data, 'Okullar', 14, keys, header)
            this.onCloseIndıcator()
          } else {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
            )
          }
        }).catch((err) => {
          this.onCloseIndıcator()
        })
      },
      onUpdate () {
        if (this.$v.schoolData.company.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Lütfen  Firma Seçiniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.schoolData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterschoolcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.schoolData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterschoolname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          let data = {
            updated: this.schoolData,
            urlparse: appPlugin.urlParse(
              'sName=' +
              this.schoolData.name +
              '& sCode=' +
              this.schoolData.code +
              '& company_id=' +
              this.schoolData.company
            )
          }
          this.$store.dispatch('updateSchools', data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(
                  this.$t('updateSuccesMsg'),
                  '',
                  'success',
                  this.$t('ok')
                )
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('schooladdwarning'),
                  'warning',
                  this.$t('ok')
                )
              }
            } else {
              appPlugin.showalert(
                this.$t('updateErrorMsg'),
                '',
                'error',
                this.$t('ok')
              )
            }
            this.onRefreshTableContent()
            this.onCloseIndıcator()
            this.onResetData()
          })
        }
      },
      onCloseAlert (event) {
        this.showAlert = false
      },
      onSelectData (data) {

        this.dataselected = true
        this.schoolData = {
          name: data.sName,
          code: data.sCode,
          company: data.get_companies.id,
          id: data.id
        }
      },
      onDelete (item, i) {
        debugger
        Swal.fire({
          title: 'Okul Adı :' + ' ' + item.sName + '\n ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch('deleteSchools', {
                deleted: item,
                index: i
              })
              .then(res => {
                debugger
                if (res.status) {
                  if (res.status === 200) {
                    appPlugin.showalert(
                      this.$t('deleteRecordMsg'),
                      '',
                      'success',
                      this.$t('ok')
                    )
                  }
                } else {
                  appPlugin.showalert(
                    this.$t('deleteRecordErrMsg'),
                    '',
                    'error',
                    this.$t('ok')
                  )
                }
                this.onRefreshTableContent()
                this.onCloseIndıcator()
              })
          }
        })
      },
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length > 0) {
          let keys = ['sCode', 'sName', 'cName']
          const header = ['Okul Kodu', 'Okul Adı', 'Firma Adı']
          appPlugin.exportExcelTable(data, 'Okullar', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.schoolData = {
          name: '',
          code: '',
          company: ''
        }
      },
      onCreateHandler () {
        if (this.$v.schoolData.company.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Lütfen  Firma Seçiniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.schoolData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterschoolcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.schoolData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterschoolname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          let data = {
            created: this.schoolData,
            urlparse: appPlugin.urlParse(
              'sName=' +
              this.schoolData.name +
              '& sCode=' +
              this.schoolData.code +
              '& company_id=' +
              this.schoolData.company
            ),
            orqparse: appPlugin.urlParse('sCode=' + this.schoolData.code)
          }
          this.$store.dispatch('createSchools', data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('schoolwarning'),
                  'warning',
                  this.$t('ok')
                )
              }
            } else {
              appPlugin.showalert(
                this.$t('errorcreatemessage'),
                '',
                'error',
                this.$t('ok')
              )
            }
            this.onRefreshTableContent()
            this.onOpenIndıcator()
          })
        }
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch('fetchSchools', {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('sName%' + this.txt)
          })
          data.then(res => {
            console.log('lalal', res)
            res.data.data.forEach(item => {
              item.cName = item.get_companies.cName
            })
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchSchools', {
            httpOpt: httpOptions
          })
          data.then(res => {

            res.data.data.forEach(item => {
              item.cName = item.get_companies.cName
            })
            this.currentData = res
          })
          return data
        }
      }
    },
    data () {
      return {
        showAlert: false,
        moreParams: {},
        selectedData: {},
        currentData: [],
        txt: '',
        dataselected: false,
        schoolData: {
          name: '',
          company: '',
          code: ''
        }
      }
    },
    validations: {
      schoolData: {
        name: {
          required
        },
        code: {
          required
        },
        company: {
          required
        }
      }
    }
  }
</script>

<style scoped>
</style>
