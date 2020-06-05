import Vue from 'vue'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/index.scss'
import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'
import locale from 'element-ui/lib/locale'

import App from './App.vue'
import router from './router'
import store from './store'

import VModal from 'vue-js-modal'
import VueApexCharts from 'vue-apexcharts'

Vue.use(VueApexCharts)
Vue.use(ElementUI)
// configure language
locale.use(lang)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true, dynamicDefaults: { scrollable: true, height: 'auto' } })

Vue.component('VueChart', VueApexCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
