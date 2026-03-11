pipeline {
    agent any

    environment {
        // Define common variables
        SERVICE_NAME = 'parkit-client'
        DOCKER_IMAGE_NAME = "parkitteam/${env.JOB_BASE_NAME.replace('-CI', '')}"
        DOCKER_TAG = "build-${env.BUILD_ID}"
    }

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Checkout') {
            steps {
                // 깃에서 코드 Checkout
                echo "Checking out code..."
                checkout scm
            }
        }

        // 리액트용 빌드 단계
        stage('Install & Build') {
            steps {
                echo "Installing dependencies and building React app..."
                // 리액트 빌드 명령어
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                // 폴더 이동 후 Docker image build
                    echo "Building Docker Image: ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} -t ${DOCKER_IMAGE_NAME}:latest ."
            }
        }

        stage('Push Docker Image') {
            steps {
                // Docker Hub에 이미지를 푸시
                echo 'Pushing Docker Image to Docker Hub registry...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                    sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }

        stage('Cleanup') {
            steps {
                // 필요없는 도커 이미지 삭제
                echo 'Pruning unused Docker images...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        always {
            echo "Pipeline for ${SERVICE_NAME} finished."
        }
        success {
            echo "Build Success!"
        }
        failure {
            echo "Build Failed."
        }
    }
}
