<template>
  <div>
    <Loading v-if="loading"></Loading>
    <v-button
      :btnIcon="'fa-save'"
      :className="'btn-outline-success btn-sm float-left'"
      :btnName="'Öğretmen Olarak Ata'"
      @onClick="sporclubtaskstatus=0"
    ></v-button>
    <v-button
      :btnIcon="'fa-save'"
      :className="'btn-outline-warning btn-sm float-right'"
      :btnName="'Görevli Olarak Ata'"
      @onClick="sporclubtaskstatus=1"
    ></v-button>
    <br/>
    <br/>
    <br/>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" headerTitle="Görevli Personel Ekle">
      <div class="card-body">
        <flex column="col-md-12 col-sm-12 col-lg-12">
          <label>Personel Seçiniz</label>
          <div class="form-group">
            <multiselect
              v-model="selectedUser"
              track-by="uFullName"
              @close="onTouch"
              :allow-empty="false"
              label="uFullName"
              selectedLabel="Seçili"
              selectLabel="Seç"
              :hide-selected="false"
              :multiple="false"
              deselectLabel
              :options="userData"
              :searchable="true"
              :close-on-select="true"
              :show-labels="true"
              :placeholder="$t('pleaseselectperson')"
            ></multiselect>
            <small v-if="isInvalid" style="color: red">{{$t('pleaseselectperson')}}</small>
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
            <small v-if="isInvalid" style="color: red">Lütfen Takım ve Şube Seçiniz</small>
          </div>
        </flex>

        <div class="col-md-12 col-sm-12 col-lg-12 mt-5">
          <v-button
            :btnIcon="'fa-save'"
            :className="'btn-success float-right'"
            :btnName="'Kaydet'"
            :disabled="isInvalid"
            @onClick="saveUserSporClub"
          ></v-button>
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
  import {
    CREATE_USER_SPOR_CLUB_TEAMS,
    FETCH_USER_SPOR_CLUB_TEAMS,
    DELETE_USER_SPOR_CLUB_TEAMS
  } from '@/store/modules/usersporclubteambranch/moduleNames'

  import { CREATE_USER_SPOR_CLUB } from '@/store/modules/usersporclub/moduleNames'
  import { FETCH_ALL_PERSONS_EXPORT_EXCEL } from '@/store/modules/users/moduleNames'
  import { FETCH_ALL_SC_TEAM_BRANCH } from '@/store/modules/sporclubteambranchpivot/moduleNames'
  import teambranchlist from './teambranchlist'
  import addteambranch from './addteambranch'
  import loadingMixins from '@/mixins/loading'

  export default {
    name: 'addpersonsporclub',
    props: {
      sporClub: {},
      onreset: {},
    },
    mixins: [loadingMixins],
    watch: {
      onreset (val) {
        if (val == true) {
          this.fetchTeamBranch()
        }
      }
    },
    computed: {
      isInvalid () {
        if (this.sporclubtaskstatus == 0) {
          return (
            (this.isTouched && this.selectedUser.id == undefined) ||
            this.sporClubTB.length == 0
          )
        }
        return this.isTouched && this.selectedUser.id == undefined
      }
    },
    methods: {
      saveUserSporClub () {
        if (isNaN(+this.$route.params.id) == false) {
          if (this.isInvalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pselectptbinfo'),
              'error',
              this.$t('ok')
            )
          } else {
            if (this.sporclubtaskstatus == 0) {
              if (this.selectedUser.id == undefined) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('papersonselect'),
                  'info',
                  this.$t('ok')
                )
              } else if (this.sporClubTB.length < 1) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('patbranchselect'),
                  'info',
                  this.$t('ok')
                )
              } else {
                this.savePersonSC()
              }
            } else {
              if (this.selectedUser.id == undefined) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('papersonselect'),
                  'info',
                  this.$t('ok')
                )
              } else {
                this.savePersonSC()
              }
            }
          }
        } else {
          appPlugin.showalert(
            this.$t('invalidparam'),
            '',
            'error',
            this.$t('ok')
          )
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
          .dispatch(CREATE_USER_SPOR_CLUB_TEAMS, { usersporclubteamlist: data })
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                this.sporClubTB = []
                this.$emit('onSuccesAdd', true)
                this.selectedUser = {}
                appPlugin.showalert(
                  this.$t('persontasksuccess'),
                  '',
                  'success',
                  this.$t('ok')
                )
                this.onCloseIndıcator()
              } else {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('ptasksporclubteambrancherr'),
                  'error',
                  this.$t('ok')
                )
                this.onCloseIndıcator()
              }
            } else {
              appPlugin.showalert(
                this.$t('warning'),
                this.$t('ptasksporclubteambrancherr'),
                'error',
                this.$t('ok')
              )
              this.onCloseIndıcator()
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('ptasksporclubteambrancherr'),
              'error',
              this.$t('ok')
            )
          })
      },
      savePersonSC () {
        this.onOpenIndıcator()
        this.$store
          .dispatch(CREATE_USER_SPOR_CLUB, {
            usersporclublist: [
              {
                sporclubid: this.$route.params.id,
                userid: this.selectedUser.id
              }
            ]
          })
          .then(res => {
            if (this.sporclubtaskstatus == 1) {
              this.sporClubTB = []
              this.selectedUser = {}
              appPlugin.showalert(
                this.$t('persontasksuccess'),
                '',
                'success',
                this.$t('ok')
              )
              this.onCloseIndıcator()
            } else {
              this.onCloseIndıcator()
              this.savePersonSCTeamBranch(this.selectedUser.id)
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
        //  this.$store.dispatch("createUserSporClub",{}).then((res)=>{}).catch((err)=>{})
      },
      onTouch () {
        this.isTouched = true
      },
      fetchUser () {
        this.$store
          .dispatch(FETCH_ALL_PERSONS_EXPORT_EXCEL, {
            query: appPlugin.urlParse('uİsActive=1')
          })
          .then(res => {
            if (res && res.length > 0) {
              this.userData = res
              this.onCloseIndıcator()
            } else {
              this.onCloseIndıcator()
              this.showAlertPersons = true
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      },
      fetchTeamBranch () {
        if (isNaN(+this.$route.params.id) == false) {
          this.onOpenIndıcator()
          this.$store
            .dispatch(FETCH_ALL_SC_TEAM_BRANCH, {
              query: appPlugin.urlParse(
                'spor_club_team_branch.spor_club_id=' + this.$route.params.id
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
        } else {
          appPlugin.showalert(
            this.$t('invalidparam'),
            '',
            'error',
            this.$t('ok')
          )
          this.$router.replace('/sporclub')
        }
      }
    },
    data () {
      return {
        isTouched: false,
        sporclubtaskstatus: 0,
        userData: [],
        selectedUser: {},
        sporClubTBData: [],
        sporClubTB: []
      }
    },
    created () {
      this.fetchUser()
      this.fetchTeamBranch()
    },
    components: {
      teambranchlist,
      addteambranch,
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

<style scoped>
</style>
