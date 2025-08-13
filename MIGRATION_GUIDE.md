# 🚀 小熊猫恋爱日记App - 迁移指南

## 📋 在新电脑上继续开发的完整步骤

### 1. **环境准备** ⚙️

#### 安装必要软件：
- **Node.js** (版本 18+): https://nodejs.org/
- **Git**: https://git-scm.com/
- **VS Code** (推荐): https://code.visualstudio.com/
- **Expo CLI**: `npm install -g @expo/cli`

#### 验证安装：
```bash
node --version
npm --version
git --version
expo --version
```

### 2. **代码获取** 📥

#### 方法一：从GitHub克隆（推荐）
```bash
# 创建项目目录
mkdir love-pair
cd love-pair

# 克隆仓库（替换为你的GitHub用户名）
git clone https://github.com/yourusername/love-pair.git .

# 或者如果还没有GitHub仓库，直接下载项目文件
```

#### 方法二：手动传输
- 将整个 `love-pair` 文件夹复制到新电脑
- 确保包含所有文件和文件夹

### 3. **依赖安装** 📦

```bash
# 进入项目目录
cd love-pair

# 安装依赖
npm install

# 验证安装
npm list
```

### 4. **环境配置** 🔧

#### 检查配置文件：
- ✅ `package.json` - 项目依赖
- ✅ `app.json` - Expo配置
- ✅ `tsconfig.json` - TypeScript配置
- ✅ `config/supabase.js` - Supabase配置

#### 重要：Supabase配置
确保 `config/supabase.js` 包含正确的配置：
```javascript
export const SUPABASE_CONFIG = {
  url: 'https://cyieiemnudlrfitbggjv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

### 5. **数据库设置** 🗄️

#### 在Supabase中执行SQL：
1. 登录 https://supabase.com
2. 进入你的项目
3. 打开 SQL Editor
4. 执行以下文件：
   - `database/schema.sql` - 创建表结构
   - `database/update-policies.sql` - 设置权限策略

### 6. **启动开发服务器** 🚀

```bash
# 启动开发服务器
npx expo start

# 或者使用隧道模式（推荐用于手机测试）
npx expo start --tunnel

# 清除缓存（如果遇到问题）
npx expo start --clear
```

### 7. **测试功能** ✅

#### 基础功能测试：
1. **登录/注册** - 测试用户认证
2. **笑话生成器** - 测试数据库连接
3. **Pin功能** - 测试消息发送
4. **其他页面** - 确保所有页面正常加载

#### 手机测试：
1. 安装 Expo Go App
2. 扫描二维码连接
3. 测试所有功能

### 8. **常见问题解决** 🔧

#### 问题1：依赖安装失败
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 问题2：Expo连接问题
```bash
# 使用隧道模式
npx expo start --tunnel

# 或者使用本地网络
npx expo start --lan
```

#### 问题3：数据库连接失败
- 检查 `config/supabase.js` 配置
- 确认Supabase项目状态
- 检查网络连接

#### 问题4：TypeScript错误
```bash
# 重新安装TypeScript
npm install typescript @types/react @types/react-native
```

### 9. **开发工具推荐** 🛠️

#### VS Code扩展：
- **React Native Tools**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Prettier - Code formatter**

#### 调试工具：
- **React Native Debugger**
- **Flipper** (Facebook调试工具)

### 10. **项目结构说明** 📁

```
love-pair/
├── app/                    # 页面文件
│   ├── _layout.tsx        # 布局配置
│   ├── index.tsx          # 首页
│   ├── login.tsx          # 登录页
│   ├── joke.tsx           # 笑话页面
│   ├── pin.tsx            # Pin功能
│   └── ...                # 其他页面
├── lib/                   # 工具库
│   ├── auth-context.tsx   # 认证上下文
│   ├── database.ts        # 数据库服务
│   └── supabase.ts        # Supabase配置
├── config/                # 配置文件
│   └── supabase.js        # Supabase密钥
├── database/              # 数据库文件
│   ├── schema.sql         # 表结构
│   └── update-policies.sql # 权限策略
└── assets/                # 静态资源
```

### 11. **下一步开发计划** 📈

#### 待完成功能：
- [ ] 伴侣配对系统
- [ ] 实时消息推送
- [ ] 照片上传功能
- [ ] 离线模式支持
- [ ] 数据备份功能

#### 优化项目：
- [ ] 性能优化
- [ ] UI/UX改进
- [ ] 错误处理完善
- [ ] 测试覆盖

### 12. **联系信息** 📞

如果遇到问题：
- 检查项目文档
- 查看控制台错误信息
- 参考React Native官方文档
- 查看Supabase文档

---

## 🎉 祝你开发顺利！

记住：小熊猫App的核心是传递爱意，代码只是工具！
🐼💕
