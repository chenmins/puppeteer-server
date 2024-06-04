
# Puppeteer 服务

## 项目介绍

Puppeteer 服务是一个基于 Node.js 和 Puppeteer 的简单 Web 服务，允许用户通过 HTTP 请求生成网页的截图和 PDF 文件。该服务运行在 Docker 容器中，确保环境的一致性和易于部署。

## 主要功能

- 截图服务：生成指定 URL 的网页截图。
- PDF 导出服务：生成指定 URL 的网页 PDF 文件。

## 环境要求

- Docker
- Docker Compose (可选)

## 编译说明

### 1. 克隆项目

首先，克隆项目到本地：

```sh
git clone <你的仓库地址>
cd puppeteer-server
```

### 2. 构建 Docker 镜像

在项目根目录下运行以下命令构建 Docker 镜像：

```sh
docker build -t chenmins/puppeteer-server .
```

### 3. 运行 Docker 容器

构建完成后，运行以下命令启动容器：

```sh
docker run -p 3200:3200 chenmins/puppeteer-server
```

## 调用测试说明

服务启动后，你可以通过以下 URL 测试截图和 PDF 导出服务：

### 1. 截图服务

发送 GET 请求到以下 URL 以生成网页截图：

```
http://localhost:3200/screenshot?url=https://example.com
```

请求参数：

- `url`：必需。需要截图的网页 URL。

返回值：

- 返回生成的截图图像。

### 2. PDF 导出服务

发送 GET 请求到以下 URL 以生成网页 PDF 文件：

```
http://localhost:3200/pdf?url=https://example.com
```

请求参数：

- `url`：必需。需要导出为 PDF 的网页 URL。

返回值：

- 返回生成的 PDF 文件。

## 示例代码

以下是一个简单的 Node.js 服务器代码示例 `server.js`，用于处理截图和 PDF 导出请求：

```javascript
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3200;

app.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot();
        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        res.status(500).send('Error generating screenshot');
    }
});

app.get('/pdf', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const pdf = await page.pdf();
        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.send(pdf);
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
```

## 贡献指南

欢迎任何形式的贡献！如果你有任何建议或发现了问题，请提交 issue 或创建 pull request。

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](./LICENSE) 文件。
