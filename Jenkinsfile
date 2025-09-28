pipeline {
    agent any

    environment {
        IMAGE_NAME = "beanbarrel-frontend"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "beanbarrel_frontend"
    }

    triggers {
        // Poll SCM every 2 minutes
        pollSCM('H/2 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Old Docker Containers & Images') {
            when { branch 'dev' }
            steps {
                script {
                    echo "Cleaning up old containers and images..."

                    // Stop & remove the running container if it exists
                    sh """
                        if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                        fi
                    """

                    // Remove old image if it exists
                    sh """
                        if [ \$(docker images -q ${IMAGE_NAME}:${IMAGE_TAG}) ]; then
                            docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                        fi
                    """

                    // Remove all stopped containers (optional, keeps things clean)
                    sh "docker container prune -f"

                    // Remove dangling imagesdcds (optional)
                    sh "docker image prune -f"
                }
            }
        }

        stage('Build Docker Image') {
            when { branch 'dev' }
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Run Docker Container') {
            when { branch 'dev' }
            steps {
                script {
                    echo "Running Docker container..."
                    sh "docker run -d -p 3000:3000 --name ${CONTAINER_NAME} ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Done') {
            steps {
                echo "Pipeline finished ✅"
            }
        }
    }
}
