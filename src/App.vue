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
.z {
  background: #456789;
}
</style>
<template>
  <div id="app">
      <div class="header" v-if="list.length">
        <div class="btn" @click="s4">跳转到第四个</div>

        <wc-swiper :therehold="300" :duration="300" :interval="1000" :pagination="true" :autoplay="true" @transitionend="fn" :curSlide="curSlide">
         


          <wc-slide class="slide z" @click="ri">
              0
              <!-- <p>1</p> -->
          </wc-slide>

          <wc-slide class="slide a">
              1
              <!-- <p>1</p> -->
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
        list: [1],
        curSlide: 1000
      }
    },
    methods: {
      fn (v) {
        console.log('transitionend',v)
      },
      ri () {
        console.log('我点击了')
      },
      s4 () {
        this.curSlide = 4;
      }
    }
  }

/*

预期结果: 当前是最后一个, 下一个, 会滚动到我们添加的那个元素上面, 滚动结束之后, 会瞬间切换位置.

实际的结果: 滚动到下一个元素, 结束之后, 没有瞬间切换位置, 而是有 duration 的切换.

和我们设置的值有关系, 

3 1 2 3 1

  s     end
      3->1, 切换结束之后, 再变化位置, 这样就不存在位置的变化问题了.
*/

</script>