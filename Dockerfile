FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY backend ./backend
COPY shared ./shared
ENV HOST=0.0.0.0
ENV PORT=4174
EXPOSE 4174
CMD ["node", "backend/server.cjs"]
