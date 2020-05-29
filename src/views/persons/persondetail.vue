<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card card-profile">
        <div class="row justify-content-center">
          <div class="col-md-3 col-sm-3 col-lg-3 order-lg-2">
            <div class="card-profile-image">
              <a>
                <img
                  :src="defaultPreview"
                  v-if="user.length>0
                 &&
                 user[0].file == undefined
                 ||
                  user[0].file.path==''"
                />
                <img
                  v-else
                  :src="user.length>0 && user[0].file !=undefined && user[0].file.path"
                  class="rounded-circle"
                />
              </a>
            </div>
          </div>
        </div>
        <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
          <div class="d-flex justify-content-between">
            <a href="#" class="btn btn-sm btn-info mr-4">Connect</a>
            <a href="#" class="btn btn-sm btn-default float-right">Message</a>
          </div>
        </div>
        <div class="card-body pt-0">
          <div class="row">
            <div class="col-md-12 col-lg-12 col-sm-12">
              <div class="card-profile-stats d-flex justify-content-center"></div>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-phone"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm text-black">{{$t('phonenumb')}} : {{user[0].uPhone}}</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-phone"></i>
              </div>
            </div>
            <div>
              <span
                class="pl-2 text-sm text-black"
              >{{$t('otherphonenumb')}} : {{user[0].uPhoneOther==null?'Belirtilmedi':user[0].uPhoneOther}}</span>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-envelope"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm text-black">{{$t('mailadress')}} : {{user[0].uEmail}}</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fa fa-user-check"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm text-black">{{$t('affiunit')}} : {{user[0].unit.uName}}</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-heading"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm text-black">{{$t('titl')}} : {{user[0].title.tName}}</span>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-heading"></i>
              </div>
            </div>
            <div>
              <span class="pl-2 text-sm text-black">{{$t('provin')}} : {{user[0].province.pName}}</span>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <div>
              <div class="icon icon-xs icon-shape bg-white shadow rounded-circle">
                <i class="fas fa-user"></i>
              </div>
            </div>
            <div>
              <span
                class="pl-2 text-sm text-black"
              >{{$t('gender')}} :{{user[0].uGender=='1'?'Erkek':'Kadın'}}</span>
            </div>
          </div>

          <div class="text-center">
            <h5 class="h3">
              {{user[0].uName.toUpperCase() +' ' +
              user[0].uSurname.toUpperCase()}}
              <span
                class="font-weight-light"
              >
                , {{user[0].uBirthDay | formatDate}}
                <b>({{user[0].age}})</b>
              </span>
            </h5>
            <div class="h5 font-weight-300" v-if="user[0].familyType==false">
              <v-tabs @onActiveTab="getParentActive($event)">
                <v-tab-content tabKey="personSchoolDetail" :title="$t('schoolinfo')" icon="fa fa-info">
                  <v-tabs @onActiveTab="getActiveTabs($event)" v-if="createpersonschool">
                    <school-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskschools')"
                      tabKey="school"
                      icon="fa fa-user"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="sreset"
                    ></school-tab>
                    <school-lesson-tab
                      :showDelete="false"
                      :onreset="slreset"
                      :user="user"
                      :title="$t('persontasklesson')"
                      tabKey="lesson"
                      icon="fa fa-edit"
                      :loadSchoolTask="loadSchoolTask"
                    ></school-lesson-tab>
                    <school-clases-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskclas')"
                      tabKey="schoolclas"
                      icon="fa fa-school"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="slcreset"
                    ></school-clases-tab>
                    <school-branches-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskbranches')"
                      tabKey="schoolclasbranch"
                      icon="fa fa-user"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="slcbreset"
                    ></school-branches-tab>
                  </v-tabs>
                </v-tab-content>
                <v-tab-content
                  tabKey="personActivityDetail"
                  :title="$t('activityinfo')"
                  icon="fa fa-info"
                >
                  <v-tabs @onActiveTab="getActiveTabActivity($event)" v-if="createpersonactivity">
                    <user-activity-tab
                      :showDelete="false"
                      :onreset="areset"
                      :user="user"
                      :title="$t('personactivitytask')"
                      tabKey="activity"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-tab>
                    <user-activity-week-tab
                      :showDelete="false"
                      :onreset="aweekreset"
                      :user="user"
                      :title="$t('persondaysduty')"
                      tabKey="activityweek"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-tab>

                    <user-activity-week-lesson
                      :showDelete="false"
                      :onreset="alessonreset"
                      ref="vuetableawl"
                      :user="user"
                      :title="$t('persontasklesson')"
                      tabKey="alessons"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-lesson>
                    <user-activity-week-clases
                      :showDelete="false"
                      :onreset="aclasesreset"
                      :user="user"
                      :title="$t('personclastask')"
                      tabKey="aclases"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-clases>
                  </v-tabs>
                </v-tab-content>

                <v-tab-content
                  tabKey="personSporClubDetail"
                  :title="$t('sporclubinfo')"
                  icon="fa fa-info"
                >
                  <v-tabs @onActiveTab="getSporClubActiveTab($event)" v-if="createpersonsporclub">
                    <spor-club-tab
                      :showDelete="false"
                      :user="user"
                      :onreset="sporclubreset"
                      :title="$t('personsporclubtask')"
                      tabKey="sporclub"
                      icon="fa fa-user"
                    ></spor-club-tab>
                    <spor-club-team-tab
                      :showDelete="false"
                      :user="user"
                      :onreset="sporclubteambranchreset"
                      :title="$t('personsporclubteam')"
                      tabKey="sporclubteambranch"
                      icon="fa fa-user"
                    ></spor-club-team-tab>
                  </v-tabs>
                </v-tab-content>
                <v-tab-content
                  tabKey="personProgram"
                  :title="$t('courseprograminfo')"
                  icon="fa fa-info"
                >
                  <show-program-tab :header="$t('personprogramlist')" v-if="createpersonprogram"></show-program-tab>
                </v-tab-content>
              </v-tabs>
            </div>

            <div class="h5 font-weight-300" v-if="user[0].familyType==true">
              <v-tabs @onActiveTab="getParentActiveTab($event)">
                <v-tab-content tabKey="personSchoolDetail" :title="$t('schoolinfo')" icon="fa fa-info">
                  <v-tabs @onActiveTab="getActiveTabs($event)">
                    <school-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskschools')"
                      tabKey="school"
                      icon="fa fa-user"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="sreset"
                    ></school-tab>
                    <school-lesson-tab
                      :showDelete="false"
                      :onreset="slreset"
                      :user="user"
                      :title="$t('persontasklesson')"
                      tabKey="lesson"
                      icon="fa fa-edit"
                      :loadSchoolTask="loadSchoolTask"
                    ></school-lesson-tab>
                    <school-clases-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskclas')"
                      tabKey="schoolclas"
                      icon="fa fa-school"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="slcreset"
                    ></school-clases-tab>
                    <school-branches-tab
                      :showDelete="false"
                      :user="user"
                      :title="$t('persontaskbranches')"
                      tabKey="schoolclasbranch"
                      icon="fa fa-user"
                      :loadSchoolTask="loadSchoolTask"
                      :onreset="slcbreset"
                    ></school-branches-tab>
                  </v-tabs>
                </v-tab-content>
                <v-tab-content
                  tabKey="personActivityDetail"
                  :title="$t('activityinfo')"
                  icon="fa fa-info"
                >
                  <v-tabs @onActiveTab="getActiveTabActivity($event)">
                    <user-activity-tab
                      :showDelete="false"
                      :onreset="areset"
                      :user="user"
                      :title="$t('personactivitytask')"
                      tabKey="activity"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-tab>
                    <user-activity-week-tab
                      :showDelete="false"
                      :onreset="aweekreset"
                      :user="user"
                      :title="$t('persondaysduty')"
                      tabKey="activityweek"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-tab>

                    <user-activity-week-lesson
                      :showDelete="false"
                      :onreset="alessonreset"
                      ref="vuetableawl"
                      :user="user"
                      :title="$t('persontasklesson')"
                      tabKey="alessons"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-lesson>
                    <user-activity-week-clases
                      :showDelete="false"
                      :onreset="aclasesreset"
                      :user="user"
                      :title="$t('personclastask')"
                      tabKey="aclases"
                      icon="fa fa-user"
                      :loadActivityTask="loadActivityTask"
                    ></user-activity-week-clases>
                  </v-tabs>
                </v-tab-content>

                <v-tab-content
                  tabKey="personSporClubDetail"
                  :title="$t('sporclubinfo')"
                  icon="fa fa-info"
                >
                  <v-tabs @onActiveTab="getSporClubActiveTab($event)">
                    <spor-club-tab
                      :showDelete="false"
                      :user="user"
                      :onreset="sporclubreset"
                      :title="$t('personsporclubtask')"
                      tabKey="sporclub"
                      icon="fa fa-user"
                    ></spor-club-tab>
                    <spor-club-team-tab
                      :showDelete="false"
                      :user="user"
                      :onreset="sporclubteambranchreset"
                      :title="$t('personsporclubteam')"
                      tabKey="sporclubteambranch"
                      icon="fa fa-user"
                    ></spor-club-team-tab>
                  </v-tabs>
                </v-tab-content>
                <v-tab-content tabKey="personStudent" :title="$t('studentinfo')" icon="fa fa-info">
                  <ul class="list-group">
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="item in studentList"
                    >
                      <router-link tag="a" :to="'/students/'+item.id">{{item.s_fullname}}</router-link>
                    </li>
                  </ul>
                  <!-- <student-table :user="user[0]" :onreset="studentreset"></student-table>-->
                </v-tab-content>
                <v-tab-content
                  tabKey="personProgram"
                  :title="$t('courseprograminfo')"
                  icon="fa fa-info"
                >
                  <show-program-tab :header="$t('personprogramlist')"></show-program-tab>
                </v-tab-content>
              </v-tabs>
            </div>
          </div>
        </div>
      </div>
    </flex>
  </div>
