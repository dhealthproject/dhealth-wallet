pipeline {
    agent any
    stages {
        stage('Download dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run linter checks') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build software') {
            steps {
                sh 'npm run build:web'
            }
        }

        stage('Run unit tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}
