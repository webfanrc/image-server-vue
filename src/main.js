import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

if ( process.env.NODE_ENV === 'development' ) {
  // 本地环境
  axios.defaults.baseURL="http://localhost:4001";
} else {
  // 线上环境
  axios.defaults.baseURL="";
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
