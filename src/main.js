import Vue from 'vue'
import App from './App'

import wcSwiper from './wc-swiper'
Vue.use(wcSwiper);

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
