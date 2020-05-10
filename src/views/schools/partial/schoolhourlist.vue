<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="row">
      <div class="col-lg-12">
        <div class="table-responsive">
          <v-table
            :detailVisible="false"
            :edit-visible="true"
            :del-visible="true"
            @edClick="editClick($event)"
            @delClick="deleteClick($event)"
            :columns="$store.getters.getSchoolHourHeader"
            :rows="$store.getters.getSchoolHour"
            :table-title="$store.getters.getSchoolHourHeader"
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
  import { appPlugin, Swal } from '@/Providers/defaultImports'

  export default {
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.onRefresh()
        }
      }
    },
    components: {
      VTable,
      Loading
    },
    name: 'schoolhourlist',
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
      return {
        loading: false
      }
    },
    created () {
      this.onFetchApi()
    },
    methods: {
      editClick (data) {
        this.$emit('onSelected', data)
      },
      deleteClick (data) {
        Swal.fire({
          title:
            'Ders Adı :' + data.item.shName + ' ' + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('cancel'),
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true

            this.$store
              .dispatch('deleteSchoolHours', {
                urlparse: appPlugin.urlParse('id=' + data.item.id),
                index: data.i
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

                this.loading = false
              })
          }
        })
      },
      onRefresh () {
        this.onFetchApi()
      },
      onDeleteUserSchool (item, i) {
      },

      async onFetchApi () {
        this.loading = true
        await this.$store.dispatch('fetchSchoolHours', {
          urlparse: appPlugin.urlParse(
            'school_p_type_id=' + this.$route.params.id
          )
        })
        this.loading = false
      }
    }
  }
</script>

<style scoped></style>
