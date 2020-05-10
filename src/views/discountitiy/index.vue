<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" headerTitle="Devamsızlıklar">
      <v-tabs @onActiveTab="getActiveTabs($event)" style="padding: 25px">
        <v-tab-content tabKey="schoold" title="Okul Devamsızlığı" icon="fa fa-info">

          <v-tabs @onActiveTab="getSchoolChildTabs($event)">

            <v-tab-content tabKey="forclass" title="Sınıfa Göre" icon="fa fa-info">
              <schoolforclass/>
            </v-tab-content>
            <v-tab-content tabKey="forstudents" title="Öğrenciye Göre" icon="fa fa-info">
              <schoolforstudents/>

            </v-tab-content>
            <v-tab-content tabKey="forstatus" title="Yoklama Durumları" icon="fa fa-info">
              <discontstatus/>

            </v-tab-content>
          </v-tabs>

        </v-tab-content>
        <v-tab-content tabKey="activityd" title="Faaliyet Devamsızlığı " icon="fa fa-info">
          <v-tabs @onActiveTab="getActivityChildTabs($event)">

            <v-tab-content tabKey="forclass" title="Sınıfa Göre" icon="fa fa-info">
              <activityforclass/>
            </v-tab-content>
            <v-tab-content tabKey="forstudents" title="Öğrenciye Göre" icon="fa fa-info">
              <activityforstudentsd/>

            </v-tab-content>
            <v-tab-content tabKey="forstatus" title="Yoklama Durumları" icon="fa fa-info">
              <activitydstatus/>
            </v-tab-content>
          </v-tabs>
        </v-tab-content>


      </v-tabs>
    </flex-card>
  </div>
</template>

<script>
  import { Datetime } from 'vue-datetime'
  import schoolforclass from './partial/schoolforclass'
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
  import Schoolforstudents from './partial/schoolforstudents'
  import { SET_STUDENT_FOR_D } from '@/store/modules/discontinuity/moduleNames'
  import Discontstatus from './partial/discontstatus'
  import Activityforclass from './partial/activityforclass'
  import Activityforstudentsd from './partial/activityforstudents'
  import Activitydstatus from './partial/activitydstatus'

  export default {
    created () {
    },
    methods: {
      getActiveTabs () {
        localStorage.removeItem('sData')
      },
      getActivityChildTabs () {
        localStorage.removeItem('sData')
      },
      getSchoolChildTabs (data) {
        localStorage.removeItem('sData')
        switch (data.componentOptions.propsData.tabKey) {
          case 'forclass':
            this.$store.commit(SET_STUDENT_FOR_D, [])
            return
          case 'forstudents':
            this.$store.commit(SET_STUDENT_FOR_D, [])
            return
        }
      }
    },
    components: {
      Activitydstatus,
      Activityforstudentsd,
      Activityforclass,
      Discontstatus,
      Schoolforstudents,
      schoolforclass,
      Datetime,
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
    },
    data () {
      return {
        today: new Date(),
        ontouch: false,
        loading: false
      }
    }
  }
</script>
