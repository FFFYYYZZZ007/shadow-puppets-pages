
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'shadow-puppets-pages',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],

      },
    }],

    'umi-plugin-nprogress',
  ],
  proxy: {
    "/api": {
      "target": "http://127.0.0.1:8080",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
}
