const path = require('path');

module.exports = {
    resolve: {
        alias: {
            'app': path.resolve(__dirname, './app'),
            'abilities': path.resolve(__dirname, './app/abilities'),
            'assets': path.resolve(__dirname, './app/assets'),
            'caches': path.resolve(__dirname, './app/caches'),
            'components': path.resolve(__dirname, './app/components'),
            'configs': path.resolve(__dirname, './app/configs'),
            'constants': path.resolve(__dirname, './app/constants'),
            'controls': path.resolve(__dirname, './app/controls'),
            'databases': path.resolve(__dirname, './app/databases'),
            'globals': path.resolve(__dirname, './app/globals'),
            'handlers': path.resolve(__dirname, './app/handlers'),
            'helpers': path.resolve(__dirname, './app/helpers'),
            'modules': path.resolve(__dirname, './app/modules'),
            'screens': path.resolve(__dirname, './app/screens'),
            'services': path.resolve(__dirname, './app/services'),
            'stores': path.resolve(__dirname, './app/stores'),
            'utils': path.resolve(__dirname, './app/utils')
        }
    }
};
