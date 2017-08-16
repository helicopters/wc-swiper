const webpack = require('webpack');
const webpackConfig = require('./webpack.prod');

const rm = require('rimraf');
const cp = require('shelljs').cp;
const mkdir = require('shelljs').mkdir;

const path = require('path');
const chalk = require('chalk');

const src = path.resolve(process.cwd(), 'static');
const target = path.resolve(process.cwd(), 'dist/static');

// 拷贝 pages
// const srcPages = path.resolve(process.cwd(), 'pages');
// const targetPages = path.resolve(process.cwd(), 'dist/pages')

rm(path.resolve(process.cwd(), 'dist'), err => {
    
    if (err) {
        console.log(err)
    } else {
        webpack(webpackConfig, function(err, stats) {
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n');

            // 先创建目录
            // mkdir('-p', targetPages);
            // 拷贝目录
            cp('-R', src + '/*', target);
            // cp('-R', srcPages + '/*', targetPages);

            console.log();
            console.log(chalk.green.bold('> Build Successed!'));
            console.log();
            console.log();
        })
    }
});