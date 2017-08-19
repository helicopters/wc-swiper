<style>
    html, body {
      height: 100%;
      font-size: 16px;
      max-width: 500px;

    }
    #app {
      height: 100%;
    }
</style>
<template>
  <div id="app">
      <swiper></swiper>
      <!-- <router-view></router-view> -->
  </div>
</template>
<script>
  import Swiper from './wc-swiper/tpl'
  export default {
    name: 'app',
    components: {
      Swiper
    }
  }



</script>