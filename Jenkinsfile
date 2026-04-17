pipeline {
    agent any

    stages {
        

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Deeptha-D/finance_manager_website.git'
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

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

    }
}
