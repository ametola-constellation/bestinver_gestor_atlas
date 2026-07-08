// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR

def start(pathVersion , def pathConf="", String branch="") {
	log.info "FASE PRE: ${pathVersion} , ${pathConf}"
	
	sh """
		ls -al ${WORKSPACE}
		ls -al ${pathConf}
		ls -al ${pathVersion}
	"""
	def status = 0

	String branch_name = "${env.BRANCH_NAME}"
	log.info("Branch name: ${branch_name}")

	Date date = new Date()
	String datePart = date.format("yyyyMMdd-HHmmss")

	def shared = load "${WORKSPACE}/pipes/shared.groovy"
	def mapApplications = shared.addApplicationsDev()


	if (branch_name == "release") {
		def credentialId = "bes_WebPrivada_bstdevops"
		def hostname = "NEU-PRE-WEB01"
		def auth = "Basic"	
		def useSSLCet = "False"

		def appNamePool = ""
		def dest   = ""
		def backupDir = ""
		def excludeFilesDest = ""
		def excludeFilesBackup = "" 
		def agentdirectory = ""
		def pathConfig= ""
		def pathAppsettings= ""

		def mapDeployments = load "${WORKSPACE}/pipes/deployments.groovy"
		def deployments = mapDeployments.selectElementsToDeploy()

		for (app in mapApplications){
			if (deployments[app.name] == false){
				println("${app.name} will not be deployed")
				continue
			}
			else{
				println("Deploying ${app.name}")
				if (app.name == "bestinver_id" || app.name == "bestinver_microservices"){
					withCredentials([file(credentialsId: app.webConfigCredentialsId_uat, variable: app.webConfigVariableName_uat),
									file(credentialsId: app.appSettingsCredentialsId_uat, variable: app.appSettingsVariableName_uat),
									file(credentialsId: app.certificateCredentialsId_uat, variable: app.certificateVariableName_uat),
									file(credentialsId: app.secretCredentialsId_uat, variable: app.secretVariableName_uat)]){
						sh """
							echo "Iterating over applications"
						"""
						zipper.unzipper("${pathVersion}/${app.projectFolderName}.zip", "${pathVersion}/${app.projectFolderName}")
						//unzip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}"
						sh """
							ls -l ${pathVersion}/${app.projectFolderName}
							rm  ${pathVersion}/${app.projectFolderName}/appsettings*		        
							rm  ${pathVersion}/${app.projectFolderName}/Certificates/*.pem		        
							ls -l ${pathVersion}/${app.projectFolderName}
							echo "Copying configs"
							cp \$${app.webConfigVariableName_uat} ${pathVersion}/${app.projectFolderName}/web.config
							cp \$${app.appSettingsVariableName_uat} ${pathVersion}/${app.projectFolderName}/appsettings.json
							echo "Copying Certificates"
							cp \$${app.certificateVariableName_uat} ${pathVersion}/${app.projectFolderName}/Certificates/certificate.pem
							cp \$${app.secretVariableName_uat} ${pathVersion}/${app.projectFolderName}/Certificates/secret.pem
							ls -l ${pathVersion}/${app.projectFolderName}
							rm ${pathVersion}/${app.projectFolderName}.zip
						"""
						zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
					}
				}
				else{
					withCredentials([file(credentialsId: app.webConfigCredentialsId_uat, variable: app.webConfigVariableName_uat),
								file(credentialsId: app.appSettingsCredentialsId_uat, variable: app.appSettingsVariableName_uat)]){
						sh """
							echo "Iterating over applications"
						"""
						zipper.unzipper("${pathVersion}/${app.projectFolderName}.zip", "${pathVersion}/${app.projectFolderName}")
						//unzip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}"
						sh """
							ls -l ${pathVersion}/${app.projectFolderName}
							rm  ${pathVersion}/${app.projectFolderName}/appsettings*		        
							ls -l ${pathVersion}/${app.projectFolderName}
							cp \$${app.webConfigVariableName_uat} ${pathVersion}/${app.projectFolderName}/web.config
							cp \$${app.appSettingsVariableName_uat} ${pathVersion}/${app.projectFolderName}/appsettings.json
							ls -l ${pathVersion}/${app.projectFolderName}
							rm ${pathVersion}/${app.projectFolderName}.zip
						"""
						zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
					}
				}	
				try{
					appNamePool = app.uat_pool
					dest = "C:/BestinverWebApis/${app.uat_folder}/"
					uatBackupFolder = "UAT_DEPLOY_${datePart}"
					backupDir = "C:/Despliegues/Backups/${uatBackupFolder}"
					zipname = "${app.projectFolderName}.zip"
					
					sh """
						echo "pathVersion: ${pathVersion}"
					"""
				
					log.info("Inicio de Proceso")
					log.info("App pool: ${appNamePool}")
					log.info("Carpeta de destino: ${dest}")
					log.info("Carpeta de backup: ${uatBackupFolder}")
					log.info("Ruta de backup: ${backupDir}")
					
					log.info("Se para el app pool ${appNamePool}")
					status = winrmCommands.appPoolStopped(credentialId,hostname,auth,useSSLCet,appNamePool)
					log.info("Validamos que la carpeta de backup existe, y si no, la creamos ${backupDir}/${app.uat_backupFolder}")
					status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${backupDir}/${app.uat_backupFolder}")
					log.info("Movemos (copiamos) la carpeta actual ${dest} a la recien creada de backup ${backupDir}/${app.uat_backupFolder}")
					status = winrmCommands.backupFiles(credentialId,hostname,auth,useSSLCet,dest,"${backupDir}/${app.uat_backupFolder}")
					log.info("Se borra el contenido de la carpeta ${dest}")
					status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}")
					log.info("Validamos que la carpeta de destino ${dest} existe, y si no, la creamos")
					status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}")
					log.info("Movemos el zip de la aplicacion ${pathVersion}/${app.projectFolderName}.zip a la carpeta destino dentro de la maquina")
					status = winrmCommands.artifactDownloadSpecific(credentialId,hostname,auth,useSSLCet,"${pathVersion}/${app.projectFolderName}.zip","${dest}")
					log.info("Descomprimimos el zip ${dest}/${zipname} en ${dest}")
					status = winrmCommands.unzipFiles(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}","${dest}")
					log.info("Eliminamos el zip una vez se han extraido los ficheros")
					status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}")
					log.info("Movemos el contenido de la carpeta ${dest}/${app.projectFolderName} a ${dest}")
					status = winrmCommands.moveFileSpecificInMachine(credentialId,hostname,auth,useSSLCet,"${dest}/${app.projectFolderName}/*",dest)
					log.info("Se crea la carpeta logs dentro de la carpeta de la aplicacion")
					status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}logs")
					log.info("Arrancamos el app pool ${appNamePool}")
					status = winrmCommands.appPoolStarted(credentialId,hostname,auth,useSSLCet,appNamePool)
					log.info("Fin de Proceso")
				}			
				catch(e){
					log.info "ERROR in Application: ${app.name}"
					status = 1
				}
			}
		}

		date = new Date()
		log.info "Sleeping for 15 minutes until applications are fully deployed. Current date: ${date} (GMT+0)"
		sleep(time:15,unit:"MINUTES")

		log.info "FASE PRE Calidad: ${pathVersion} , ${pathConf}"

		sh "ls -al ${pathVersion}; ls -al  ${pathConf}; pwd"

		def body = """
			{
				"TEST_PLAN_ID": "PRJ0031828-41",
				"QA_AUTOMATIC_TESTS_TAGS": "@regresion",
				"BROWSER_NAME":"chrome",
				"UPLOAD_RESULT_XRAY"="true"
				
			}
		"""

		def response = httpRequest authentication: 'TOKEN_OC_MASTER',
								url:'https://cloudbees.acciona.com/azure-master/job/Bestinver/job/bes_WebPrivada/job/bes_WebPrivada__QA_LiveAppTests/job/develop/buildWithParameters',
								httpMode:'POST',
								requestBody: body
									
		println("Status: "+response.status)

		log.info "Calling job: https://cloudbees.acciona.com/azure-master/job/Bestinver/job/bes_WebPrivada/job/bes_WebPrivada__QA_LiveAppTests/job/develop"
	} 
	else{ // branch == hotfix
		log.info("In branch ${branch_name}. Executing ${WORKSPACE}/pipes/STA/start.groovy")
		def deployInPreEnv = load "${WORKSPACE}/pipes/STA/start.groovy"
		deployInPreEnv.start(pathVersion, pathConf, branch_name)		
	}

	

	return status
}

return this;