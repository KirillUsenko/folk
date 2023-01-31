'use strict';

const {series, src, watch, parallel, dest} = require('gulp');
const del = require('del');
const glp = require('gulp-load-plugins')();
const mode = require('gulp-mode')({
        modes: ["production", "development"],
        default: "development",
        verbose: false
    });
const webpackConfig = require('./webpack.config');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const os = require('os');
const sassGulp = require('gulp-sass')(require('sass'));
const gulpFTP = require('vinyl-ftp');

const path = require( 'path' )
const exec = require('child_process').exec;

/* Json data from data directory */
const data = {}
const dir = './src/components/'

/* Run console commands img optimization */
const runCommandJpegoptim = (cb) => {
    if(!fs.existsSync('./dist/img') || /^win/i.test(process.platform)) return cb();
    exec('find ./dist/img/ -type f -iname "*.jpg" -exec jpegoptim --strip-all --all-progressive -pm75 {} \\;', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
};
const runCommandOptimpng = (cb) => {
    if(!fs.existsSync('./dist/img') || /^win/i.test(process.platform)) return cb();
    exec('find ./dist/img/ -type f -iname "*.png" -exec optipng -strip all -o5 {} \\;', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
};

// Tasks

const jsonDataGenerate = (cb) => {
    try {
        const modules = fs.readdirSync( dir )
        modules.forEach( item => {
            const module = path.join( dir, item )
            if ( ! fs.lstatSync( module ).isDirectory() ) return
            const jsons = fs.readdirSync( module ).filter( item => path.extname( item ) === '.json' )
            jsons.forEach( json => {
                const name = path.basename( json, path.extname( json ) )
                const file = path.join( dir, item, json )
                data[name] = JSON.parse( fs.readFileSync( file ) )
            })
        })
    } catch (e) {
        console.log(e)
    }
    if(cb) {
        return cb();
    }
}
jsonDataGenerate();

const clean = () => {
    return del(['dist']);
};

const pug = () => {
    return src('src/pages/*.pug')
        .pipe(glp.pug({
            locals : {
                data: data,
            },
            pretty: true
        }))
        .pipe(dest('dist'))
        .pipe(mode.development(browserSync.stream()));
};

const sass = () => {
    return src([
            'src/static/sass/vars.scss',
            'src/static/sass/fonts.scss',
            'src/static/sass/common.scss',
            'src/components/**/*.scss',
        ])
        .pipe(mode.development(glp.sourcemaps.init()))
        .pipe(glp.concat('style.scss'))
        .pipe(sassGulp())
        .pipe(mode.production(glp.autoprefixer({
            overrideBrowserslist: ['last 4 versions'],
            cascade: false,
            grid: true
        })))
        .pipe(mode.production(glp.groupCssMediaQueries()))
        .pipe(mode.production(dest('dist/css')))
        .pipe(mode.production(glp.csso()))
        .pipe(glp.rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(mode.development(glp.sourcemaps.write('.')))
        .pipe(dest('dist/css'))
        .pipe(mode.development(browserSync.stream()));
};

const js = () => {
    return src(['src/static/js/main.js'])
        .pipe(webpackStream(webpackConfig), glp.webpack)
        .pipe(dest('dist/js'))
        .pipe(mode.development(browserSync.stream()));
};

const fonts = () => {
    src('src/static/fonts/**/*.ttf')
        .pipe(glp.ttf2woff())
        .pipe(dest('src/static/fonts'));

    return src('src/static/fonts/**/*.ttf')
        .pipe(glp.ttf2woff2())
        .pipe(dest('src/static/fonts'));
};

exports.fonts = fonts;

const ftp = () => {
    const ftpConnect = gulpFTP.create({
        host: 'vea88.beget.tech',
        user: 'vea88_gulp',
        password: '1IaIow&Z',
        parallel: 5
    });
    return src('./dist/**/*.*')
        .pipe(ftpConnect.dest('/russian'))
}

exports.ftp = ftp;

const fontsCopy = () => {
    return src('src/static/fonts/**/*.{woff,woff2}')
        .pipe(dest('dist/fonts'));
};

const img = () => {
    return src('src/static/img/**/*.{png,gif,jpg,jpeg,ico}')
        .pipe(dest('dist/img'));
};

const svg = () => {
    return src('src/static/img/svg/**/*.svg')
        .pipe(glp.svgo())
        .pipe(dest('dist/img/svg'));
};

const svgstore = () => {
    return src('src/static/img/icons/*.svg')
        .pipe(glp.svgo())
        .pipe(glp.svgstore())
        .pipe(dest('dist/img/icons'));
};

const watchFunc = () => {
    browserSync.init({
        server: "dist",
        notify: false
    });
    watch('src/**/*.pug', series(pug));
    watch('src/**/*.json', series(jsonDataGenerate, pug));
    watch('src/**/*.scss', series(sass));
    watch('src/static/js/**/*.js', series(js));
    watch('src/static/img/svg/**/*.svg', series(svg));
    watch('src/static/img/icons/*.svg', series(svgstore));
    watch('src/static/fonts/**/*.{woff, woff2}', series(fontsCopy));
    watch('src/static/img/**/*.{png,gif,jpg,ico}', series(img));
};

if(mode.development()) {
    data['version'] = '';
    webpackConfig.mode = "development";
    webpackConfig.devtool = 'source-map';
    exports.default = series(clean, parallel(sass, js, fontsCopy, img, svg, svgstore, pug), parallel(watchFunc));
} else {
    data['version'] = new Date().getTime();
    webpackConfig.mode = "production";
    exports.default = series(clean, parallel(pug, sass, js, fontsCopy, img, svg, svgstore), parallel(runCommandJpegoptim, runCommandOptimpng));
}
