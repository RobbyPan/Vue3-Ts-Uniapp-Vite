import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// 开发环境判断等参考文档https://uniapp.dcloud.net.cn/worktile/running-env.html；默认打包后前后端同源部署，所以此处baseUrl仅为开发环境
const baseURL: string = '';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // 设置开发服务器的端口号
    host: '0.0.0.0', // 设置开发服务器的主机地址
    open: true, // 是否自动在浏览器中打开页面
    hmr: true, // 开启热更新
    proxy: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      '/dev-api': {
        target: baseURL, // 后端服务实际地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, ''),
      },
    },
  },
  plugins: [uni()],
});
