<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('dtypeadd')">
      <div class="card-body">
        <flex column="col-md-2"></flex>
        <div class="row">
          <div class="col-md-9 col-sm-9 col-lg-9">
            <div class="form-group" :class="{ 'has-danger': $v.dtypeData.name.$error }">
              <div class="input-group input-group-merge">
                <v-input
                  @onBlurInput="$v.dtypeData.name.$touch"
                  v-model.trim="$v.dtypeData.name.$model"
                  :className="{ 'is-invalid': $v.dtypeData.name.$error }"
                  :placeHolder="$t('filldtype')"
                  :inputType="'text'"
                ></v-input>

                <div class="invalid-feedback">
                  <small v-if="!$v.dtypeData.name.required">{{$t('filldtype')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-sm-3 col-lg-3">
            <v-button
              :btnIcon="'fa-edit'"
              :className="'btn-info btn-sm'"
              v-if="dataselected"
              :btnName="$t('update')"
              :disabled="$v.dtypeData.$invalid"
              @onClick="onUpdate($event)"
            ></v-button>
            <v-button
              :btnIcon="'fa-times'"
              :className="'btn-danger btn-sm'"
              v-if="dataselected"
              :btnName="$t('cancel')"
              @onClick="onCancel($event)"
            ></v-button>
            <v-button
              :disabled="$v.dtypeData.$invalid"
              :btnIcon="'fa-plus-circle'"
              :className="'btn-primary'"
              v-if="!dataselected"
              :btnName="$t('add')"
              @onClick="onCreateHandler($event)"
            ></v-button>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">{{$t('dtypeslist')}}</h3>
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6">
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <small class="text ml-3">{{$t('dtypesearch')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getDTypeHeader"
            :http-fetch="onFetchApi"
            :noDataTemplate="$t('noData')"
            pagination-path
            :per-page="5"
            @vuetable:load-success="onSuccess"
            @vuetable:load-error="onError"
            @vuetable:pagination-data="onPaginationData"
            @vuetable:loading="onLoading"
            @vuetable:loaded="onLoaded"
          >
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
  import { FETCH_PDTYPE, CREATE_DTYPE, DELETE_DTYPE, UPDATE_DTYPE } from '@/store/modules/dtype/moduleNames'
  import {
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    VButton,
    required,
    VInput,
    VTooltipButton,
    Vuetable,
    Swal,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'

  export default {
    name: 'index',
    components: {
      Flex,
      FlexCard,
      SearchBox,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    validations: {
      dtypeData: {
        name: {
          required
        },
      }
    },
    data () {
      return {
        currentData: [],
        moreParams: {},
        txt: '',
        loading: false,
        dataselected: false,
        dtypeData: {
          name: '',
          code: ''
        },
        selectedData: {}
      }
    },

    created () {
    },
    methods: {
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onLoading () {
        this.loading = true
      },
      onLoaded () {
        this.loading = false
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onDelete (item, i) {
        Swal.fire({
          title: item.dtName + ' ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch(DELETE_DTYPE, {
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
                this.loading = false
              })
          }
        })
      },
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.dtypeData = {
          name: '',
        }
      },
      onError (err) {

        this.loading = false

        appPlugin.showalert(
          this.$t('getRecordErro'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onUpdate () {
        if (this.$v.dtypeData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('filldtype'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch(UPDATE_DTYPE, this.dtypeData).then(res => {
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
                  this.$t('titlewarning'),
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
            this.loading = false
            this.onResetData()
          })
        }
      },
      onSuccess () {
        /* succesFetchDataApi */
      },
      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onSelectData (data) {
        this.dataselected = true
        this.dtypeData = {
          name: data.dtName,
          id: data.id
        }
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch(FETCH_PDTYPE, {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('dtName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {

          data = this.$store.dispatch(FETCH_PDTYPE, {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onCreateHandler () {
        if (this.$v.dtypeData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('filldtype'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          let data = {
            created: this.dtypeData,
          }
          this.$store.dispatch(CREATE_DTYPE, data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
                this.onRefreshTableContent()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('titlewarning'),
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
            this.loading = false
          })
        }
      }
    }
  }
</script>

<style scoped></style>
