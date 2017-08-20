<style>

    .swiper-container{
        /*position: relative;*/
        width: 100%;
        height: 100%;
        overflow: hidden;
        /*visibility: visible;*/
    }


    .swiper-box {
        /*height: 300px;*/
        height: 100%;
        /*width: 1125px;*/
        width: 100%;
        display: flex;
        /*width: 100%;*/
        
        /*font-size: 0;*/
        /*overflow: hidden;*/
    }
    .slide {
        /*transition-property: transform;*/
        position: relative;
        /*visibility: visible;*/
        /*top:0;*/
        /*left:0;*/
        /*width: 100%;*/
        font-size: 50px;
        text-align: center;
        /*-webkit-overflow-scrolling: touch;*/
        /*user-select:none;*/

        /*transform-origin: 0px 0px 0px;*/
/*      opacity: 1;
        transform: scale(1, 1);
*/
        height: 50%;
        /*display: inline-block;*/
        width: 100%;
        flex-shrink: 0;


/*  -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-perspective: 1000;
    -moz-perspective: 1000;
    -ms-perspective: 1000;
    perspective: 1000;
*/


        
        /*transition: all 3s ease-in 2s;*/
    }
    .transition {
        /*transition: all 2s;*/
        /*transition-duration: 1s;*/
        /*transition-delay: 1.2s;*/
    }
    .slide-a {
        background: red;
    }
    .slide-b {
        background: yellow;
        /*transition-duration: 500ms;*/
        /*transform: translateX(100%);*/
        /*-webkit-transition-duration: 500ms;*/
    }
    .slide-c {
        background: blue;
        /*transform: translateX(200%);*/

    }



</style>
<template>


    <div class="swiper-container">


        <div class="swiper-box">
            <!-- <div class=" slide slide-c">3</div> -->
            <div class=" slide slide-c">3</div>
            <div class=" slide slide-a">1</div>
            <div class=" slide slide-b">2</div>
            <div class=" slide slide-c">3</div>
            <div class=" slide slide-a">1</div>
            <!-- <div class=" slide slide-a">1</div> -->

        </div>


    </div>


</template>
<script>


    export default {
        mounted () {
var swiperContainer = document.querySelector('.swiper-container');
var swiper = document.querySelector('.swiper-box');
var swiperWidth = swiper.clientWidth;
var slides = toArray(swiper.children);
var slidesNumber = slides.length;
var currentSlide = 0;
var config = {
    interval: 2000,
    duration: 500
}
var timer = null;
var pos = {};


var moving = false;
var userDuration = 260;
var threshold = 100;
function toArray(arraylike) {
    return Array.prototype.slice.call(arraylike);
}
function translateX(v) {
    swiper.style.transform = 'translateX(' + v + 'px)';
}
function transitionDuration(v) {
    swiper.style.transitionDuration = v + 'ms';
}
function getLocation() {
    return -(swiperWidth * currentSlide);
}
function handler() {
    if (currentSlide == slidesNumber - 1) {
        currentSlide = 0;
        transitionDuration(0);
        currentSlide++;
        translateX(getLocation());
    }
    timer = setTimeout(function() {
        clearTimeout(timer);
        transitionDuration(config.duration);
        currentSlide++;
        translateX(getLocation());
    }, config.interval);
}
function s(e) {
    if (!moving) {
        moving = true;
        clearTimeout(timer);
        swiper.removeEventListener('transitionend', handler, false);
        transitionDuration(0);
        pos.clickX = e.changedTouches[0].pageX;
        pos.initX = swiper.getBoundingClientRect().left;
        translateX(pos.initX);
    }
}
function m(e) {
    if (moving) {
        pos.moveX = e.changedTouches[0].pageX;
        translateX(pos.initX - (pos.clickX - pos.moveX));
    }
}
function e(e) {
	var distance = 0;
    if (moving) {
        moving = false;
        pos.endX = e.changedTouches[0].pageX;
        distance = pos.clickX - pos.endX;
        transitionDuration(userDuration);
        if (distance == 0) {
            translateX(getLocation());
        } else {
            if (Math.abs(distance) < threshold) {
                translateX(getLocation());
            } else {
                if (distance > 0) {
                    currentSlide++;
                } else {
                    currentSlide--;
                }
                boundary();
            }
        }
        timer = setTimeout(function() {
            swiper.addEventListener('transitionend', handler, false);
            clearTimeout(timer);
            transitionDuration(config.duration);
            currentSlide++;
            translateX(getLocation());
        }, config.interval);
    }
}
function boundary() {
	var start = swiper.getBoundingClientRect().left;
	var distance = 0;
    if (currentSlide == 0) {
        distance = swiperWidth * (slidesNumber - 1) - (swiperWidth + start);
        
        currentSlide = slidesNumber - 2;

        transitionDuration(0);
        translateX(-distance);
        setTimeout(function() {
            transitionDuration(userDuration);
            translateX(getLocation());
        }, 20);
    } else if (currentSlide == slidesNumber - 1) {
        distance = start + (swiperWidth * (slidesNumber - 2))
        
        currentSlide = 1;

        transitionDuration(0);
        translateX(distance);
        setTimeout(function() {
            transitionDuration(userDuration);
            translateX(getLocation());
        }, 20);
    } else {
        translateX(getLocation());
    }
}
swiper.addEventListener('transitionend', handler, false);
swiper.addEventListener('touchstart', s, false);
swiper.addEventListener('touchmove', m, false);
swiper.addEventListener('touchend', e, false);
document.querySelector('.swiper-container').addEventListener('touchstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
}, false);
currentSlide = 1;
translateX(getLocation());
timer = setTimeout(function() {
    currentSlide++;
    clearTimeout(timer);
    transitionDuration(config.duration);
    translateX(getLocation());
}, config.interval);


        }// end mounted

    } // end export

</script>