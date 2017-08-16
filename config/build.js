/*
 Note that because the plugin does a direct text replacement,
  the value given to it must include actual quotes inside 
  of the string itself. 
  Typically, this is done either with either alternate quotes,
   such as '"production"', or by using JSON.stringify('production').

definePlugin 是文本替换行为, 所以这个玩意必须要两个引号包裹

https://webpack.js.org/plugins/define-plugin/#components/sidebar/sidebar.jsx
*/
module.exports = {
	// 这里的 production 必须要嵌套两层引号
	"NODE_ENV": '"production"'
}