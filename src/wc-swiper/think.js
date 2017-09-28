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














