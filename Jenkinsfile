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

        stage("Updating resource file") {
            steps {
                withFileParameter(name:'UPDATE_RES', allowNoFile: true) {
                    sh 'cp $UPDATE_RES update_res.neu'
                    script {
                        FILE_SIZE = sh (
                            script: 'wc -c update_res.neu | awk \'{print $1}\'',
                            returnStdout: true
                        ).trim()
                        if (FILE_SIZE != '0') {
                            withCredentials([usernamePassword(credentialsId: 'git', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                                dir("update_file") {
                                    git branch: "main", url: '$PROJECT_GIT'
                                    sh 'mv ../update_res.neu ./app/public/update_res.neu'
                                    CURRENT_VERSION = sh (
                                        script: 'sed -n \'3p\' ./app/public/update_manifest.json',
                                        returnStdout: true
                                    ).trim()
                                    sh "sed -i 's/${CURRENT_VERSION}/\"version\": \"${NEW_VERSION}\",/' ./app/public/update_manifest.json"
                                    sh "git add ."
                                    sh "git commit -m 'att: ${NEW_VERSION} nova versão do subathon;'"
                                    sh 'git push https://$GIT_USERNAME:$GIT_PASSWORD@github.com/Davi-Coelho/subathon-countdown-updater'
                                }
                            }
                            sh 'rm -rf update_file/'
                            sh 'rm -rf update_file@tmp/'
                        } else {
                            sh 'rm update_res.neu'
                            echo 'Sem nova versão!'
                        }
                    }
                }
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
                        sh "docker volume rm ${JOB_NAME}_node_modules"
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
