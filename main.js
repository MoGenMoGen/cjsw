import Vue from 'vue'
import App from './App'
import init from "./utils/init.js";


Vue.use(init);

Vue.config.productionTip = false

import verification from '@/components/active-form/js/verification'
Vue.use(verification)   

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
