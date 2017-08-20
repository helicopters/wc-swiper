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

/*a {
  display: block;
}
*/</style>
<template>
  <div id="app">
      <div class="header" v-if="list.length">

        <wc-swiper :duration="300" :interval="2000">
          <wc-slide v-for="(item, key) in list" :key="key" class="slide" @click="test" @touchstart="hello">
            <!-- <a href="http://www.baidu.com"> -->
              <img :src="item" alt="">
            <!-- </a>  -->
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
        list: [],
        done: false
      }
    },
    mounted () {
      setTimeout(()=>{
        this.done = true;
        this.list = ['http://exploreroute.oss-cn-shanghai.aliyuncs.com/74946.jpg', 'http://exploreroute.oss-cn-shanghai.aliyuncs.com/64905.jpg','http://exploreroute.oss-cn-shanghai.aliyuncs.com/27965.jpg']
      }, 20)
    }, 
    methods: {
      test () {
        console.log('yes')
      },
      hello () {
        console.log('hello')
      }
    }
  }
</script>