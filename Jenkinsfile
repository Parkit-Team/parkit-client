pipeline {
    agent any

    // 젠킨스 Tools 설정에서 만든 'default' 도커를 불러옵니다.
    tools {
        dockerTool 'default' 
    }

    environment {
        DOCKER_USER = 'baeyuha' 
        IMAGE_NAME = 'parkit-client'
    }

    // 변수 설정: 내 도커 아이디를 여기에 적어주세요
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
                // 내 아이디/이미지명:태그 형태로 빌드합니다.
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER} ."
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest ."
            }
        }

        stage('3. Push to Docker Hub') {
            steps {
                echo '도커 허브로 이미지를 업로드합니다...'
                // 아까 만든 'dockerhub-credentials' 열쇠를 사용합니다.
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