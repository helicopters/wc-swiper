import Vue from 'vue'
import wcSwiper from './wcSwiper'
import wcSlide from './wcSlide'

export default {
	install (Vue) {
		Vue.component('wcSwiper', Vue.extend(wcSwiper));
		Vue.component('wcSlide', Vue.extend(wcSlide));
	}
}
