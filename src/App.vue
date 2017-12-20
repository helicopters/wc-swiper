<style>
  .btn {


    position: relative;
    /*display: inline-block;*/
    width: 50%;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42;
    color: #333;
    text-align: center;
    white-space: nowrap;
    vertical-align: top;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border-radius: 3px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    color: #fff;
    background-color: #007aff;
    border: 1px solid #007aff;
    margin: 10px auto; 
  }
  .swiper {
    width: 100%;
    height: 300px;
  }
  .a {
    background: #123456;
  }
  .b {
    background: #674567;
  }
  .c {
    background: #445678;
  }
  .d {
    background: #689989;
  }
  .e {
    background: #333391;
  }
  .f {
    background: red;
  }
  .slide {
    font-size: 50px;
    display: flex;
    align-items:center;
    justify-content: center;
  }
  .text {
    margin: 10px;
  }

  .global{
    position: absolute;
    bottom: 0;
    right: 0;
  }

.slide-slide {
  height: 300px;
  /*img {}*/
}

.ttt {
  height: 500px;
}
</style>
<template>
  <div class="container">
  
    <h1>只有一个 slide </h1>
    <!-- 只有一张图的时候 -->
    <wc-swiper class="swiper" v-if="list.length" @transitionend="transitionend" ref="swiper2"
      :defaultSlide="0" :interval="1500" :pagination="true">
        <wc-slide v-for="(v, k) in list2" :key="k" :class="map[k]">
          {{v}}
        </wc-slide>
    </wc-swiper> 

    <h1>有固定元素的时候</h1>
    <wc-swiper class="swiper" v-if="list.length" @transitionend="transitionend" ref="swiper1"
      :defaultSlide="3" :interval="1500" :pagination="true">
        <wc-slide v-for="(v, k) in list" :key="k" :class="map[k]">
          {{v}}
        </wc-slide>
        <h1 class="global" slot="g">投放广告</h1>
    </wc-swiper>  


    <wc-swiper v-if="list.length" :autoplay="false" class="ttt">
      <wc-slide v-for="(v, k) in imgList" :key="k" class="slide-slide">
        <img :src="v" alt="">
      </wc-slide>
    </wc-swiper>




    <h1>通常情况</h1>
    <wc-swiper class="swiper" v-if="list.length" @transitionend="transitionend" ref="swiper"
      :defaultSlide="0" :interval="1500" :pagination="true">
        <wc-slide v-for="(v, k) in list" :key="k" :class="map[k]">
          {{v}}
        </wc-slide>
    </wc-swiper> 






    <div class="text">当前是第{{currentSlide}}个slide</div>  

    <div class="btn" @click="previous">上一个</div>
    <div class="btn" @click="next">下一个</div>


    <div class="btn" @click="slideTo">滚动到索引=3的</div>
  </div>

</template>
<script>

  export default {
    name: 'App',
    data () {
      return {
        list: [],
        list2: [1],
        map: {
          0: 'slide a',
          1: 'slide b',
          2: 'slide c',
          3: 'slide d',
          4: 'slide e',
          5: 'slide f'
        },
        currentSlide: 100,
        imgList: ['https://bucket-zb-fanba.oss-cn-hangzhou.aliyuncs.com/4b4c9042e3754101ae11d4d97882cbc1.jpg','http://www.nvsay.com/uploads/allimg/161108/172-16110R2214b22.jpg','http://www.nvsay.com/uploads/allimg/161108/172-16110R2220UG.jpg','http://t10.baidu.com/it/u=1863417261,812716211&fm=173&s=FAA0804142D83674D72CC59D0300D083&w=640&h=359&img.JPEG','http://desk.fd.zol-img.com.cn/t_s960x600c5/g5/M00/0D/0F/ChMkJlnJyEKIaQO_AM-mbhQo89QAAgyrABQofAAz6aG651.jpg'],
      }
    },
    mounted () {
      this.fetchList();
    },
    methods: {
      fetchList () {
        this.list = [0,1,2,3,4,5];
      },
      transitionend (current) {
        // console.log('')
        // console.log(current,'dangqin')
        this.currentSlide = current;
        document.querySelector('.text').innerHTML = '当前是第' + current + '个 slide';
      },
      previous () {
        this.$refs.swiper.previous();
      },
      next () {
        this.$refs.swiper.next();
      },
      slideTo () {
        this.$refs.swiper.slideTo(3);
      }
    }
  }
</script>