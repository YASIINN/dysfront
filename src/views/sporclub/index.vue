<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('addsporclub')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2 col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.sporClubData.company.$error}">
                <div class="input-group input-group-merge">
                  <v-select
                    :className="{'is-invalid':$v.sporClubData.company.$error}"
                    v-model.trim="$v.sporClubData.company.$model"
                    :propName="'cName'"
                    :bindData="'id'"
                    @onBlur="$v.sporClubData.company.$touch"
                    :optionData="$store.getters.getCompanies"
                  ></v-select>
                  <div class="invalid-feedback">
                    <small v-if="!$v.sporClubData.company.required">Lütfen Şirket Seçiniz</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.sporClubData.code.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.sporClubData.code.$touch"
                    v-model="$v.sporClubData.code.$model"
                    :className="{'is-invalid':$v.sporClubData.code.$error}"
                    :placeHolder="$t('entersporclubcode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.sporClubData.code.required">{{$t('pleaseentersporclubcode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6">
              <div class="form-group" :class="{'has-danger':$v.sporClubData.name.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.sporClubData.name.$touch"
                    v-model="$v.sporClubData.name.$model"
                    :className="{'is-invalid':$v.sporClubData.name.$error}"
                    :placeHolder="$t('entersporclubname')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.sporClubData.name.required">{{$t('pleaseentersporclubname')}}</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm mt-2'"
                v-if="dataselected"
                :disabled="$v.sporClubData.$invalid"
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
                :disabled="$v.sporClubData.$invalid"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlert"
          @onClose="showAlert=false"
        >
          Sisteme Spor Kulübü Ekleyebilmek İçin Sisteme Firma Kayıt Edilmelidir. Eklemek İçin
          <router-link tag="a" target="_blank" :to="'/company'">Buraya Tıklayın.</router-link>
        </alert-box>
      </div>
    </flex-card>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{$t('sporclublist')}}</h3>
            </div>
            <div class="col-6 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchSporClubName')}}</small>
          <SearchBox @search="onSearchHandler($event)"></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getSporClubTitles"
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
              <router-link
                tag="a"
                style="cursor:pointer !important;"
                class="font-weight-bold pl-5"
                :to="'sporclub/'+props.rowData.id"
              >Detay
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
</template>

<script>
  import {
    AlertBox,
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    VButton,
    required,
    VInput,
    VTooltipButton,
    Swal,
    Vuetable,
    VSelect,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import {
    FETCH_SPOR_CLUBS,
    CREATE_SPOR_CLUBS,
    UPDATE_SPOR_CLUB,
    DELETE_SPOR_CLUB,
    FETCH__ALL_SPOR_CLUB
  } from '@/store/modules/sporclub/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'index',
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
      onSelectData (data) {
        this.dataselected = true
        this.sporClubData = {
          name: data.scName,
          code: data.scCode,
          company: data.get_companies.id,
          id: data.id
        }
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch(FETCH_SPOR_CLUBS, {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('scName%' + this.txt)
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
          data = this.$store.dispatch(FETCH_SPOR_CLUBS, {
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
      },
      onDelete (item, i) {
        Swal.fire({
          title:
            'Spor Kulübü Adı :' +
            ' ' +
            item.scName +
            '\n ' +
            this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch(DELETE_SPOR_CLUB, {
                deleted: item,
                index: i
              })
              .then(res => {
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
      onError (err) {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('getRecordErro'), '', 'error', this.$t('ok'))
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onLoading () {
        this.onOpenIndıcator()
      },
      onLoaded () {
        this.onCloseIndıcator()
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onSuccess () {
        /* succesFetchDataApi */
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length > 0) {
          let keys = ['scCode', 'scName', 'cName']
          const header = ['Spor Kulübü Kodu', 'Spor Kulübü Adı', 'Firma Adı']
          appPlugin.exportExcelTable(data, 'Spor Kulüpleri', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
      onCancel () {
        this.dataselected = !this.dataselected
      },
      onUpdate () {
        if (this.$v.sporClubData.company.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Lütfen  Firma Seçiniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.sporClubData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Spor Kulübü Kodu Giriniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.sporClubData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Spor Kulübü Adı Giriniz',
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()

          let data = {
            updated: this.sporClubData
          }

          this.$store.dispatch(UPDATE_SPOR_CLUB, data).then(res => {
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
                  this.$t('sporclubwarning'),
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
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.sporClubData = {
          name: '',
          code: '',
          company: ''
        }
      },
      onCreateHandler () {
        if (this.$v.sporClubData.company.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Lütfen  Firma Seçiniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.sporClubData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Spor Kulübü Kodu Giriniz',
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.sporClubData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            'Spor Kulübü Adı Giriniz',
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          let data = {
            code: this.sporClubData.code,
            name: this.sporClubData.name,
            cid: this.sporClubData.company
          }
          this.$store.dispatch(CREATE_SPOR_CLUBS, data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(
                  this.$t('succescreatemessage'),
                  '',
                  'success',
                  this.$t('ok')
                )
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
            this.onCloseIndıcator()
          })
        }
      },
    },
    validations: {
      sporClubData: {
        name: {
          required
        },
        code: {
          required
        },
        company: { required }
      }
    },
    components: {
      AlertBox,
      VSelect,
      SearchBox,
      FlexCard,
      Flex,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    data () {
      return {
        showAlert: false,
        currentData: [],
        moreParams: {},
        txt: '',
        dataselected: false,
        sporClubData: {
          name: '',
          code: '',
          company: ''
        },
        selectedData: {}
      }
    }
  }
</script>

<style scoped>
</style>
