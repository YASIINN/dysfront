<template>
  <div>
    <Loading v-if="loading"></Loading>
    <tooltip
      title="Öğretmen Olarak Ata"
      @onClick="sporclubtaskstatus=0"
      class="btn-outline-success"
      text="Öğretmen Olarak Ata"
    ></tooltip>
    <tooltip
      title="Görevli Ata "
      @onClick="sporclubtaskstatus=1"
      class="float-right btn-outline-warning"
      text="Görevli Olarak Ata"
    ></tooltip>
    <flex-card column="col-md-12 col-sm-12 col-lg-12">
      <div class="card-body">
        <flex column="col-md-12 col-sm-12 col-lg-12">
          <label>Görevli Olduğu Spor Kulüpleri</label>
          <div class="form-group">
            <multiselect
              v-model="personSporClubData"
              track-by="scName"
              @close="onTouch"
              @input="onChangeSporClub"
              :allow-empty="false"
              label="scName"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="false"
              deselectLabel
              :options="$store.getters.getSporClubs"
              :searchable="true"
              :close-on-select="true"
              :show-labels="true"
              placeholder="Spor Kulübü Seçiniz"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">Lütfen Spor Kulübü Seçiniz</small>
          </div>
        </flex>
        <flex v-if="sporclubtaskstatus==0" column="col-md-12">
          <label>
            Görevli Olduğu
            Takımlar Ve Şubeler
          </label>
          <div class="form-group">
            <multiselect
              v-model="sporClubTB"
              track-by="tb"
              @close="onTouch"
              :allow-empty="true"
              label="tb"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="true"
              deselectLabel
              :options="sporClubTBData"
              :searchable="true"
              :close-on-select="false"
              :show-labels="true"
              placeholder="Sınıf Seçiniz"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">Lütfen Sınıf Seçiniz</small>
          </div>
        </flex>

        <div class="col-md-12 col-sm-12 col-lg-12 mt-5">
          <v-button
            :btnIcon="'fa-save'"
            :className="'btn-success float-right'"
            :btnName="'Kaydet'"
            @onClick="saveUserSporClub"
          ></v-button>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  import tooltip from '@/components/tooltip'
  import {
    VTabs,
    FlexCard,
    VTabContent,
    MaskedInput,
    SearchBox,
    Loading,
    Multiselect,
    VSelect,
    Flex,
    VButton,
    VInput,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import { Datetime } from 'vue-datetime'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    props: {
      user: {}
    },
    computed: {
      isInvalid () {
        return this.isTouched && this.personSporClubData === 0
      }
    },
    name: 'sporclubtaskcreate',
    methods: {
      saveUserSporClub () {
        if (this.sporclubtaskstatus == 0) {
          if (this.personSporClubData.length < 1) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personelin Görevli Olduğu Spor Kulübünü Seçiniz',
              'info',
              'Tamam'
            )
          } else if (this.sporClubTB.length < 1) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personelin Görevli Olduğu Spor Kulübüne Ait Takım ve Şube Seçiniz',
              'info',
              'Tamam'
            )
          } else {
            this.savePersonSC()
          }
        } else {
          if (this.personSporClubData.length < 1) {
            appPlugin.showalert(
              'Uyarı',
              'Lütfen Personelin Görevli Olduğu Spor Kulübünü Seçiniz',
              'info',
              'Tamam'
            )
          } else {
            this.savePersonSC()
          }
        }
      },
      savePersonSCTeamBranch (userID) {

        this.onOpenIndıcator()
        let data = []
        this.sporClubTB.forEach(item => {
          data.push({
            userid: userID,
            sporclubid: item.spor_club_id,
            teamid: item.team_id,
            branchid: item.sbranch_id
          })
        })
        this.$store
          .dispatch('createUserSporClubTeam', { usersporclubteamlist: data })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.personSporClubData = []
                this.sporClubTB = []
                appPlugin.showalert(
                  'Personel Görevlendirme İşlemi Başarılı',
                  '',
                  'success',
                  'Tamam'
                )
                this.onCloseIndıcator()
              } else {
                appPlugin.showalert(
                  'Uyarı',
                  'Personel Spor Kulübü Takımlarına Görevlendirilirken Hata Gerçekleşti ',
                  'error',
                  'Tamam'
                )
                this.onCloseIndıcator()
              }
            } else {
              appPlugin.showalert(
                'Uyarı',
                'Personel Spor Kulübü Takımlarına Görevlendirilirken Hata Gerçekleşti ',
                'error',
                'Tamam'
              )
              this.onCloseIndıcator()
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(
              'Uyarı',
              'Personel Spor Kulübü Takımlarına Görevlendirilirken Hata Gerçekleşti ',
              'error',
              'Tamam'
            )
          })
      },
      savePersonSC () {
        this.onOpenIndıcator()
        this.$store
          .dispatch('createUserSporClub', {
            usersporclublist: [
              {
                sporclubid: this.personSporClubData.id,
                userid: this.user.id
              }
            ]
          })
          .then(res => {
            if (this.sporclubtaskstatus == 1) {
              this.personSporClubData = []
              this.sporClubTB = []
              appPlugin.showalert(
                'Personel Görevlendirme İşlemi Başarılı',
                '',
                'success',
                'Tamam'
              )
              this.onCloseIndıcator()
            } else {
              this.savePersonSCTeamBranch(this.user.id)
            }
          })
          .catch(err => {
          })
      },
      onChangeSporClub (data) {
        this.onOpenIndıcator()

        this.$store
          .dispatch('fetchAllSCTeamBranch', {
            query: appPlugin.urlParse(
              'spor_club_team_branch.spor_club_id=' + data.id
            )
          })
          .then(res => {
            if (res.status == 200 && res.data) {
              res.data.forEach(item => {
                item.tb = item.stName + ' ' + item.sbName
              })
              this.sporClubTBData = res.data
            }
            this.onCloseIndıcator()
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      },
      onTouch () {
        this.isTouched = true
      }
    },
    data () {
      return {
        personSporClubData: [],
        isTouched: false,
        sporClubTB: [],
        sporClubTBData: [],
        sporclubtaskstatus: 0
      }
    },
    components: {
      tooltip,
      Flex,
      FlexCard,
      VSelect,
      VTabs,
      VTabContent,
      MaskedInput,
      SearchBox,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Multiselect,
      datetime: Datetime,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    }
  }
</script>

<style scoped>
</style>
