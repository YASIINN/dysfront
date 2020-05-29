<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="row">
      <div class="col-lg-12">
        <div class="table-responsive pt-2">
          <v-table
            :detailVisible="false"
            :edit-visible="false"
            :del-visible="true"
            @delClick="deleteClick($event)"
            :columns="$store.getters.getSchoolDaysHeader"
            :rows="$store.getters.getSchoolDays"
            :table-title="$store.getters.getSchoolDaysHeader"
          >
          </v-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Loading from '@/components/loading'
  import VTable from '@/components/table'
  import { appPlugin, Swal, VButton } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.onRefresh()
        }
      }
    },
    components: {
      VTable,
      VButton,
      Loading
    },
    name: 'schooldaylist',
    props: {
      showDelete: {},
      user: {},
      tabKey: {},
      icon: {},
      title: {},
      loadSchoolTask: {},
      onreset: {}
    },
    data () {
      return {}
    },
    created () {
      this.onFetchApi()
    },
    methods: {
      deleteClick (data) {
        Swal.fire({
          title:
            'Gün Adı :' + data.item.sdName + ' ' + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('cancel'),
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()

            this.$store
              .dispatch('deleteSchoolDays', {
                urlparse: appPlugin.urlParse('id=' + data.item.id),
                index: data.i
              })
              .then(res => {
                if (res.status) {
                  if (res.status === 200) {
                    this.$emit('onDelete', false)
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

                this.onCloseIndıcator()
              })
          }
        })
      },
      onRefresh () {
        this.onFetchApi()
      },
      async onFetchApi () {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchSchoolDays', {
          urlparse: appPlugin.urlParse(
            'school_p_type_id=' + this.$route.params.id
          )
        })

        this.onCloseIndıcator()
      }
    }
  }
</script>

<style scoped></style>
