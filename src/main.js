import Vue from 'vue';
import App from './app/App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = true;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
