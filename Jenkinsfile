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

        stage('Clean Old Docker Containers & Images') {
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

                    // Optional: Remove all stopped containers
                    sh "docker container prune -f"

                    // Optional: Remove dangling images
                    sh "docker image prune -f"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

       stage('Run Docker Container') {
    steps {
        script {
            echo "Running Docker container..."
            
            // Set API URL based on branch
            def apiUrl = ''
            if (env.BRANCH_NAME == 'dev') {
                apiUrl = 'http://10.0.0.37:9091/'
            } else {
                apiUrl = 'https://api.beanbarrel.com/api'
            }

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
                echo "Pipeline finished ✅"
            }
        }
    }
}
