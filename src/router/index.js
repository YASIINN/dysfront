import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import userRouter from './userRouter'
import clasesRouter from './clasesRouter'
import schoolsRouter from './schoolsRouter'
import lessonRouter from './lessonsRouter'
import unitsRouter from './unitsRouter'
import branchesRouter from './branchesRouter'
import companyRouter from './companiesRouter'
import personsRouter from './personRouter'
import corporateRouter from './corporateManagment'
import passwordRouter from './passwordRouter'
import studentsRouter from './studentsRouter'
import sporclubRouter from './sporclub'
import teamRouter from './teamRouter'
import scBranchesRouter from './scBranchesRouter'
import activityschedule from './activityScheduleRouter'
import dtypesRouter from './dtypesRouter'

import clubschedule from './clubScheduleRouter'

import discontinuityRouter from './discountitiyRouter'
import agendaRouter from './agendaRouter'
import testRouter from './testRouter'
import listRouter from './listRouter'
import postRouter from './postRouter'
import activityRouter from './activityRouter'
import groupRouter from './groupRouter'
import posttagRouter from './posttagRouter'
import homeworkcategoryRouter from './homeworkcategoryRouter'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/not-found',
    name: 'nf',
    component: () => import('@/views/not-found/index.vue')
  },
  corporateRouter.routes.activities,
  corporateRouter.routes.periods,
  corporateRouter.routes.grades,
  corporateRouter.routes.agrades,
  corporateRouter.routes.aplessons,
  userRouter.routes.Login,
  corporateRouter.routes.provinces,
  corporateRouter.routes.titles,
  schoolsRouter.routes.Schools,
  clasesRouter.routes.clases,
  lessonRouter.routes.lessons,
  branchesRouter.routes.branches,
  unitsRouter.routes.units,
  companyRouter.routes.company,
  personsRouter.routes.personslist,
  personsRouter.routes.createpersons,
  personsRouter.routes.detailperson,
  personsRouter.routes.editperson,
  personsRouter.routes.teachertimetable,
  personsRouter.routes.teacherdiscontinuity,
  passwordRouter.routes.forgot,
  studentsRouter.routes.students,
  studentsRouter.routes.detailstudent,
  studentsRouter.routes.createstudent,
  studentsRouter.routes.studentdiscont,
  studentsRouter.routes.studentschoolprogram,
  listRouter.routes.parents,
  activityschedule.routes.activityschedule,
  activityschedule.routes.ascheduledetail,

  clubschedule.routes.clubschedule,
  clubschedule.routes.cscheduledetail,

  testRouter.routes.test,
  agendaRouter.routes.agenda,
  sporclubRouter.routes.sporClub,
  sporclubRouter.routes.sporClubDetail,
  teamRouter.routes.teamList,
  scBranchesRouter.routes.scBranches,

  activityRouter.routes.activitystudents,
  activityRouter.routes.activityemployees,
  activityRouter.routes.activityparents,
  activityRouter.routes.activityperiodlist,
  discontinuityRouter.routes.discountityCreate,
  discontinuityRouter.routes.discountityList,
  dtypesRouter.routes.dtypes,

  groupRouter.routes.schoolgrouplist,
  groupRouter.routes.clubgrouplist,
  groupRouter.routes.activitygrouplist,
  groupRouter.routes.customgrouplist,
  groupRouter.routes.groupmemberlist,

  postRouter.routes.test,
  postRouter.routes.postlikes,
  postRouter.routes.postViews,
  postRouter.routes.postDetail,
  postRouter.routes.postallnotification,
  postRouter.routes.userpost,
  posttagRouter.routes.posttag,
  postRouter.routes.specialnotes,
  homeworkcategoryRouter.routes.homeworkcat,

  { path: '*', redirect: '/not-found' }
]
const router = new VueRouter({
  mode: 'history',
  base: '/dys2/',
  routes
})

export default router
