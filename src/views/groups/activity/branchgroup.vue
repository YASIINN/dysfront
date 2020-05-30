<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="table-responsive">
      <small class="text ml-3">Grup adı veya koduna göre arama yapar</small>
      <SearchBox @search="onSearchHandler($event)"></SearchBox>
      <vuetable
        ref="vuetable"
        noDataTemplate="Kayıt Bulunamadı"
        :append-params="moreParams"
        :fields="schoolgroupheader"
        :http-fetch="onFetchApi"
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
</template>

<script>
  import {
    SearchBox,
    Loading,
    VSelect,
    AlertBox,
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
    name: 'schoolgroup',
    computed: {
      ...mapGetters({schoolgroupheader: "schoolgroupheader"})
    },
    data(){
      return {
        loading: false,
        moreParams: {},
        query: {
          search: 0,
          txt: ""
        },
      }
    },
    watch: {
      "query.txt"(){
        if(this.query.txt.trim() === ""){
          this.query.search = 0;
        }
      },
    },
    components: {
      SearchBox,
      Vuetable,
      Loading,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    methods: {
      goGroupMembers(data){
        this.$router.push({
          name: "groupmembers",
          params: { id: data.id, data: data }
        });
      },
      onChangePage(page) {
        this.$refs.vuetable.changePage(page);
      },
      onPaginationData(paginationData) {
        this.$refs.pagination.setPaginationData(paginationData);
        this.$refs.paginationInfo.setPaginationData(paginationData);
      },
      onLoading() {
        this.loading = true;
      },
      onLoaded() {
        this.loading = false;
      },
      onSearchHandler(txt) {
        this.query = {
          search: 1,
          txt: txt
        }
        this.$nextTick(function() {
          this.$refs.vuetable.refresh();
        });
      },
      onDelete(item, i) {},
      exportExcel() {},
      onResetData() {},
      onError () {
        this.loading = false
        appPlugin.showalert(
          this.$t('getRecordErro'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onSuccess() {
        /* succesFetchDataApi */
      },
      onCancel() {
        this.dataselected = !this.dataselected;
        this.onResetData();
      },
      onAction(action, data, index) {
        console.log("slot) action: " + action, data, index);
      },
      onRefreshTableContent() {
        this.$refs.vuetable.reload();
      },
      async onFetchApi(apiUrl, httpOptions) {
        var data;
        data = this.$store.dispatch("fetchActivityGradeGroup", {
          httpOpt: httpOptions,
          ...this.query
        });
        return data;
      }
    }
  }
</script>

<style scoped>

</style>
