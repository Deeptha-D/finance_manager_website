pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cloning repository"
                git branch: 'main', url: 'https://github.com/Deeptha-D/finance_manager_website.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo "Installing backend dependencies"
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo "Installing frontend dependencies"
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo "Building React frontend"
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Run Backend Server') {
            steps {
                echo "Starting backend server"
                dir('backend') {
                    bat 'npm start'
                }
            }
        }

    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
