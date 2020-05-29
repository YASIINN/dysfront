<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('addteam')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2 col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.teamData.club.$error}">
                <div class="input-group input-group-merge">
                  <v-select
                    :className="{'is-invalid':$v.teamData.club.$error}"
                    v-model.trim="$v.teamData.club.$model"
                    :propName="'scName'"
                    :bindData="'id'"
                    @onBlur="$v.teamData.club.$touch"
                    :optionData="$store.getters.getSporClubs"
                  ></v-select>
                  <div class="invalid-feedback">
                    <small v-if="!$v.teamData.club.required">{{$t('plaseSelectSporClub')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.teamData.code.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.teamData.code.$touch"
                    v-model="$v.teamData.code.$model"
                    :className="{'is-invalid':$v.teamData.code.$error}"
                    :placeHolder="$t('enterteamcode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.teamData.code.required">{{$t('pleaseenterteamcode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6">
              <div class="form-group" :class="{'has-danger':$v.teamData.name.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.teamData.name.$touch"
                    v-model="$v.teamData.name.$model"
                    :className="{'is-invalid':$v.teamData.name.$error}"
                    :placeHolder="$t('enterteamname')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.teamData.name.required">{{$t('pleaseenterteamname')}}</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm mt-2'"
                v-if="dataselected"
                :disabled="$v.teamData.$invalid"
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
                :disabled="$v.teamData.$invalid"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlert"
          @onClose="onCloseAlert($event)"
        >
          {{$t('sporclubmust')}}
          <router-link tag="a" target="_blank" :to="'/sporclub'">{{$t('clickHere')}}.</router-link>
        </alert-box>
      </div>
    </flex-card>
    <!--    <alert-box className="alert-secondary" iconName="fa fa-check-circle"
          v-if="showAlert"
           @onClose="onCloseAlert($event)"
        >
          Sisteme Okul Ekleyebilmek İçin Sisteme Firma Kayıt Edilmelidir. Eklemek İçin
          <router-link tag="a" target="_blank" :to="'/company'">
            Buraya Tıklayın.
          </router-link>
    </alert-box>-->

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6">
              <h3 class="mb-0">{{$t('sporteamlist')}}</h3>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchTeamName')}}</small>
          <SearchBox @search="onSearchHandler($event)"></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getTeamsHeader"
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
            <template slot="details" scope="props">
              <router-link
                to="a"
                class="font-weight-bold pl-5"
                :to="'/schools/'+props.rowData.id+'/students'"
              >{{$t('schoolstudents')}}
              </router-link>
              <router-link
                tag="a"
                style="cursor:pointer !important;"
                class="font-weight-bold pl-5"
                :to="'schools/'+props.rowData.id+'/clases'"
              >{{$t('schoolclases')}}
              </router-link>
              <router-link
                tag="a"
                class="font-weight-bold pl-5"
                :to="'schools/'+props.rowData.id+'/persons'"
              >{{$t('schoolpersons')}}
              </router-link>
              <router-link
                tag="a"
                class="font-weight-bold pl-5"
                :to="'/schools/'+props.rowData.id+'/lessons'"
              >{{$t('schoollessons')}}
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
    SearchBox,
    Loading,
    AlertBox,
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
    FETCH_TEAMS,
    CREATE_TEAMS,
    UPDATE_TEAMS,
    DELETE_TEAMS,
    FETCH_ALL_TEAMS
  } from '@/store/modules/team/moduleNames'
  import { FETCH__ALL_SPOR_CLUB } from '@/store/modules/sporclub/moduleNames'
  import loadingMixins from '@/mixins/loading'
  export default {
    name: 'index',
    validations: {
      teamData: {
        name: {
          required
        },
        code: {
          required
        },
        club: {
          required
        }
      }
    },
    mixins:[loadingMixins],
    created () {
        this.onOpenIndıcator()
      this.$store.dispatch(FETCH__ALL_SPOR_CLUB).then(res => {
        this.onCloseIndıcator()
        if (res.length < 1) {
          this.showAlert = true
        }
      })
    },
    methods: {
      onCloseAlert (event) {
        this.showAlert = false
      },
      onCancel () {
        this.dataselected = !this.dataselected
      },
      onUpdate () {
        if (this.$v.teamData.club.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('plaseSelectSporClub'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.teamData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('enterclubcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.teamData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('enterclubname'),
            'warning',
            this.$t('ok')
          )
        } else {
            this.onOpenIndıcator()
          let data = {
            updated: this.teamData
          }
          this.$store.dispatch(UPDATE_TEAMS, data).then(res => {
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
        this.teamData = {
          name: '',
          code: '',
          club: ''
        }
      },
      onSelectData (data) {
        this.dataselected = true
        this.teamData = {
          name: data.stName,
          code: data.stCode,
          club: data.sporclub.id,
          id: data.id
        }
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
      onCreateHandler () {
        if (this.$v.teamData.club.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('plaseSelectSporClub'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.teamData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('enterclubcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.teamData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('enterclubname'),
            'warning',
            this.$t('ok')
          )
        } else {
            this.onOpenIndıcator()
          let data = {
            code: this.teamData.code,
            name: this.teamData.name,
            club: this.teamData.club
          }
          this.$store.dispatch(CREATE_TEAMS, data).then(res => {
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
                  this.$t('teamwarning'),
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
      onLoaded () {
        this.onCloseIndıcator()
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onSuccess () {
        /* succesFetchDataApi */
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch(FETCH_TEAMS, {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('stName%' + this.txt)
          })
          data.then(res => {
            console.log('lalal', res)
            res.data.data.forEach(item => {
              item.cName = item.sporclub.scName
            })
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch(FETCH_TEAMS, {
            httpOpt: httpOptions
          })
          data.then(res => {
            res.data.data.forEach(item => {
              item.cName = item.sporclub.scName
            })
            this.currentData = res
          })
          return data
        }
      },
      onDelete (item, i) {
        Swal.fire({
          title:
            'Takım Adı :' + ' ' + item.stName + '\n ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
              this.onOpenIndıcator()
            this.$store
              .dispatch(DELETE_TEAMS, {
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
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length > 0) {
          //c name bak TODO
          let keys = ['stName', 'stCode', 'cName']
          const header = ['Takım  Kodu', 'Takım  Adı', 'Spor Kulübü Adı']
          appPlugin.exportExcelTable(data, 'Takımlar', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
      exportallData () {
          this.onOpenIndıcator()
        this.$store
          .dispatch(FETCH_ALL_TEAMS)
          .then(res => {
            console.log('tüm', res)
            if (res.length < 1) {
              appPlugin.showalert(
                this.$t('warning'),
                this.$t('excelExportWarning'),
                'info',
                this.$t('ok')
              )
            } else {
              res.forEach(item => {
                item.cName = item.sporclub.scName
              })
              let keys = ['stName', 'stCode', 'cName']
              const header = ['Takım  Kodu', 'Takım  Adı', 'Spor Kulübü Adı']
              appPlugin.exportExcelTable(res, 'Takımlar', 14, keys, header)
            }
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      }
    },
    data () {
      return {
        currentData: [],
        showAlert: false,
        moreParams: {},
        txt: '',
        dataselected: false,
        teamData: {
          name: '',
          code: '',
          club: ''
        },
        selectedData: {}
      }
    },
    components: {
      VSelect,
      AlertBox,
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
    }
  }
</script>

<style scoped>
</style>
