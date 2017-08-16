// to edit target browsers: use "browserlist" field in package.json
/*
	上面那段注释有坑
	你要改目标浏览器, 直接在这里改就行了, 不要在 package.json 里面额外写一个
	browserlist 字段, 个人感觉绕路了

	这个文件是必须的, 要不然 autoprefixer 不会生效
*/
module.exports = {
  "plugins": {
    "autoprefixer": {
    	browsers:["> 1%", "last 20 versions", "not ie <= 8"]
    }
  }
}