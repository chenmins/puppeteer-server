# Use the official Node.js image.
FROM node:18-slim

# Set the timezone to UTC to avoid time sync issues
ENV TZ=UTC

# 创建或替换 APT 源列表文件为阿里云的镜像源
RUN echo "deb http://mirrors.aliyun.com/debian/ bullseye main contrib non-free" > /etc/apt/sources.list \
    && echo "deb http://mirrors.aliyun.com/debian/ bullseye-updates main contrib non-free" >> /etc/apt/sources.list \
    && echo "deb http://mirrors.aliyun.com/debian/ bullseye-backports main contrib non-free" >> /etc/apt/sources.list \
    && echo "deb http://mirrors.aliyun.com/debian-security bullseye-security main contrib non-free" >> /etc/apt/sources.list

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    gnupg \
    tzdata \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgbm-dev \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*
# Install necessary dependencies for Puppeteer and Chinese fonts
RUN apt-get update && apt-get install -y \
    fonts-wqy-microhei \
    fonts-wqy-zenhei \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3200

# Install Puppeteer
RUN npm config set registry https://registry.npmmirror.com && npm install

# Run the app
CMD ["node", "server.js"]
