import 'wc-css/reset.css'
import 'wc-css/base.css'

import Vue from 'vue'

import router from './router'

import App from './App'

new Vue({
    el: '#app',
    router,
    
    template: '<App/>',
    components: {App}
})