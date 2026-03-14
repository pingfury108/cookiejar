/** @type {import('extension').ExtensionConfig} */
export default {
  // 构建配置
  outDir: 'dist',

  // 复制到根目录的文件
  copy: [
    'public/**/*'  // 将 public 目录下所有文件复制到构建输出根目录
  ],

  // 开发配置
  dev: {
    server: {
      port: 3000
    }
  },

  // 构建配置
  build: {
    minify: {
      css: true,
      js: true
    }
  }
};