pipeline {
    agent any

    // 1. 도구 설정 (Tools에서 만든 이름이 'default'여야 합니다)
    //tools {
    //    dockerTool 'default' 
    //}

    // 2. 환경 변수 설정 (중복 없이 하나로 합쳤습니다)
    environment {
        DOCKER_USER = 'baeyuha' 
        IMAGE_NAME = 'parkit-client'
    }

    stages {
        stage('1. Checkout') {
            steps {
                checkout scm
            }
        }

        stage('2. Build & Docker Image') {
            steps {
                echo '도커 이미지를 생성합니다...'
                // 빌드 번호를 붙여서 고유한 이미지를 만듭니다.
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest ."
            }
        }

        stage('3. Push to Docker Hub') {
            steps {
                echo '도커 허브로 이미지를 업로드합니다...'
                // credentialsId는 젠킨스 자격 증명에 등록한 ID와 같아야 합니다.
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                 usernameVariable: 'DOCKER_HUB_USER', 
                                                 passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                    
                    sh "echo ${DOCKER_HUB_PASSWORD} | docker login -u ${DOCKER_HUB_USER} --password-stdin"
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                }
            }
        }
    }
}