// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
import './mock'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import moment from "vue-moment"
import VueCookies from 'vue-cookies'
import axios from 'axios'
import md5 from 'js-md5'
Vue.prototype.$md5 = md5;
axios.defaults.withCredentials=true;//让ajax携带cookie

Vue.use(VueCookies)//cookie

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(moment)
Vue.prototype.$Moment=moment

new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
