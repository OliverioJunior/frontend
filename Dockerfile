FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm ci

COPY . .

ENV HOST=0.0.0.0      
ENV PORT=5173         
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 5173

CMD ["npm","run","dev"]
