// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuelidate from 'vuelidate';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(Vuetify)
Vue.use(Vuelidate);
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://tpq.tes/api/'
// axios.defaults.headers.common = {'Authorization': 'Bearer ' + Vue.auth.getToken(), 'Accept': 'application/json'}

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',

  data(){
  	return{
  		pageTitle: "TPQ Al-Ma'ruf",
  		baseUrl: "http://tpq.tes"
  	}
  }

})
