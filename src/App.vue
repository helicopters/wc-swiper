<style>

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
      height: 100%;
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
.d {
  background: #879282;
}
.e {
  background: #827893;
}
</style>
<template>
  <div id="app">
      <div class="header" v-if="list.length">

        <wc-swiper :duration="300" :interval="2000" :pagination="true" :autoplay="true" @transitionend="fn">
          <wc-slide class="slide a">
              1
          </wc-slide>


          <wc-slide class="slide b">
              2
          </wc-slide>

          <wc-slide class="slide c">
              3
          </wc-slide>

          <wc-slide class="slide d">
              4
          </wc-slide>

          <wc-slide class="slide e">
              5
          </wc-slide>




        </wc-swiper>
      </div>
  </div>
</template>
<script>

  export default {
    name: 'app',
    data () {
      return {
        list: [1]
      }
    },
    methods: {
      fn (v) {
        console.log(v)
      }
    }
  }
</script>