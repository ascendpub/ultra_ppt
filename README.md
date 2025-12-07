<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AutoPPT - AI PPT 生成器

基于 Google Gemini AI 的智能 PPT 生成工具，输入主题即可自动生成包含文字、图片、图表、时间线等丰富内容的演示文稿。

## ✨ 功能特点

- 🔍 **深度研究** - 使用 Gemini + Google Search 搜集主题相关数据
- 🎨 **智能设计** - 自动生成 PPT 结构和内容
- 📊 **丰富类型** - 支持图表、表格、时间线、流程图等多种幻灯片类型
- 📥 **一键下载** - 生成标准 `.pptx` 格式文件

## 🚀 快速开始

### 方式一：本地开发

**前置条件：** Node.js 18+

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 GEMINI_API_KEY

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可使用。

### 方式二：Docker 部署

**前置条件：** Docker & Docker Compose

```bash
# 1. 配置环境变量
cp .env.example .env
# 编辑 .env，填入你的 GEMINI_API_KEY

# 2. 构建并启动
docker-compose up -d --build

# 3. 查看日志
docker-compose logs -f
```

访问 http://localhost:3000 即可使用。

#### Docker 常用命令

```bash
# 停止服务
docker-compose down

# 重新构建
docker-compose up -d --build

# 查看状态
docker-compose ps

# 查看健康检查
curl http://localhost:3000/health
```

## 🔑 获取 API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/apikey)
2. 登录 Google 账号
3. 创建 API Key
4. 将 Key 填入 `.env` 或 `.env.local` 文件

## 📁 项目结构

```
autoppt/
├── App.tsx              # 主应用组件
├── components/
│   ├── GeneratorForm.tsx   # 输入表单组件
│   └── SlidePreview.tsx    # 幻灯片预览组件
├── services/
│   ├── geminiService.ts    # Gemini AI 服务
│   └── pptService.ts       # PPT 生成服务
├── types.ts             # TypeScript 类型定义
├── Dockerfile           # Docker 镜像配置
├── docker-compose.yml   # Docker Compose 配置
├── nginx.conf           # Nginx 配置
└── .env.example         # 环境变量示例
```

## 📋 支持的幻灯片类型

| 类型 | 说明 |
|------|------|
| TITLE | 标题页 |
| CONTENT_TEXT | 纯文本内容 |
| CONTENT_TEXT_IMAGE | 图文混排 |
| CONTENT_VIDEO | 视频幻灯片 |
| TABLE | 数据表格 |
| CHART | 图表 (柱状图/饼图/折线图) |
| BIG_NUMBER | 大数字展示 |
| QUOTE | 名人名言 |
| TIMELINE | 时间线 |
| PROCESS | 流程图 |
| CLOSING | 结尾页 |

## 🛠️ 技术栈

- **前端框架：** React 19 + TypeScript
- **构建工具：** Vite
- **AI 服务：** Google Gemini API
- **PPT 生成：** pptxgenjs
- **UI 样式：** Tailwind CSS
- **图标：** Lucide React
- **部署：** Docker + Nginx

## 📝 License

MIT License
