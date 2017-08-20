<style>
    html, body {
      height: 100%;
      font-size: 16px;
      max-width: 500px;

    }
    #app {
      height: 100%;
    }
    h1 {
      height: 100%;
      width: 100%;
      background: gray;
    }
</style>
<template>
  <div id="app">
    
      <wc-swiper>
        <wc-slide v-for="(item, key) in list" :key="key">
          <h1>{{item}}</h1>
        </wc-slide>
      </wc-swiper>



  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
        list: [1, 2,3]
      }
    }
  }
</script>