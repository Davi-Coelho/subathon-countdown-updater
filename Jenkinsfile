pipeline {
    agent {
        label 'ridley'
    }

    stages {
        stage("Cleaning workspace") {
            steps {
                cleanWs()
                checkout scm
                echo 'Building $JOB_NAME...'
            }
        }
        stage("Cloning git") {
            steps {
                dir("${JOB_NAME}") {
                    git branch: "main", url: '$PROJECT_GIT'
                    sh "sed -i 's/=PORT/=${PROJECT_PORT}/' Dockerfile"
                }
                sh 'mv $JOB_NAME/docker-compose.yml docker-compose.yml'
                sh "sed -i 's/docker_user/${DOCKER_USER}/' docker-compose.yml"
                sh "sed -i 's/PROJECT_NAME\\|project_name/${JOB_NAME}/g' docker-compose.yml"
                sh "sed -i 's/PROJECT_PORT/${PROJECT_PORT}/' docker-compose.yml"
                sh "sed -i 's/DOMAIN/${DOMAIN}/' docker-compose.yml"
            }
        }

        stage("Stopping containers") {
            steps {
                sh "docker compose down"
            }
        }

        stage("Cleaning old images") {
            steps {
                script {
                    try {
                        sh 'docker rmi $DOCKER_USER/$JOB_NAME:latest'
                        sh 'docker volume rm $JOB_NAME_node_modules'
                    } catch(Exception e) {
                        print("Error: " + e)
                    }
                }
                echo currentBuild.result
            }
        }
        stage("Running containers") {
            steps {
                sh "docker compose up -d --build"
            }
        }
    }
}
