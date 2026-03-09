# 1. 빌드를 위한 베이스 이미지 선택 (Node.js)
FROM node:18-alpine

# 2. 컨테이너 내 작업 디렉토리 설정
WORKDIR /app

# 3. 라이브러리 설치를 위해 package.json 복사
COPY package*.json ./

# 4. 의존성 라이브러리 설치
RUN npm install

# 5. 나머지 소스 코드 전체 복사
COPY . .

# 6. 빌드 실행 (필요한 경우)
# RUN npm run build

# 7. 애플리케이션 실행 포트 설정
EXPOSE 3000

# 8. 앱 실행 명령
CMD ["npm", "start"]