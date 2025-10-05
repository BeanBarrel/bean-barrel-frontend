pipeline {
    agent any

    environment {
        IMAGE_NAME = "beanbarrel-frontend"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "beanbarrel_frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Docker Environment') {
            steps {
                script {
                    echo "Cleaning old containers, images, and cache..."

                    sh """
                        if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """

                    sh """
                        if [ \$(docker images -q ${IMAGE_NAME}:${IMAGE_TAG}) ]; then
                            docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                        fi
                    """

                    sh "docker container prune -f"
                    sh "docker image prune -f"
                    sh "docker builder prune -f"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def apiUrl = ''
                    if (env.BRANCH_NAME == 'dev') {
                        apiUrl = 'http://10.0.0.37:9091/'
                    } else {
                        apiUrl = 'http://147.93.43.194:9091/api/'
                    }

                    echo "Building Docker image with API URL: ${apiUrl}"

                    sh """
                        docker build --no-cache \
                        --build-arg NEXT_PUBLIC_API_URL=${apiUrl} \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    def apiUrl = ''
                    if (env.BRANCH_NAME == 'dev') {
                        apiUrl = 'http://10.0.0.37:9091/'
                    } else {
                        apiUrl = 'http://147.93.43.194:9091/api/'
                    }

                    echo "Running container with API URL: ${apiUrl}"

                    sh """
                        docker run -d \
                        -p 3000:3000 \
                        --name ${CONTAINER_NAME} \
                        -e NEXT_PUBLIC_API_URL=${apiUrl} \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Done') {
            steps {
                echo "✅ Pipeline complete"
            }
        }
    }
}
