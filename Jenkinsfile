pipeline {
    agent any

    environment {
        IMAGE_NAME = "beanbarrel-frontend"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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

        stage('Run Docker Container (Optional)') {
            steps {
                script {
                    echo "Running Docker container..."
                    sh "docker run -d -p 3000:3000 --name beanbarrel_frontend ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Done') {
            steps {
                echo "Pipeline completed ✅"
            }
        }
    }
}
