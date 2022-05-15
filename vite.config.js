/* eslint-disable */
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { loadEnv } from 'vite'
export default ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_PUBLIC_PATH,
    clearScreen: false,
    server: {
      hmr: { overlay: false }, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
      port: 90,
      open: false, // 类型： boolean | string在服务器启动时自动在浏览器中打开应用程序；
      cors: true, // 类型： boolean | CorsOptions 为开发服务器配置 CORS。默认启用并允许任何源
      proxy: {}
    },
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    build: {
      assetsDir: 'static',
      minify: 'terser',
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, './'),
        '@': resolve(__dirname, 'src'),
        'src': resolve(__dirname, 'src')
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
    },
    css: {
      // css sass  charset 报错
      postcss: {
        plugins: [
            {
              postcssPlugin: 'internal:charset-removal',
              AtRule: {
                charset: (atRule) => {
                  if (atRule.name === 'charset') {
                    atRule.remove();
                  }
                }
              }
            }
        ],
      }
    },
    optimizeDeps: {
      include: ['element-plus/lib/locale/lang/zh-cn',
       'bpmn-js/lib/Modeler',
       'bpmn-js-token-simulation'
      ]
    }
  }
}
