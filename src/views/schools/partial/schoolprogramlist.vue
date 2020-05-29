<template>
  <flex-card column="col-lg-12" headerTitle="Ders Programı Listesi">
    <Loading v-if="loading"></Loading>
    <div class="card-body">
      <vtable
        @detClick="clickDetail($event)"
        :detailVisible="true"
        :edit-visible="edit"
        :del-visible="true"
        @edClick="editClick($event)"
        @delClick="deleteClick($event)"
        :columns="$store.getters.getSchoolProgramTypeHeader"
        :rows="$store.getters.getSchoolProgramType"
        :table-title="$store.getters.getSchoolProgramTypeHeader"
      ></vtable>
    </div>
  </flex-card>
</template>

<script>
  import {
    Multiselect,
    VTabs,
    VTabContent,
    SearchBox,
    Loading,
    AlertBox,
    FlexCard,
    Flex,
    VButton,
    VTooltipButton,
    Vuetable,
    Swal,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import vtable from '@/components/table'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    created () {
      this.fetchSchoolProgramData()
    },
    data () {
      return {
        edit: false,
        del: false,
        col: [],
        row: [],
        title: []
      }
    },
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.fetchSchoolProgramData()
        }
      }
    },

    methods: {
      async fetchSchoolProgramData () {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchSchoolProgramType')
        this.onCloseIndıcator()

      },
      clickDetail ($event) {
        this.$router.push('/schools/programs/' + $event.item.pivotid + '/detail')
        console.log('detaya', $event)
      },
      editClick ($event) {
      },
      deleteClick ($event) {
        Swal.fire({
          title:
            'Okul Adı :' +
            $event.item.schoolname +
            '\n' +
            'Program Adı :' +
            $event.item.programtypename +
            '\n' +
            ' Silmek İstediğinize Emin Misiniz ?',
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.$store
              .dispatch('deleteSchoolProgramType', {
                id: $event.item.pivotid,
                index: $event.i
              })
              .then(res => {
                if (res && res.status == 200) {
                  appPlugin.showalert(
                    this.$t('deleteRecordMsg'),
                    '',
                    'success',
                    this.$t('ok')
                  )
                }
              })
              .catch(err => {
                appPlugin.showalert(
                  this.$t('deleteRecordErrMsg'),
                  '',
                  'error',
                  this.$t('ok')
                )
              })
          } else {
          }
        })
      }
    },
    props: {
      onreset: {}
    },
    name: 'schoolprogramlist',
    components: {
      vtable,
      FlexCard,
      Loading
    }
  }
</script>

<style scoped>
</style>
