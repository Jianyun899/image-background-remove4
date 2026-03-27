#!/bin/bash

# Cloudflare Pages 环境变量配置脚本
# 需要先设置 CLOUDFLARE_API_TOKEN 和 CLOUDFLARE_ACCOUNT_ID

PROJECT_NAME="image-background-remove4"
AUTH_SECRET="8GdLNlA0B7pYmMz2/sQbqng4fwmjwxFTIqOuv+xlq7Y="

echo "配置 Cloudflare Pages 环境变量..."
echo "项目: $PROJECT_NAME"
echo ""
echo "⚠️  请先完成 Google OAuth 配置，然后替换下面的占位符："
echo ""
echo "GOOGLE_CLIENT_ID=你的_client_id"
echo "GOOGLE_CLIENT_SECRET=你的_client_secret"
echo ""
echo "AUTH_SECRET 已生成: $AUTH_SECRET"
