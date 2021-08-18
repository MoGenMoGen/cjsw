import Vue from 'vue'
import App from './App'
import init from "./utils/init.js";
import uView from 'uview-ui';
Vue.use(uView);
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUi)
import axios from 'axios'  
Window.axios=axios

import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
 
Vue.use(Avue)


Vue.use(init);

Vue.config.productionTip = false

import verification from '@/components/active-form/js/verification'
Vue.use(verification)   

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
