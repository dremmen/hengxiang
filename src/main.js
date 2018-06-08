import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import vueScroller from 'vue-scroller'

FastClick.attach(document.body)
Vue.use(vueScroller)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
