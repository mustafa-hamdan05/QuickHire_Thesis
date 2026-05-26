FROM eclipse-temurin:17

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/gigflow-backend-0.0.1-SNAPSHOT.jar"]