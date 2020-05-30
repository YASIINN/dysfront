<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="'Grup Adı Giriniz'">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-8">
              <div class="form-group" :class="{ 'has-danger': $v.groupData.name.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.groupData.name.$touch"
                    v-model.trim="$v.groupData.name.$model"
                    :className="{ 'is-invalid': $v.groupData.name.$error }"
                    :placeHolder="$t('entergroupname')"
                    :inputType="'text'"
                  ></v-input>

                  <div class="invalid-feedback">
                    <small v-if="!$v.groupData.name.required">{{$t('pleaseentergroupname')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info'"
                v-if="dataselected"
                :btnName="$t('update')"
                :disabled="$v.groupData.$invalid"
                @onClick="onUpdate($event)"
              ></v-button>
              <v-button
                :btnIcon="'fa-times'"
                :className="'btn-danger'"
                v-if="dataselected"
                :btnName="$t('cancel')"
                @onClick="onCancel($event)"
              ></v-button>
              <v-button
                :disabled="$v.groupData.$invalid"
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                v-if="!dataselected"
                :btnName="$t('add')"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">{{$t('group')}}</h3>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchgroup')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="customgroupheader"
            :http-fetch="onFetchApi"
            noDataTemplate="Kayıt Bulunamadı"
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
                <button class="btn btn-primary btn-sm" @click="onSelectData(props.rowData)">Düzenle</button>
                <button class="btn btn-danger btn-sm" @click="onDelete(props.rowData, props.rowIndex)">Sil</button>
                <button class="btn btn-success btn-sm" @click="goGroupMembers(props.rowData)">Kullanıcılar</button>
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
 import {mapGetters} from "vuex";
  export default {
    name: 'index',
    computed: {
      ...mapGetters({customgroupheader: "customgroupheader"})
    },
    components: {
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
    validations: {
      groupData: {
        name: {
          required
        }
      }
    },
    data () {
      return {
        currentData: [],
        moreParams: {},
        query: {
          search: 0,
          txt: ""
        },
        loading: false,
        dataselected: false,
        groupData: {
          name: '',
        },
        selectedData: {}
      }
    },
    watch: {
      "query.txt"(){
        if(this.query.txt.trim() === ""){
          this.query.search = 0;
        }
      },
    },
    created () {
    },
    methods: {
      goGroupMembers(data){
        this.$router.push({
          name: "groupmembers",
          params: { id: data.id, data: data }
        });
      },
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
        this.query = {
          search: 1,
          txt: txt
        }
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onDelete (item, i) {
        console.log(item);
        Swal.fire({
          title: 'Firma Adı :' + ' ' + item.name + '\n ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          icon: 'info',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch('deleteCustomGroup', {
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
        this.groupData = {
          name: '',
          code: "",
        }
      },
      onError () {
        this.loading = false
        appPlugin.showalert(
          this.$t('getRecordErro'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onUpdate () {
        if (this.$v.groupData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseentergroupname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch('updateCustomGroup', this.groupData).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(
                  this.$t('updateSuccesMsg'),
                  '',
                  'success',
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
        this.groupData = {
          name: data.name,
          id: data.groupable_id,
        }
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      async onFetchApi(apiUrl, httpOptions) {
        console.log(this.query);
        var data;
        data = this.$store.dispatch("fetchCustomGroup", {
          httpOpt: httpOptions,
          ...this.query
        });

        return data;
      },
      onCreateHandler () {
        if (this.$v.groupData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseentergroupname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch('createCustomGroup', this.groupData).then(res => {
            if (res.status) {
              if (res.status === 201) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('groupwarningerror'),
                  '',
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
