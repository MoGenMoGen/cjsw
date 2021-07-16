import { until, reg } from "utils/until";
import { api } from "utils/api";

export default{
  install(Vue){
     Vue.prototype.until = new until();
     Vue.prototype.reg = new reg();
     Vue.prototype.api = new api();


  }
}
