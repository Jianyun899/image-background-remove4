# Google OAuth 配置步骤（详细图文指南）

## 第一步：访问 Google Cloud Console

1. 打开浏览器，访问：https://console.cloud.google.com/
2. 使用你的 Google 账号登录

## 第二步：创建或选择项目

1. 点击顶部的项目选择器
2. 点击 "NEW PROJECT"（新建项目）
3. 项目名称输入：`bg-remover`
4. 点击 "CREATE"（创建）

## 第三步：启用 Google+ API

1. 在左侧菜单选择 "APIs & Services" > "Library"
2. 搜索 "Google+ API"
3. 点击进入，点击 "ENABLE"（启用）

## 第四步：配置 OAuth 同意屏幕

1. 左侧菜单选择 "APIs & Services" > "OAuth consent screen"
2. 选择 "External"（外部），点击 "CREATE"
3. 填写应用信息：
   - App name（应用名称）：`BG Remover`
   - User support email（用户支持邮箱）：选择你的邮箱
   - Developer contact information（开发者联系信息）：输入你的邮箱
4. 点击 "SAVE AND CONTINUE"（保存并继续）
5. Scopes 页面：点击 "ADD OR REMOVE SCOPES"
   - 勾选：`/auth/userinfo.email`
   - 勾选：`/auth/userinfo.profile`
   - 勾选：`openid`
6. 点击 "UPDATE" 然后 "SAVE AND CONTINUE"
7. Test users 页面：直接点击 "SAVE AND CONTINUE"
8. Summary 页面：点击 "BACK TO DASHBOARD"

## 第五步：创建 OAuth 客户端 ID

1. 左侧菜单选择 "APIs & Services" > "Credentials"
2. 点击顶部 "+ CREATE CREDENTIALS"
3. 选择 "OAuth client ID"
4. Application type（应用类型）：选择 "Web application"
5. Name（名称）：`BG Remover Web Client`
6. Authorized redirect URIs（授权的重定向 URI）：
   - 点击 "+ ADD URI"
   - 输入：`https://imagebackgroundremoverave.shop/api/auth`
   - 再点击 "+ ADD URI"
   - 输入：`http://localhost:3000/api/auth`（用于本地测试）
7. 点击 "CREATE"

## 第六步：复制凭据

创建成功后会弹出对话框，显示：
- **Client ID**（客户端 ID）：复制保存
- **Client Secret**（客户端密钥）：复制保存

⚠️ 请妥善保管这两个值！

---

## 配置完成后

将获得的凭据发给我，格式如下：
```
Client ID: 你的_client_id
Client Secret: 你的_client_secret
```

我会帮你配置到 Cloudflare Pages。
