import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false
Vue.use(vueResource)
Vue.use(elementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
