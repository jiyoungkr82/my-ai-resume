# 1. 빌드 스테이지: Gradle을 사용하여 JAR 파일 생성
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
# 빌드에 필요한 파일들만 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# 실행 권한 부여 및 빌드 (테스트는 시간 단축을 위해 제외)
RUN chmod +x ./gradlew
RUN ./gradlew clean bootJar -x test

# 2. 실행 스테이지: 빌드된 JAR만 실행
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
