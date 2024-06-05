
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

在 Puppeteer 中，`page.pdf` 方法可以接受一个对象作为参数，其中的 `format` 属性可以指定生成 PDF 的纸张格式。除了 `A4` 之外，Puppeteer 支持以下纸张格式：

- `Letter`
- `Legal`
- `Tabloid`
- `Ledger`
- `A0`
- `A1`
- `A2`
- `A3`
- `A4`
- `A5`
- `A6`

以下是一个示例，展示了如何使用不同的纸张格式：

```javascript
const pdf = await page.pdf({ format: 'Letter' });
```

此外，你还可以通过指定宽度和高度来自定义纸张的尺寸。以下是一些示例：

```javascript
// 使用指定的宽度和高度
const pdf = await page.pdf({ width: '8.5in', height: '11in' });

// 使用指定的宽度和高度（厘米）
const pdf = await page.pdf({ width: '21cm', height: '29.7cm' });

// 使用指定的宽度和高度（像素）
const pdf = await page.pdf({ width: '800px', height: '600px' });
```

完整的 `page.pdf` 方法参数列表如下：

- `path` (string): 保存 PDF 文件的路径。如果没有指定，PDF 将作为 Buffer 返回。
- `scale` (number): 缩放比例，默认是 1。
- `displayHeaderFooter` (boolean): 是否显示页眉和页脚，默认是 `false`。
- `headerTemplate` (string): 页眉的 HTML 模板。
- `footerTemplate` (string): 页脚的 HTML 模板。
- `printBackground` (boolean): 是否打印背景图形，默认是 `false`。
- `landscape` (boolean): 是否横向打印，默认是 `false`。
- `pageRanges` (string): 要打印的页面范围，例如 `'1-5'`，`'1, 3, 5'`。
- `format` (string): 纸张格式，例如 `'A4'`，`'Letter'` 等。
- `width` (string): 自定义纸张宽度。
- `height` (string): 自定义纸张高度。
- `margin` (object): 页边距，包括 `top`，`right`，`bottom` 和 `left`。
- `preferCSSPageSize` (boolean): 是否优先使用 CSS 中的 `@page` 尺寸，默认是 `false`。

示例如下：

```javascript
const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
        top: '1cm',
        bottom: '1cm',
        left: '1cm',
        right: '1cm'
    }
});
```

这个示例将生成一个 A4 尺寸的 PDF，打印背景图形，并设置 1 厘米的页边距。

## 贡献指南

欢迎任何形式的贡献！如果你有任何建议或发现了问题，请提交 issue 或创建 pull request。

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](./LICENSE) 文件。
