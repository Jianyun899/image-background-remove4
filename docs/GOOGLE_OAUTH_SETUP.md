# Google OAuth 配置指南

## 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API

## 2. 配置 OAuth 同意屏幕

1. 进入 "APIs & Services" > "OAuth consent screen"
2. 选择 "External" 用户类型
3. 填写应用信息：
   - 应用名称：BG Remover
   - 用户支持电子邮件：你的邮箱
   - 开发者联系信息：你的邮箱
4. 添加作用域：`email`, `profile`, `openid`
5. 保存并继续

## 3. 创建 OAuth 2.0 客户端 ID

1. 进入 "APIs & Services" > "Credentials"
2. 点击 "Create Credentials" > "OAuth client ID"
3. 应用类型：Web application
4. 名称：BG Remover Web Client
5. 授权的重定向 URI：
   - `https://imagebackgroundremoverave.shop/api/auth`
   - `http://localhost:3000/api/auth` (用于本地测试)
6. 创建后会获得：
   - Client ID
   - Client Secret

## 4. 配置环境变量

将获得的凭据添加到 Cloudflare Pages 环境变量：

```bash
GOOGLE_CLIENT_ID=你的_client_id
GOOGLE_CLIENT_SECRET=你的_client_secret
AUTH_SECRET=使用_openssl_rand_-base64_32_生成
```

## 5. 生成 AUTH_SECRET

在终端运行：
```bash
openssl rand -base64 32
```

将生成的字符串作为 AUTH_SECRET 的值。
