import appPlugin from '@/Providers/appPlugins'

const vuetableMixins = {
  methods: {
    onSuccess () {
      /* succesFetchDataApi */
    },
    onCancel () {
      this.dataselected = !this.dataselected
      this.onResetData()
    },
    onRefreshTableContent () {
      this.$refs.vuetable.reload()
    },
    onLoading () {
      this.onOpenIndıcator()
    },
    onLoaded () {
      this.onCloseIndıcator()
    },
    onSearchHandler (txt) {
      this.txt = txt
      this.$nextTick(function () {
        this.$refs.vuetable.refresh()
      })
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    onPaginationData (paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onError () {
      this.onCloseIndıcator()
      appPlugin.showalert(
        this.$t('getRecordErro'),
        '',
        'error',
        this.$t('ok')
      )
    },
  },
  data () {
    return {
      currentData: [],
      moreParams: {},
      txt: '',
      dataselected: false,
      selectedData: {}
    }
  }
}
export default vuetableMixins
