# 🐼 小熊猫恋爱日记 App

一个专为情侣设计的互动应用，包含多种实用功能，采用可爱的小熊猫主题设计。

## ✨ 主要功能

### 🌟 核心功能
- **留言板** - 公开的留言板，可以发布提醒、情话、问题和公告
- **位置共享** - 实时位置共享，查看彼此位置和距离
- **思念传递** - 发送爱心消息和快速问候
- **共同相册** - 上传、分享、评论和点赞照片

### 📱 实用工具
- **月经周期** - 完整的生理周期记录和提醒
- **心情日记** - 记录每日心情和感受
- **纪念日** - 重要日期的记录和提醒
- **愿望清单** - 共同愿望的管理和完成追踪
- **笑话生成器** - 随机生成有趣的笑话
- **情侣闹钟** - 同步闹钟和提醒
- **情侣记账** - 共同财务记录
- **约会建议** - 创意约会想法推荐

## 🚀 技术栈

- **前端**: React Native + Expo
- **后端**: Supabase (PostgreSQL + 实时数据库)
- **认证**: Supabase Auth
- **存储**: Supabase Storage
- **部署**: Expo Go (开发测试)

## 📋 安装和运行

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Expo CLI
- Expo Go 应用（手机端测试）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ciran1234/love-pair.git
cd love-pair
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境**
   - 复制 `config/supabase.js.example` 为 `config/supabase.js`
   - 填入你的 Supabase 项目配置

4. **启动开发服务器**
```bash
npm start
```

5. **在手机上测试**
   - 安装 Expo Go 应用
   - 扫描终端显示的二维码
   - 选择 "tunnel" 模式以获得最佳连接

## 🗄️ 数据库设置

### 1. 创建 Supabase 项目
- 访问 [supabase.com](https://supabase.com)
- 创建新项目
- 获取项目 URL 和匿名密钥

### 2. 执行数据库脚本
在 Supabase SQL Editor 中执行：
```sql
-- 执行完整的数据库架构
-- 文件位置: database/schema.sql

-- 或者执行更新脚本（如果已有基础架构）
-- 文件位置: database/update-schema.sql
```

### 3. 配置环境变量
在 `config/supabase.js` 中填入：
```javascript
export const SUPABASE_CONFIG = {
  url: '你的项目URL',
  anonKey: '你的匿名密钥'
};
```

## 🔧 开发指南

### 项目结构
```
love-pair/
├── app/                 # 页面组件
│   ├── _layout.tsx     # 主布局和路由
│   ├── index.tsx       # 首页
│   ├── message-board.tsx  # 留言板
│   ├── location.tsx    # 位置共享
│   ├── pin.tsx         # 思念传递
│   ├── gallery.tsx     # 相册
│   ├── cycle.tsx       # 月经周期
│   ├── mood.tsx        # 心情日记
│   └── ...             # 其他功能页面
├── lib/                 # 工具库
│   ├── auth-context.tsx # 认证上下文
│   ├── database.ts     # 数据库服务
│   └── supabase.ts     # Supabase 客户端
├── database/            # 数据库脚本
│   ├── schema.sql      # 完整数据库架构
│   └── update-schema.sql # 更新脚本
└── config/              # 配置文件
    └── supabase.js     # Supabase 配置
```

### 添加新功能
1. 在 `app/` 目录创建新页面
2. 在 `lib/database.ts` 添加数据库方法
3. 在 `database/schema.sql` 添加数据表
4. 在 `app/_layout.tsx` 添加路由
5. 在 `app/index.tsx` 添加到功能网格

## 📱 使用说明

### 首次使用
1. 注册/登录账号
2. 完善个人资料
3. 邀请伴侣加入
4. 开始使用各项功能

### 功能特色
- **小熊猫主题**: 可爱的棕色小熊猫设计
- **实时同步**: 所有数据实时同步到云端
- **隐私保护**: 行级安全策略保护用户数据
- **响应式设计**: 适配各种屏幕尺寸

## 🔒 安全特性

- **行级安全策略 (RLS)**: 确保用户只能访问自己的数据
- **认证系统**: 基于 Supabase Auth 的安全认证
- **数据加密**: 所有数据传输都经过加密
- **权限控制**: 严格的访问权限管理

## 🚀 部署

### 开发环境
- 使用 `npm start` 启动开发服务器
- 通过 Expo Go 在真机上测试

### 生产环境
- 构建 APK/IPA 文件
- 发布到应用商店
- 配置生产环境 Supabase 项目

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 📄 许可证

MIT License

## 🆘 常见问题

### Q: 无法连接到 Supabase？
A: 检查网络连接和配置信息是否正确

### Q: 照片上传失败？
A: 确保 Supabase Storage 已正确配置

### Q: 位置功能不工作？
A: 检查设备位置权限和网络连接

## 📞 支持

如有问题，请：
1. 查看 [Issues](../../issues) 页面
2. 创建新的 Issue
3. 联系开发者

---

**小熊猫恋爱日记** - 让爱情更有趣，让生活更甜蜜！ 🐼💕
