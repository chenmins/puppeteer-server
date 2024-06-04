# Use the official Node.js image.
FROM node:18-slim

# Set the timezone to UTC to avoid time sync issues
ENV TZ=UTC

# Configure apt to use Tsinghua mirrors
RUN echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free" > /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free" >> /etc/apt/sources.list

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


# Create app directory
WORKDIR /usr/src/app

# Copy app source code
COPY . .

# Expose the port the app runs on
EXPOSE 3200

# Install Puppeteer
RUN npm install

# Run the app
CMD ["node", "server.js"]
