const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@font-size-base': '16px',
            // @teal1 in constants.less
            '@primary-color': '#35807E',
        },
    }),
);