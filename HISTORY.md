首先说最基本的一种情况, swiper 已经存在那里, 布局已经生成了. 

现在我们 touch 一下
往左 touch 一下,  swiper 会移动一点距离. 

1 这种移动一点距离, 怎么做出来?

记录 touchstart 的点, touchmove的时候的点, 计算两点之间的距离, 将这个距离, 作为 diff 
添加到 swiper 起初的位置上

2 在 1 的基础上面, 我们要做这么一种操作
* 当 touch 结束之后, 发现 swiper 当前的位置和正常状态的位置, 小于我们设置的 therehold, 就恢复到正常状态. 

	我们给正常状态的定义: swiper的 translateX 的值, 取余 swiperWidth 的值, 等于 0
	而我们要做的, 就是将 swiper 移动到最近的一个符合标准的值. 


* 大于我们设置的 therehold, 就补全我们手动移动的距离, 到一个 slide 的距离. 


3 现在是存在一个 bug, 当我们的touch 行为会导致最后一个 slide 显示的时候, touchend, 自动滚动到
最后一个, 正常情况下, 滚动到最后一个, 触发 transitionend 事件, 然后会重新在瞬间替换到 第一个.

但是如果此时, 在滚动到最后一个, 还没有触发 transitionend 之前, 又来了一次 touch, 就会导致
transitionend 没有触发, 也就是没有正常替换, 会让 swiper 继续往下移动一个 slide, 然后显示白屏. 

所以我们要做的是:
每次 touch 开始的时候, 检测一下, 如果当前的 touch 的结果, 是下一个就是最后一个, 那么在当前 touch
结束之后, 直接禁止掉 touch 事件

通过 设置一个变量, 的确实现了, 但是出现了一个闪烁的问题, 这个问题, 表现为 下一个为最后一个的时候
在没有触发 touchend 事件的时候, 

问题出现的原因是这样, touchend 触发之后, 会将 moving 设置为 false, 此时之前的手指就已经放到上面了
然后move 依旧会导致滑动, 所以我们还要加一个, 在 touchstart 里面加一道判断.

如果 touchstart 触发的话, 就解锁, 可以响应, 然后在 touchend 的时候上锁, 为什么要上锁

因为防止 touchstart 没有触发. 因为只要在 moving 状态都不会触发 touchstart 事件.


多指是一个比较复杂的东西, 我暂时不想考虑, 后置吧. 

在 ios 上有一个怪异的 bug, 当我手指放上去不动的时候, 会让 siwper 一会白一会白的

对于自动播放和手动滑动的问题, 我采用一种更粗暴的方式, 在自动播放的时候, 不响应 touch 事件. 


1 当滑动的时候, 禁止掉手动滑动, 不响应手动滑动
2 现在的 bug 是, 当你的手指放在 swiper 上面, 会导致 swiper 移动到下一个的时候, 
先不显示, 然后突然显示, 也就是说元素不见了. 滑动进来的元素不见了. 只有等到的滑动结束之后
才会显示. 

对于这种问题, 第一, 我把 slide 里面的文本去掉, 发现 bug 不见了. 
其次, 我把文本替换成图片, bug 依旧存在. 
再着, 我把手指松开, 自动播放的时候没有问题. 

所以分成两个大类

松开手指, 自动播放, 没有问题
放上手指
	slide 里面没有元素, 没有问题
	slide 里面有元素, 会出现 bug

所以, 放上手指, 以及 slide 里面有元素, 会导致 bug 出现. 

检测发现, 放上之后, swiper 的滑动不会重新触发 touch 事件. 

现在尝试将 translateX 改成 left 属性.  这个要改代码, 而且 transitionend 事件没有办法触发. 

那么猜测, 到底是什么原因呢?
我先清空所有不必要的样式 .

我日啊, 是因为在 slide 上面添加了一句话:
transform: translate3d(0px, 0, 0);

这么一句话导致的, 是这么个原因导致的, 我草草丛哦哦


现在依旧存在一个 bug:
当滑动的时候, 你把手指放上去, 然后等到 transitionend 会将 moving 设置为 false
也就是说此时又可以滑动了, 然后你又滑动, 此时 touchmove 会触发, 也就是说, 

主要是这么一个 bug,

当在 interval 的时候, 也就是 moving = false 的时候, 然后 touchstart, 会导致解锁


还有一个 bug, 当处于 not moving 的时候, touchstart 会导致 clearTimeout()
这个都可以接受, 但是

还是要必须拆出来一个状态, 我们的设置是, 当 not moving 的时候, touch 会阻塞 moving
当 moving, 的时候


moving , 用户主动滑动松开, 



## 追加一些功能
外界可以设置默认显示的 slide 是谁. 外界可以在任意时刻改变 slide, 这样就可以实现
一些效果. 比如点击菜单跳转到对应的 slide, 我们要求的不是这个, 反正我们是要一个 transition hook
用做 v-model 反而没有什么意思. 

一种, 外界点击一个按钮, swiper, 就可以跳转到对应的 slide, 



























