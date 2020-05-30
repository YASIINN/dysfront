<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="'Arama Filtresi'">
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
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
                  v-model="filterData.fullname"
                  :inputType="'text'"
                ></v-input>
              </div>
            </div>
          </div>
          <div class="col-md-6">
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
                  v-model="filterData.email"
                  :inputType="'text'"
                ></v-input>
              </div>
            </div>
          </div>
        </div>
        <v-button
          :btnIcon="'fa-search'"
          :className="'btn-info float-right'"
          btnName="Ara"
          @onClick="onSearchMembers"
        ></v-button>
        <v-button
          :btnIcon="'fa-trash'"
          :className="'btn-danger float-right'"
          btnName="Temizle"
          @onClick="onSearchReset"
        ></v-button>
      </div>
    </flex-card>

    <flex column="col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-6">
              <h3 class="mb-0">Üye Olmayan Kullanıcılar</h3>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="groupmemberheader"
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
            <template slot="image" scope="props">
              <img
                v-if="props.rowData.image ==''"
                :src="imgdefault"
                width="50"
                height="50"
              />
              <img v-else :src="props.rowData.image" width="50" height="50" />
            </template>
            <template slot="actions" scope="props">
              <div class="custom-actions">
                <button class="btn btn-primary btn-sm" @click="onSelectData(props.rowData)">Gruba Ekle</button>
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
    VInput,
    VTooltipButton,
    Vuetable,
    Swal,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import imgdefault from "@/assets/img/default-pp.png";
  import {mapGetters} from "vuex";
  export default {
    name: 'index',
    props: ["groupId", "state", "type"],
    computed: {
      ...mapGetters({groupmemberheader: "groupmemberheader"})
    },
    watch: {
      state(){
        this.onRefreshTableContent();
      }
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
    data () {
      return {
        imgdefault,
        currentData: [],
        moreParams: {},
        query: {
          search: 0,
          fullname: "",
          email: "",
        },
        filterData: {
          fullname:"",
          email: "",
        },
        loading: false,
        dataselected: false,
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
      onSearchMembers () {
        this.query = {
          search: 1,
          fullname: this.filterData.fullname,
          email: this.filterData.email
        }
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onSearchReset () {
        this.dataselected = false
        this.selectedData = {}
        this.filterData = {
          fullname: "",
          email: ""
        }
        this.query = {
          search: 0,
          ...this.filterData
        }
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
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
      onSuccess () {
        /* succesFetchDataApi */
      },
      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onSelectData (data) {
          this.$emit("assignmember", data);
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      async onFetchApi(apiUrl, httpOptions) {
        this.query = {
          ...this.query,
          group_id: this.groupId,
          type: this.type
        }
        var data;
        data = this.$store.dispatch("fetchGroupDoesntMembers", {
          httpOpt: httpOptions,
          ...this.query
        });
        return data;
      },
    }
  }
</script>

<style scoped></style>
