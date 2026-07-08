def start() {
   log.info "Starting Sonar scan"

   scannerHome = tool 'SCANNER3'
   withSonarQubeEnv('SONAR_ACCIONA') {
      sh "mvn clean compile -DskipTests=true"
      sh "${scannerHome}/bin/sonar-scanner -Dsonar.language=grvy -Dsonar.sources=src,vars -Dsonar.projectKey=ofc_fw2__jobs -Dsonar.projectVersion=${VERSION}"
   }

   return 0;
}

return this;
