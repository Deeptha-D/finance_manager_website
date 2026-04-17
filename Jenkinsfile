pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/Deeptha-D/finance_manager_website.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Start Backend Server') {
            steps {
                dir('backend') {
                    sh 'npm start'
                }
            }
        }
    }
}https://github.com/Deeptha-D/finance_manager_website.git
