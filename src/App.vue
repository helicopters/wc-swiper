<style>
    html, body {
      height: 100%;
      font-size: 16px;
      max-width: 500px;

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
</style>
<template>
  <div id="app">
    
      <wc-swiper :duration="300" :interval="2000" :done="done">
        <wc-slide v-for="(item, key) in list" :key="key" class="slide">
          <img :src="item" alt="">
        </wc-slide>
      </wc-swiper>

  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        list: [],
        done: false,
        config: {
          interval: 1000,
          duration: 4000
        }
      }
    },
    mounted () {
      setTimeout(()=>{
        this.done = true;
        this.list = ['http://exploreroute.oss-cn-shanghai.aliyuncs.com/74946.jpg', 'http://exploreroute.oss-cn-shanghai.aliyuncs.com/64905.jpg','http://exploreroute.oss-cn-shanghai.aliyuncs.com/27965.jpg']
      }, 2000)
    }
  }
</script>