module.exports = {
    plugins: [
        require('@fullhuman/postcss-purgecss')({
            content: [
                './assets/css/bootstrap.min.css',
                './assets/css/animate.min.css',
                // Añade todas las rutas de archivos que contienen tu HTML y JavaScript
            ],
            defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
        })
    ]
}
