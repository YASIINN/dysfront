import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import activity from './modules/activity'
import period from './modules/period'
import grade from './modules/grade'
import student from './modules/student'
import studentrelation from './modules/studentrelation'
import studentdetail from './modules/studentrelation/studentdetail'
import studentuser from './modules/studentrelation/studentuser'
import activityperiod from './modules/activityperiod'
import studentlesson from './modules/studentrelation/studentlesson'
import shared from './modules/shared'

import sporclub from './modules/sporclub'
import titles from './modules/titles'
import provinces from './modules/province'
import companies from './modules/companies'
import schools from './modules/schools'
import clases from './modules/clases'
import lessons from './modules/lessons'
import branches from './modules/branches'
import schoolclasesbranchespivot from './modules/schoolclasesbranchespivot'
import schoollessonclasespivot from './modules/schoolclaseslessonspivot'
import schoolclasespivot from './modules/schoolclasespivot'
import schoollessonspivot from './modules/schoollessonspivot'
import files from './modules/file'
import units from './modules/units'
import users from './modules/users'
import userutypes from './modules/userutypes'
import userschools from './modules/userschools'
import userlessons from './modules/userlessons'
import userschoollessons from './modules/userschoollessons'
import userschoolclases from './modules/userschoolclases'
import userschoolclasesbranches from './modules/userschoolclasesbranches'
import userpassword from './modules/userpassword'
import wishes from './modules/wish'
import programtype from './modules/ptype'
import userrelationactivity from './modules/useractivityrelation'
import scBranches from './modules/teambranch'
import team from './modules/team'
import scTeamBranch from './modules/sporclubteambranchpivot'
import usersporclub from './modules/usersporclub'
import usersporclubteam from './modules/usersporclubteambranch'
import schoolprogramtype from './modules/schoolprogramtypepivot'
import schooldays from './modules/schooldays'
import schoolhours from './modules/schoolhours'
import schoolprogram from './modules/schoolprogram'
import specialnotes from './modules/specialnotes'
import discontinuity from './modules/discontinuity'
import i18n from '@/i18n'
import { SET_LANGUAGE, GET_LANGUAGE, SETTER_LANg } from './appStatic'

import ptypes from './modules/ptypes/ptypes'
import activityptypes from './modules/activityptypes/activityptypes'
import activitypdays from './modules/activitypdays/activitypdays'
import activityphours from './modules/activityphours/activityphours'
import activityprogram from './modules/activityprogram/activityprogram'
import activitypcontent from './modules/activitypcontent/activitypcontent'
import posttype from './modules/posttype'
import homeworktype from './modules/homeworktype'
import posttag from './modules/posttag'
import clubptypes from './modules/clubptypes/clubptypes'
import clubpdays from './modules/clubpdays/clubpdays'
import clubphours from './modules/clubphours/clubphours'
import clubprogram from './modules/clubprogram/clubprogram'
import clubpcontent from './modules/clubpcontent/clubpcontent'
import post from './modules/post/index'
import pnotification from './modules/pnotification'
import homeworkcategory from './modules/homeworkcategory'
//list
import list from "./modules/list/list";
import dType from "./modules/dtype/index";
import schoolgroup from './modules/groups/schoolgroup'
import clubgroup from './modules/groups/clubgroup'
import activitygroup from './modules/groups/activitygroup'
import customgroup from './modules/groups/customgroup'
import groupmembers from './modules/groups/groupmembers'

export default new Vuex.Store({
  state: {
    defaultLang: 'tr',
    chatpopupstyle: 'none',
  },
  mutations: {
    [SETTER_LANg] (state, data) {
      state.defaultLang = data
    },
    setpopupstyle (state, popupstyle) {
      state.chatpopupstyle = popupstyle
    },
  },
  getters: {
    [GET_LANGUAGE] (state) {
      return state.defaultLang
    },
    getpopupstyle (state) {
      return state.chatpopupstyle
    },
  },
  actions: {
    [SET_LANGUAGE] ({ commit, state, dispath }, lang) {
      commit(SETTER_LANg, lang)
      i18n.locale = lang
    },

  },
  modules: {
    activity: activity,
    period: period,
    grade: grade,
    activityperiod: activityperiod,
    student: student,
    studentrelation: studentrelation,
    studentdetail: studentdetail,
    studentuser: studentuser,
    studentlesson: studentlesson,
    shared: shared,
    titles,
    provinces,
    companies,
    files,
    schools,
    clases,
    lessons,
    branches,
    schoollessonclasespivot,
    units,
    schoolclasesbranchespivot,
    schoollessonspivot,
    schoolclasespivot,
    users,
    userutypes,
    userschools,
    userlessons,
    userschoollessons,
    userschoolclases,
    userschoolclasesbranches,
    userpassword,
    wishes,
    userrelationactivity,
    sporclub,
    team,
    scBranches,
    scTeamBranch,
    usersporclub,
    usersporclubteam,
    list: list,
    ptypes: ptypes,
    activityptypes: activityptypes,
    activitypdays: activitypdays,
    activityphours: activityphours,
    activityprogram: activityprogram,
    activitypcontent: activitypcontent,
    programtype,
    schoolprogramtype,
    schooldays,
    schoolhours,
    schoolprogram,
    clubptypes: clubptypes,
    clubpdays: clubpdays,
    clubphours: clubphours,
    clubprogram: clubprogram,
    clubpcontent: clubpcontent,
    schoolgroup: schoolgroup,
    clubgroup: clubgroup,
    activitygroup: activitygroup,
    customgroup: customgroup,
    groupmembers: groupmembers,
    discontinuity,
    dType,
    posttype,
    homeworktype,
    posttag,
    post,
    pnotification,
    homeworkcategory,
    specialnotes
  }
})
