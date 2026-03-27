# 部署步骤

## 当前状态
✅ 代码已推送到 GitHub
✅ 定价页面已创建（3个套餐：免费/专业版/商业版）
✅ 用户认证组件已添加
✅ AUTH_SECRET 已生成

## 需要完成的配置

### 1. 配置 Google OAuth（必需）

按照 `docs/GOOGLE_OAUTH_SETUP.md` 的步骤：

1. 访问 https://console.cloud.google.com/
2. 创建 OAuth 2.0 客户端
3. 添加重定向 URI：`https://imagebackgroundremoverave.shop/api/auth`
4. 获取 Client ID 和 Client Secret

### 2. 在 Cloudflare Pages 添加环境变量

进入 Cloudflare Pages 项目设置 > Environment variables，添加：

**Production 环境：**
```
REMOVE_BG_API_KEY=h69McWmNg1fbD9BKy4G3R3w2
GOOGLE_CLIENT_ID=你的_client_id
GOOGLE_CLIENT_SECRET=你的_client_secret
AUTH_SECRET=8GdLNlA0B7pYmMz2/sQbqng4fwmjwxFTIqOuv+xlq7Y=
NODE_VERSION=20
```

**Preview 环境：**（同上）

### 3. 重新构建并部署

环境变量配置完成后，Cloudflare Pages 会自动触发新的部署。

## 功能说明

### 定价结构
- **免费版**：每天5张图片，标准质量，最大5MB
- **专业版**：$9/月，500张/月，HD质量，最大25MB
- **商业版**：$29/月，无限制，Ultra HD，API访问

### 登录功能
- 使用 Google OAuth 2.0
- 登录后显示用户头像和名称
- 支持登出功能

访问地址：
- 主页：https://imagebackgroundremoverave.shop
- 定价页：https://imagebackgroundremoverave.shop/pricing
