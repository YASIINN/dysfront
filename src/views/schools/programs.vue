<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" headerTitle="Ders Programı Oluştur">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-5 col-sm-5 col-lg-5">
              <div class="form-group">
                <div
                  class="input-group input-group-merge"
                  :class="{ 'has-danger': isInvalid }"
                >
                  <multiselect
                    v-model="selectedSchool"
                    track-by="sName"
                    :hide-selected="false"
                    @close="onTouch"
                    :allow-empty="false"
                    label="sName"
                    :selectedLabel="$t('selected')"
                    :selectLabel="$t('select')"
                    deselectLabel
                    :multiple="false"
                    :options="$store.getters.getSchools"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    :placeholder="$t('selectclass')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">Lütfen Okul Seçiniz</small>
                </div>
              </div>
            </div>
            <div class="col-md-5 col-sm-5 col-lg-5">
              <div class="form-group">
                <div
                  class="input-group input-group-merge"
                  :class="{ 'has-danger': isInvalid }"
                >
                  <multiselect
                    v-model="selectedProgramType"
                    track-by="ptName"
                    :hide-selected="false"
                    @close="onTouch"
                    :allow-empty="false"
                    label="ptName"
                    :selectedLabel="$t('selected')"
                    :selectLabel="$t('select')"
                    deselectLabel
                    :multiple="false"
                    :options="$store.getters.getProgramType"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    :placeholder="$t('selectclass')"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">Lütfen Ders Program Türü Seçiniz</small>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :disabled="isInvalid"
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="$t('add')"
                @onClick="onFormControl($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <schoolprogramlist :onreset="resettable"></schoolprogramlist>

  </div>
</template>

<script>
  import schoolprogramlist from './partial/schoolprogramlist'
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
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'programs',
    components: {
      Multiselect,
      schoolprogramlist,
      AlertBox,
      VTabs,
      Flex,
      FlexCard,
      VTabContent,
      SearchBox,
      Loading,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    created () {
      this.fetchAllSchool()
      this.fetchAllProgramTypes()
    },
    methods: {
      onResetData () {
        this.selectedSchool = {}
        this.selectedProgramType = {}
      },
      onFormControl () {
        if (this.selectedSchool.id == undefined) {
          appPlugin.showalert('Uyarı', 'Lütfen Okul Seçiniz', 'info', 'Tamam')
        } else if (this.selectedProgramType.id == undefined) {
          appPlugin.showalert('Uyarı', 'Lütfen Ders Programı Türünü Seçiniz', 'info', 'Tamam')
        } else {
          this.onCreateHandler()
        }
      },
      onCreateHandler () {
        let data = {
          schoolid: this.selectedSchool.id,
          ptypeid: this.selectedProgramType.id
        }
        this.onOpenIndıcator()
        this.$store.dispatch('createSchoolProgramType', data).then((res) => {
          if (res && res.status == 200) {
            this.onResetData()
            this.$store.dispatch('fetchSchoolProgramType')
            appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
          } else if (res.status === 204) {
            appPlugin.showalert('Uyarı', 'İlgili Okula Ait Seçilen Program Türü Mevcut',
              'info', this.$t('ok'))
          }
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
        })
      },
      onTouch () {
        this.isTouched = true
      },
      async fetchAllSchool () {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchAllSchools')
        this.onCloseIndıcator()


      },
      async fetchAllProgramTypes () {
        this.onOpenIndıcator()
        await this.$store.dispatch('fetchAllProgramTypes')
        this.onCloseIndıcator()
      }
    },
    computed: {
      isInvalid () {
        return (
          this.isTouched &&
          (this.selectedProgramType.id == undefined || this.selectedSchool.id == undefined)
        )
      }
    },
    data () {
      return {

        resettable: false,
        isTouched: !false,
        selectedSchool: {},
        selectedProgramType: {},
      }
    }
  }
</script>

<style scoped>

</style>
