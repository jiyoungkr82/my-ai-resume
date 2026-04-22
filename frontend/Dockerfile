# 1단계: 빌드 스테이지
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# [핵심] 빌드 직전에 변수를 주입받아야 빌드 파일에 주소가 박힙니다!
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# 2단계: 실행 스테이지 (Nginx 사용)
FROM nginx:alpine
# 빌드 결과물을 Nginx 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 80포트 개방
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
