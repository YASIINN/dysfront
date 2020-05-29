<template>
  <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="sporClub.scName + ' '+ 'Kulübü Detayları'">
    <Loading v-if="loading"></Loading>
    <div class="card-body">
      <v-tabs @onActiveTab="getActiveTabs($event)">
        <v-tab-content tabKey="sporclubTeam" title="Takım Bilgileri" icon="fa fa-info">
          <div v-if="oncreateteam">
            <addteambranch :sporClub="sporClub" @onSuccesAdd="onResetSCTable($event)"></addteambranch>
            <teambranchlist
              :sporClub="sporClub"
              @onRefresh="onRefreshComplate($event)"
              :onreset="teambranchreset"
            ></teambranchlist>
          </div>
        </v-tab-content>
        <v-tab-content tabKey="sporclubPerson" title="Personel Bilgileri" icon="fa fa-info">
          <div v-if="oncreateperson">
            <addpersons
              :sporClub="sporClub"
              :onreset="onresetdata"
              @onSuccesAdd="onResetSPTable($event)"
            ></addpersons>
            <personlist
              :sporClub="sporClub"
              @onRefresh="onRefreshComplate($event)"
              :onreset="clubpersonreset"
            ></personlist>
          </div>
        </v-tab-content>
        <v-tab-content tabKey="sporclubStudent" title="Öğrenci Bilgileri" icon="fa fa-info">
          <div v-if="oncreatestudent">
            <assignstudent :listType="3" @onReset="onResetStudentTable($event)"></assignstudent>
            <!--          <addpersons :sporClub="sporClub" @onSuccesAdd="onResetSPTable($event)"></addpersons>-->
            <sporclubstudentslist
              :sporClub="sporClub"
              @onRefresh="onRefreshComplate($event)"
              :onreset="studentreset"
            ></sporclubstudentslist>
          </div>
        </v-tab-content>
      </v-tabs>
    </div>
  </flex-card>
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
    VTabs,
    VTabContent,
    Multiselect,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import { SHOW_SPOR_CLUB } from '@/store/modules/sporclub/moduleNames'
  import addteambranch from './partial/addteambranch'
  import teambranchlist from './partial/teambranchlist'
  import addpersons from './partial/addpersonsporclub'
  import personlist from './partial/sporclubpersonlist'
  import sporclubstudentslist from './partial/sporclubstudentslist'
  import assignstudent from '../students/assignstudent'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    watch: {
      teambranchreset: function (val) {
      },
      clubpersonreset: function (val) {
      },
      studentreset: function (val) {
      }
    },
    created () {
      if (isNaN(+this.$route.params.id) == false) {
        this.onOpenIndıcator()
        this.$store
          .dispatch(SHOW_SPOR_CLUB, { id: this.$route.params.id })
          .then(res => {
            if (res.id == undefined) {
              this.$router.replace('/sporclub')
            } else {
              if (res) {

                this.onCloseIndıcator()
                this.sporClub = res
              }
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      } else {
        appPlugin.showalert(this.$t('invalidparam'), '', 'error', this.$t('ok'))
        this.$router.replace('/sporclub')
      }
    },
    methods: {
      onResetSPTable ($event) {
        this.clubpersonreset = $event
      },
      onResetStudentTable ($event) {
        this.studentreset = $event
      },
      onResetSCTable ($event) {
        this.teambranchreset = $event
      },
      onRefreshComplate ($event) {
        this.clubpersonreset = false
        this.teambranchreset = false
        this.studentreset = false
      },
      getActiveTabs (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'sporclubTeam':
            this.oncreateteam = true
            this.oncreateperson = false
            this.oncreatestudent = false
            this.onresetdata = false
            return
          case 'sporclubPerson':
            this.oncreateteam = false
            this.oncreateperson = true
            this.oncreatestudent = false
            this.onresetdata = true
            return

          case 'sporclubStudent':
            this.oncreateteam = false
            this.oncreateperson = false
            this.oncreatestudent = true
            this.onresetdata = false
            return
        }
      }
    },
    computed: {},
    data () {
      return {
        oncreateteam: true,
        oncreateperson: false,
        oncreatestudent: false,
        onresetdata: false,
        sporClub: [],
        studentreset: false,
        clubpersonreset: false,
        teambranchreset: false,
      }
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
      VuetablePaginationInfo,
      addpersons,
      personlist,
      sporclubstudentslist,
      assignstudent
    },
    name: 'detail'
  }
</script>

<style scoped>
</style>
