// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR

def start(pathVersion , def pathConf="", String branch="") {
	log.info "FASE INT: ${pathVersion} , ${pathConf}"

	sh """
		ls -al ${WORKSPACE}
		ls -al ${pathConf}
		ls -al ${pathVersion}
	"""
	def status = 0

	String branch_name = "${env.BRANCH_NAME}"
	log.info("Branch name: ${branch_name}")

	def mapDeployments = load "${WORKSPACE}/pipes/deployments.groovy"
	def deployments = mapDeployments.selectElementsToDeploy()

	Date date = new Date()
	String datePart = date.format("yyyyMMdd-HHmmss")
	
	def shared = load "${WORKSPACE}/pipes/shared.groovy"
	def mapApplications = shared.addApplicationsDev()

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

	def credentials = []

	for (app in mapApplications){
		if (deployments[app.name] == false){
			println("${app.name} will not be deployed")
			continue
		}
		else {
			println("Deploying ${app.name}")
			if (app.name == "bestinver_id" || app.name == "bestinver_microservices"){
				withCredentials([file(credentialsId: app.webConfigCredentialsId_int, variable: app.webConfigVariableName_int),
								file(credentialsId: app.appSettingsCredentialsId_int, variable: app.appSettingsVariableName_int),
								file(credentialsId: app.certificateCredentialsId_int, variable: app.certificateVariableName_int),
								file(credentialsId: app.secretCredentialsId_int, variable: app.secretVariableName_int)]){
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
						cp \$${app.webConfigVariableName_int} ${pathVersion}/${app.projectFolderName}/web.config
						cp \$${app.appSettingsVariableName_int} ${pathVersion}/${app.projectFolderName}/appsettings.json
						echo "Copying Certificates"
						cp \$${app.certificateVariableName_int} ${pathVersion}/${app.projectFolderName}/Certificates/certificate.pem
						cp \$${app.secretVariableName_int} ${pathVersion}/${app.projectFolderName}/Certificates/secret.pem
						ls -l ${pathVersion}/${app.projectFolderName}
						rm ${pathVersion}/${app.projectFolderName}.zip
					"""
					zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
				}
			}
			else{
				withCredentials([file(credentialsId: app.webConfigCredentialsId_int, variable: app.webConfigVariableName_int),
							file(credentialsId: app.appSettingsCredentialsId_int, variable: app.appSettingsVariableName_int)]){
					sh """
						echo "Iterating over applications"
					"""
					zipper.unzipper("${pathVersion}/${app.projectFolderName}.zip", "${pathVersion}/${app.projectFolderName}")
					//unzip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}"
					sh """
						ls -l ${pathVersion}/${app.projectFolderName}
						rm  ${pathVersion}/${app.projectFolderName}/appsettings*		        
						ls -l ${pathVersion}/${app.projectFolderName}
						cp \$${app.webConfigVariableName_int} ${pathVersion}/${app.projectFolderName}/web.config
						cp \$${app.appSettingsVariableName_int} ${pathVersion}/${app.projectFolderName}/appsettings.json
						ls -l ${pathVersion}/${app.projectFolderName}
						rm ${pathVersion}/${app.projectFolderName}.zip
					"""
					zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
				}
			}				
			try{
				appNamePool = app.int_pool
				dest = "C:/BestinverIntegracion/${app.folder}/"
				intBackupFolder = "INT_DEPLOY_${datePart}"
				backupDir = "C:/Despliegues/Backups/${intBackupFolder}"
				zipname = "${app.projectFolderName}.zip"
				
				sh """
					echo "pathVersion: ${pathVersion}"
				"""
			
				log.info("Inicio de Proceso")
				log.info("Se para el app pool ${appNamePool}")
				status = winrmCommands.appPoolStopped(credentialId,hostname,auth,useSSLCet,appNamePool)
				log.info("Validamos que la carpeta de backup existe, y si no, la creamos ${backupDir}/${app.backupFolder}")
				status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${backupDir}/${app.backupFolder}")
				log.info("Movemos (copiamos) la carpeta actual ${dest} a la recien creada de backup ${backupDir}")
				// stauts = winrmCommands.moveFileSpecificInMachine(credentialId,hostname,auth,useSSLCet,dest,"${backupDir}/${app.backupFolder}")
				status = winrmCommands.backupFiles(credentialId,hostname,auth,useSSLCet,dest,"${backupDir}/${app.backupFolder}")
				log.info("Se borra el contenido de la carpeta ${dest}")
				status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}")
				log.info("Validamos que la carpeta de destino ${dest} existe, y si no, la creamos")
				status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}")
				log.info("Movemos el zip de la aplicacion ${app.name} a la carpeta destino dentro de la maquina")
				status = winrmCommands.artifactDownloadSpecific(credentialId,hostname,auth,useSSLCet,"${pathVersion}/${app.projectFolderName}.zip","${dest}")
				log.info("Descomprimimos el zip")
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

	return status
}

return this;