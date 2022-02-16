pipeline {
    agent any
    stages {
        stage('Download dependencies') {
            steps {
                sh 'npm install'
                sh 'cp public/plugins/plugins.empty.js public/plugins/plugins.js'
            }
        }

        stage('Run linter checks') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build software') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Run unit tests') {
            steps {
                sh 'npm run test'
            }
        }
    }
}