</template>

<script>
  import defaultImage from '@/assets/img/defaultavatar.png'
  import UserActivityWeekClases from './partial/useractivityclasestask'
  import UserActivityWeekLesson from './partial/useractivitylessontask'
  import UserActivityWeekTab from './partial/useractivityweektask'
  import UserActivityTab from './partial/useractivitytask'
  import SchoolBranchesTab from './partial/schoolbranchtasktable'
  import SchoolClasesTab from './partial/schoolclasestasktable'
  import SchoolLessonTab from './partial/schoollesontasktable'
  import SchoolTab from './partial/schooltasktable'
  import SporClubTab from './partial/sporclubtasktable'
  import SporClubTeamTab from './partial/sporclubteambranchtasktable'
  import ShowProgramTab from './partial/showpersonprogram'
  import {
    VTabs,
    VTabContent,
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    created () {
      this.onOpenIndıcator()

      if (isNaN(+this.$route.params.id) == false) {
        this.getPerson()
      } else {
        this.onCloseIndıcator()
        appPlugin.showalert('Geçersiz Parametre', '', 'error', 'Tamam')
        this.$router.replace('/createpersons')
      }
    },
    methods: {
      getSporClubActiveTab (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'sporclub':
            this.sporclubreset = true
            this.sporclubteambranchreset = false
            return
          case 'sporclubteambranch':
            this.sporclubreset = false
            this.sporclubteambranchreset = true
            return
        }
      },
      getParentActiveTab (data) {
        if (data.componentOptions.propsData.tabKey == 'personStudent') {
          this.onOpenIndıcator()
          this.$store
            .dispatch('fetchPersonStudents', { id: this.user[0].id })
            .then(res => {
              this.onCloseIndıcator()
              if (res.status && res.status == 200 && res.data) {
                this.studentList = res.data
              }
            })
            .catch(err => {
              this.onCloseIndıcator()

              appPlugin.showalert(
                this.$t('warning'),
                this.$t('personstudenterror'),
                'error',
                this.$t('ok')
              )
            })
        }
      },
      getParentActive (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'personSchoolDetail':
            this.createpersonactivity = false
            this.createpersonschool = true
            this.createpersonsporclub = false
            this.createpersonprogram = false
            return
          case 'personActivityDetail':
            this.createpersonactivity = true
            this.createpersonschool = false
            this.createpersonsporclub = false
            this.createpersonprogram = false
            return
          case 'personSporClubDetail':
            this.createpersonactivity = false
            this.createpersonschool = false
            this.createpersonsporclub = true
            this.createpersonprogram = false
            return

          case 'personProgram':
            this.createpersonactivity = false
            this.createpersonschool = false
            this.createpersonsporclub = false
            this.createpersonprogram = true
            return
        }
      },
      getActiveTabActivity (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'activity':
            this.areset = true
            this.aweekreset = false
            this.aclasesreset = false
            this.alessonreset = false
            return
          case 'activityweek':
            this.areset = false
            this.aweekreset = true
            this.aclasesreset = false
            this.alessonreset = false
            return
          case 'alessons':
            this.areset = false
            this.aweekreset = false
            this.aclasesreset = false
            this.alessonreset = true
            return
          case 'aclases':
            this.areset = false
            this.aweekreset = false
            this.aclasesreset = true
            this.alessonreset = false
            return
        }
      },
      getActiveTabs (data) {
        switch (data.componentOptions.propsData.tabKey) {
          case 'lesson':
            this.slreset = true
            this.sreset = false
            this.slcreset = false
            this.slcbreset = false
            return
          case 'school':
            this.slreset = false
            this.sreset = true
            this.slcreset = false
            this.slcbreset = false
            return
          case 'schoolclas':
            this.slreset = false
            this.sreset = false
            this.slcreset = true
            this.slcbreset = false
            return
          case 'schoolclasbranch':
            this.slreset = false
            this.sreset = false
            this.slcreset = false
            this.slcbreset = true
            return
          default:
            return
        }
        this.activeTab = data.componentOptions.propsData.tabKey
      },
      getPerson () {
        this.$store
          .dispatch('showUser', { id: this.$route.params.id })
          .then(res => {
            if (res.status) {
              if (res.status === 200) {
                res.data.forEach(item => {
                  item.user_u_types.forEach(type => {
                    item.familyType = false
                    item.personType = false
                    if (type.id == 1) {
                      item.personType = true
                    } else if (type.id == 2) {
                      item.familyType = true
                    }
                  })
                })
                this.user = res.data
                //this.$store.getters.getUsers
                this.onCloseIndıcator()
              } else {
                this.$router.push('/persons')
                this.onCloseIndıcator()
              }
            } else {
              this.onCloseIndıcator()
            }
          })
          .catch(err => {
            this.onCloseIndıcator()
          })
      }
    },
    data () {
      return {
        createpersonsporclub: false,
        createpersonprogram: false,
        createpersonactivity: false,
        createpersonschool: true,
        studentList: [],
        sporclubreset: false,
        sporclubteambranchreset: false,
        loadSchoolTask: false,
        loadActivityTask: false,
        areset: false,
        aweekreset: false,
        aclasesreset: false,
        alessonreset: false,
        sreset: false,
        slreset: false,
        slcreset: false,
        slcbreset: false,
        defaultPreview: defaultImage,
        user: [],
        currentData: [],
        activeTab: 0,
        studentreset: false,

      }
    },
    name: 'persondetail',
    components: {
      ShowProgramTab,
      VTabs,
      VTabContent,
      Loading,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
      SearchBox,
      Flex,
      FlexCard,
      UserActivityWeekClases,
      UserActivityWeekLesson,
      UserActivityWeekTab,
      UserActivityTab,
      SchoolBranchesTab,
      SchoolClasesTab,
      SchoolLessonTab,
      SchoolTab,
      SporClubTab,
      SporClubTeamTab
    }
  }
</script>

<style scoped>
</style>
