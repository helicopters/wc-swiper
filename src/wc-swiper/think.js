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

