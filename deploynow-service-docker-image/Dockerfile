FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /home/app

COPY package.json package-lock.json ./
RUN npm install

COPY main.sh ./main.sh
COPY script.js ./script.js

COPY utils ./utils

RUN chmod +x main.sh script.js

ENTRYPOINT ["/home/app/main.sh"]