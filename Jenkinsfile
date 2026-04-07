pipeline {
  agent any

  options {
    timestamps()
    skipDefaultCheckout(true)
  }

  triggers {
    githubPush()
  }

  parameters {
    string(
      name: "DOCKERHUB_REPO",
      defaultValue: "yourdockerhubusername/sample-cicd-app",
      description: "Docker Hub image name (example: myuser/sample-cicd-app)"
    )
  }

  environment {
    CONTAINER_NAME = "sample-cicd-app"
    APP_PORT = "3001"
    DOCKERHUB_REPO = "${params.DOCKERHUB_REPO}"
    DOCKERHUB_CREDENTIALS_ID = "dockerhub-creds"
  }

  stages {
    stage("Pull code from GitHub") {
      steps {
        checkout scm
      }
    }

    stage("Validate configuration") {
      steps {
        sh """
          if [ -z "${DOCKERHUB_REPO}" ] || [ "${DOCKERHUB_REPO}" = "yourdockerhubusername/sample-cicd-app" ]; then
            echo "ERROR: Set DOCKERHUB_REPO to your Docker Hub repo (example: myuser/sample-cicd-app)."
            exit 1
          fi
          case "${DOCKERHUB_REPO}" in
            */*) : ;;
            *) echo "ERROR: DOCKERHUB_REPO must look like username/repo."; exit 1 ;;
          esac
        """
      }
    }

    stage("Build Docker image") {
      steps {
        sh """
          docker version
          docker build -t ${DOCKERHUB_REPO}:latest -t ${DOCKERHUB_REPO}:${BUILD_NUMBER} .
        """
      }
    }

    stage("Push image to Docker Hub") {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: "${env.DOCKERHUB_CREDENTIALS_ID}",
            usernameVariable: "DOCKERHUB_USERNAME",
            passwordVariable: "DOCKERHUB_PASSWORD"
          )
        ]) {
          sh """
            set -e
            mkdir -p .docker
            export DOCKER_CONFIG="$WORKSPACE/.docker"

            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
            docker push ${DOCKERHUB_REPO}:latest
            docker push ${DOCKERHUB_REPO}:${BUILD_NUMBER}
            docker logout

            rm -rf "$DOCKER_CONFIG"
          """
        }
      }
    }

    stage("Run container") {
      steps {
        sh """
          docker rm -f ${CONTAINER_NAME} || true
          docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:${APP_PORT} ${DOCKERHUB_REPO}:latest
          docker ps --filter "name=${CONTAINER_NAME}"
        """
      }
    }
  }
}
