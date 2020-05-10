import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import moment from 'moment'
import tr from 'moment/locale/tr'
import Plugin from '@/plugins'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/index.css'
//axios.defaults.baseURL = "http://10.0.0.50/dys/api";
//axios.defaults.baseURL = "http://dysbackend/api";
axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
import ScrollLoader from 'vue-scroll-loader'

Vue.use(ScrollLoader)
//  process.env.VUE_APP_ENDPOINT ||
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import 'vue-toast-notification/dist/index.css'

Vue.use(VueToast)
Vue.use(Datetime)
Vue.use(VueToast)
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)
import i18n from './i18n'
import appPlugin from './Providers/appPlugins'

Vue.use(i18n)

Vue.use(Plugin)
Vue.filter('kbToMB', function (value) {
  return appPlugin.bytesToSize(value)
})
Vue.filter('formatTodayPost', function (value) {
  if (value) {
    let toDate = new Date().toLocaleDateString()
    let format = moment(String(value)).format('DD.MM.YYYY')
    if(format==toDate){
      return  "Bugün"
    }else{
      return moment(String(value)).format('LLLL')

    }
    debugger
  }
})
Vue.filter('formatToday', function (value) {
  if (value) {
    return moment(String(value)).format('LLLL')
  }
})

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('MM.DD.YYYY')
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
