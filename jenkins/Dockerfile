FROM jenkins/jenkins:lts-jdk17

USER root

# Install Docker CLI so Jenkins pipelines can run `docker build` / `docker run`.
# Jenkins will use the host Docker Engine via the mounted Docker socket.
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io ca-certificates \
  && rm -rf /var/lib/apt/lists/*

USER jenkins

