pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
  }

  environment {
    IMAGE_NAME = "sample-cicd-app"
    CONTAINER_NAME = "sample-cicd-app"
    APP_PORT = "3001"
  }

  stages {
    stage("Pull code from GitHub") {
      steps {
        checkout scm
      }
    }

    stage("Build Docker image") {
      steps {
        sh """
          docker version
          docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${BUILD_NUMBER} .
        """
      }
    }

    stage("Run container") {
      steps {
        sh """
          docker rm -f ${CONTAINER_NAME} || true
          docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 ${IMAGE_NAME}:latest
          docker ps --filter "name=${CONTAINER_NAME}"
        """
      }
    }
  }
}