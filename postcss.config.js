module.exports = {
    plugins: [
        require('postcss-smart-import')(),
        require('precss')(),
        require('autoprefixer')({browsers: 'ios >= 8,android >= 4.3'}),
        require('cssnano')({zindex: false, reduceIdents: false})
    ]
}
