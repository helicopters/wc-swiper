<style>
    html, body {
      height: 100%;
      font-size: 16px;
      max-width: 500px;
      user-select:none;

    }
    #app {
      height: 100%;
    }
    .slide {
      height: 50%;
      width: 100%;
      /*background: gray;*/
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 50px;
    }
    img {
      height: 100%;
      width: 100%;
    }
    .header {
      height: 250px;
    }
    .test {
      background: red;
      height: 20px;
      width: 100px;
      bottom: 10px;
      position: absolute;
    }
    .dot {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: green;
    }

.wc-dot-active {
  background: red!important;
}
.a {
  background: #f1716c;
}
.b {
  background: #376956;
}
.c {
  background: #495a90;
}
/*a {
  display: block;
}
*/</style>
<template>
  <div id="app">
      <div class="header" v-if="list.length">

        <wc-swiper :duration="300" :interval="2000">
          <wc-slide class="slide a">
              1
          </wc-slide>


          <wc-slide class="slide b">
              2
          </wc-slide>

          <wc-slide class="slide c">
              3
          </wc-slide>



        </wc-swiper>



        
      </div>


  </div>
</template>
<script>

  // import {wcSwiper, wcSlide} from './wc-swiper'

  export default {
    name: 'app',
    data () {
      return {
        list: [],
        done: false
      }
    },
    // components: {
    //   wcSlide,
    //   wcSwiper
    // },
    mounted () {
      setTimeout(()=>{
        this.done = true;
        this.list = ['https://cdn.experienceoz.com.au/assets/organisation/8856/banner/74972_mobile.jpg', 'https://cdn.experienceoz.com.au/assets/organisation/4926/banner/60841_mobile.jpg','https://cdn.experienceoz.com.au/assets/organisation/4914/banner/59847_mobile.jpg']
      }, 20)
    }, 
    methods: {
      // test () {
      //   console.log('yes')
      // },
      // hello () {
      //   console.log('hello')
      // }
    }
  }
</script>