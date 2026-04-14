FROM node:20-alpine
WORKDIR /app

# 캐시 효율을 위해 package.json 먼저 복사
COPY package*.json ./
RUN npm install

# 전체 소스 복사 (.env 포함)
COPY . .

# Vite 개발 서버 포트
EXPOSE 5173

# 핵심: --host 옵션을 추가하여 외부 접속 허용
# npm run dev 뒤에 -- --host를 붙이면 실제 실행 시 vite --host가 됩니다.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
