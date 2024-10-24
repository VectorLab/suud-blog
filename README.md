# Wayne.Wang 博客程序（Nuxt.js）

## 概述
本项目由矢量实验室编写，旨在指导博客站点接入联合用户中心（簡化通用用戶儀表板）。请各位实验委员注意完善代码。

## 项目结构
```
.
├── app.vue
├── blog.db
├── components
│   ├── About.vue
│   ├── Contact.vue
│   ├── Footer.vue
│   ├── Hero.vue
│   ├── List.vue
│   └── Navbar.vue
├── composables
│   └── useAuth.js
├── nuxt.config.js
├── package.json
├── pages
│   ├── columns
│   │   ├── [id].vue
│   │   └── index.vue
│   ├── dashboard.vue
│   ├── editor
│   │   ├── [id].vue
│   │   └── index.vue
│   ├── index.vue
│   ├── notes
│   │   ├── [id].vue
│   │   └── index.vue
│   └── trade.vue
├── plugins
│   └── script.client.js
├── public
│   ├── bg-hero-sm.jpg
│   ├── bg-hero.jpg
│   ├── bg-keyboard.jpg
│   ├── favicon.ico
│   ├── gold.png
│   └── logo.png
└── server
    ├── api
    │   ├── articles.js
    │   ├── comments.js
    │   ├── login.post.js
    │   ├── notes.js
    │   ├── rebuild.js
    │   └── settings.js
    ├── config
    │   └── ssoConfig.js
    ├── tsconfig.json
    └── utils
        ├── db.js
        └── ssocrypt.js
```

## 需要填写的信息
1. **components/Hero.vue**: 配置ssoClientID项
2. **ssoConfig**: 配置SSO内容

## 设置
使用yarn安装node_modules
```bash
yarn install
```

## 测试
使用yarn启动
```bash
yarn run dev
```

应用程序将运行在 `http://localhost:3000`

成功认证后，你将被重定向到博客的仪表板，如果正常显示内容，说明测试完毕

## 注意事项
- 确保所有敏感信息（私钥、密码）都安全存储，不要在客户端代码中暴露
- 在生产环境中始终使用HTTPS以保护传输中的数据

## 错误处理
该应用程序包含基本的错误处理：
- 客户端错误重定向到主页
- 服务器端错误返回适当的HTTP状态码
对于生产使用，考虑实现更健壮的错误处理和用户反馈
