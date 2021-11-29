pipeline {
  environment {
    repository = "https://github.com/achyar10/esurvey-service.git"
    imagename = "esurvey-service:latest"
    githubId = "github"
    dockerImage = ''
  }
  agent any
  stages {
    stage('Cloning Repository') {
      steps {
        git([url: repository, branch: 'master', credentialsId: githubId])
      }
    }
    stage('Building Images') {
      steps{
        script {
          dockerImage = docker.build imagename
        }
      }
    }
    stage('Running Images') {
      steps{
        sh "docker-compose -f docker-compose.yml down"
         sh "docker-compose -f docker-compose.yml up -d"
      }
    }
    stage('Remove Unused Images') {
      steps{
        sh "docker image prune -f"
      }
    }
  }
}