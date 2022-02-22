pipeline  {
    agent any

    parameters {
        booleanParam(name: 'API_ONLY',
            defaultValue: false,
            description: 'Enable if you would like to promote only apis.'
        )
    }

    environment {
        ANYPOINT_PLATFORM_CREDS = credentials('anypoint.platform.account')
    }
    
    tools {
        nodejs 'NodeJs 17.5.0'
    }


    stages {
        
         
    
    
    	stage('Promote APIs and Applications') {
        
            steps { 
                git branch: 'master', credentialsId: 'GITToken', url: 'https://github.com/paulinacajiao/promote-api-example.git'
                sh 'node src/app.js' 
            }
        }

        stage('Promote API only') {
            when {
                expression {
                    return params.API_ONLY == true
                }
            }
            steps { 
                sh 'node src/app.js api-only' 
            }
        }
    	
    }

    post {
        
        success {
            echo "All Good: ${env.RELEASE_VERSION}: ${currentBuild.currentResult}"    
        }
        failure {
            echo "Not So Good: ${env.RELEASE_VERSION}: ${currentBuild.currentResult}"
        }         
        always {
            echo "Pipeline result: ${currentBuild.result}"
            echo "Pipeline currentResult: ${currentBuild.currentResult}"
            cleanWs()
        }
    }  
}
