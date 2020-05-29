<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="header">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label>Sınıflar</label>
                <div class="input-group input-group-merge">
                  <multiselect
                    @select="onChangeClass"
                    v-model="selectedClass"
                    track-by="scbranch"
                    @close="onTouch"
                    :allow-empty="true"
                    label="scbranch"
                    selectedLabel="Seçili"
                    selectLabel="Seç"
                    :hide-selected="false"
                    :multiple="false"
                    deselectLabel
                    :options="clasbranches"
                    :searchable="true"
                    :close-on-select="true"
                    :show-labels="true"
                    placeholder="Sınıf Seçiniz"
                  ></multiselect>
                  <small v-if="isInvalid" style="color: red">Lütfen Sınıf Seçiniz</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </flex-card>

    <alert-box
      class="alert-secondary"
      iconName="fa fa-check-circle"
      v-if="showalert"
      @onClose="onCloseAlert($event)"
    >Ders Programı Oluşturabilmek İçin Sistem Gün ve Saat Kaydı Girimelidir.
    </alert-box>
    <flex-card column="col-lg-12" v-show="!isInvalid">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12">
              <createprogramtable
                :fetchscoollesson="onreset"
                :showVisible="showVisible"
                :selectedClass="selectedClass"
                :school="school"
              ></createprogramtable>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  import {
    Swal,
    SearchBox,
    Loading,
    VSelect,
    AlertBox,
    FlexCard,
    Flex,
    VButton,
    VTabs,
    VTabContent,
    Multiselect,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import Createprogramtable from './createprogramtable'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'createschoolprogram',
    watch: {
      school (val) {
        this.fetchSchoolClassBranch()
      },
      onreset (val) {
        if (val == true) {
          this.selectedClass = []
        }
      }
    },
    data () {
      return {
        showalert: false,
        ontouch: false,
        selectedClass: [],
        clasbranches: [],
      }
    },
    created () {
      this.fetchSchoolClassBranch()
      if (
        this.$store.getters.getSchoolDays.length < 1 ||
        this.$store.getters.getSchoolHour.length < 1
      ) {
        this.showalert = true
      }
    },
    computed: {
      isInvalid () {
        return this.selectedClass.clases_id == undefined
      }
    },
    props: {
      onreset: {},
      showVisible: {},
      school: {},
      header: {}
    },
    methods: {
      onCloseAlert () {
        this.showalert = false
      },
      onChangeClass (data) {
      },
      onTouch () {
        this.ontouch = true
      },

      fetchSchoolClassBranch () {
        /* alert(this.school.schoolid)*/
        this.onOpenIndıcator()

        this.$store
          .dispatch('fetchSchoolClasesBranchesPivotAll', {
            urlparse: appPlugin.urlParse('school_id=' + this.school.schoolid)
          })
          .then(res => {
            this.onCloseIndıcator()
            if (res.status == 200 && res.data.length > 0) {
              res.data.forEach(item => {
                item.scbranch = item.cName + ' ' + item.bName
              })
              this.clasbranches = res.data
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(
              'Uyarı',
              'Beklenmeyen Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
              'info',
              'Tamam'
            )
          })
      }
    },
    components: {
      Createprogramtable,
      AlertBox,
      Multiselect,
      VSelect,
      VTabs,
      FlexCard,
      Flex,
      VTabContent,
      SearchBox,
      Loading,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    }
  }
</script>

<style scoped></style>
