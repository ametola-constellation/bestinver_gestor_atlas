// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR

def start(pathVersion , def pathConf="", String branch="") {
	log.info "FASE STA: ${pathVersion} , ${pathConf}"
	log.info "--- Despliegue en PREPRODUCCION ---"
	
	sh """
		ls -al ${WORKSPACE}
		ls -al ${pathConf}
		ls -al ${pathVersion}
	"""
	def status = 0

	String branch_name = "${env.BRANCH_NAME}"
	log.info("Branch name: ${branch_name}")

	def evaluateRollback = null
	if (branch_name == "release") {
		evaluateRollback = true
	} else { 
		evaluateRollback = false
	}
	log.info("evaluateRollback: ${evaluateRollback}")

	Date date = new Date()
	String datePart = date.format("yyyyMMdd-HHmmss")

	def shared = load "${WORKSPACE}/pipes/shared.groovy"
	def mapApplications = shared.addApplicationsDev()

	def mapDeployments = load "${WORKSPACE}/pipes/deployments.groovy"
	def deployments = mapDeployments.selectElementsToDeploy()

	def credentialId = "bes_WebPrivada_bstdevops"
	def hostname = "SVBINTWEB01"
	def auth = "Basic"	
	def useSSLCet = "True"

	def appNamePool = ""
	def dest   = ""
	def backupDir = ""
	def excludeFilesDest = ""
	def excludeFilesBackup = "" 
	def agentdirectory = ""
	def pathConfig= ""
	def pathAppsettings= ""

	for (app in mapApplications){
		if (deployments[app.name] == false){
			println("${app.name} will not be deployed")
			continue
		}
		else{
			println("Deploying ${app.name}")
			if (app.name == "bestinver_id" || app.name == "bestinver_microservices"){
				withCredentials([file(credentialsId: app.webConfigCredentialsId_pre, variable: app.webConfigVariableName_pre),
								file(credentialsId: app.appSettingsCredentialsId_pre, variable: app.appSettingsVariableName_pre),
								file(credentialsId: app.certificateCredentialsId_pre, variable: app.certificateVariableName_pre),
								file(credentialsId: app.secretCredentialsId_pre, variable: app.secretVariableName_pre)]){
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
						cp \$${app.webConfigVariableName_pre} ${pathVersion}/${app.projectFolderName}/web.config
						cp \$${app.appSettingsVariableName_pre} ${pathVersion}/${app.projectFolderName}/appsettings.json
						echo "Copying Certificates"
						cp \$${app.certificateVariableName_pre} ${pathVersion}/${app.projectFolderName}/Certificates/certificate.pem
						cp \$${app.secretVariableName_pre} ${pathVersion}/${app.projectFolderName}/Certificates/secret.pem
						ls -l ${pathVersion}/${app.projectFolderName}
						rm ${pathVersion}/${app.projectFolderName}.zip
					"""
					zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
				}
			}
			else{
				withCredentials([file(credentialsId: app.webConfigCredentialsId_pre, variable: app.webConfigVariableName_pre),
							file(credentialsId: app.appSettingsCredentialsId_pre, variable: app.appSettingsVariableName_pre)]){
					sh """
						echo "Iterating over applications"
					"""
					zipper.unzipper("${pathVersion}/${app.projectFolderName}.zip", "${pathVersion}/${app.projectFolderName}")
					//unzip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}"
					sh """
						ls -l ${pathVersion}/${app.projectFolderName}
						rm  ${pathVersion}/${app.projectFolderName}/appsettings*		        
						ls -l ${pathVersion}/${app.projectFolderName}
						cp \$${app.webConfigVariableName_pre} ${pathVersion}/${app.projectFolderName}/web.config
						cp \$${app.appSettingsVariableName_pre} ${pathVersion}/${app.projectFolderName}/appsettings.json
						ls -l ${pathVersion}/${app.projectFolderName}
						rm ${pathVersion}/${app.projectFolderName}.zip
					"""
					zip zipFile: "${pathVersion}/${app.projectFolderName}.zip", dir: "${pathVersion}/${app.projectFolderName}"
				}
			}	

		}
		try{
			appNamePool = app.pre_pool
			// dest = "C:/BestinverWebApis/${app.pre_folder}/"
			dest = "C:/inetpub/${app.pre_folder}/"
			preBackupFolder = "PRE_DEPLOY_${datePart}"
			// backupDir = "${app.pre_backupFolder}_${datePart}"
			backupDir = "${app.pre_backupFolder}/${preBackupFolder}"
			zipname = "${app.projectFolderName}.zip"
			
			sh """
				echo "pathVersion: ${pathVersion}"
			"""

			log.info("Inicio de Proceso")
			log.info("App pool: ${appNamePool}")
			log.info("Carpeta de destino: ${dest}")
			log.info("Carpeta de backup: ${preBackupFolder}") 
			log.info("Ruta de backup: ${backupDir}")	

			// log.info("Testing connection ${appNamePool}")
			// status = winrmCommands.unzipFiles(credentialId,hostname,auth,useSSLCet,"","")

			log.info("Se para el app pool ${appNamePool}")
			status = winrmCommands.appPoolStopped(credentialId,hostname,auth,useSSLCet,appNamePool)
			log.info("Validamos que la carpeta de backup existe, y si no, la creamos ${backupDir}/${app.backupFolder}")
			status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${backupDir}/${app.backupFolder}")
			log.info("Movemos (copiamos) la carpeta actual ${dest} a la recién creada de backup ${backupDir}/${app.backupFolder}")
			status = winrmCommands.backupFiles(credentialId,hostname,auth,useSSLCet,dest,"${backupDir}/${app.backupFolder}")
			log.info("Se borra el contenido de la carpeta ${dest}")
			status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}")
			log.info("Validamos que la carpeta de destino ${dest} existe, y si no, la creamos")
			status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}")
			log.info("Movemos el zip de la aplicación ${app.name} a la carpeta destino dentro de la máquina")
			status = winrmCommands.artifactDownloadSpecific(credentialId,hostname,auth,useSSLCet,"${pathVersion}/${app.projectFolderName}.zip","${dest}")
			log.info("Descomprimimos el zip")
			status = winrmCommands.unzipFiles(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}","${dest}")
			
			// log.info("Eliminamos el zip una vez se han extraído los ficheros")
			// status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}")
			
			log.info("Movemos el contenido de la carpeta ${dest}${app.projectFolderName} a ${dest}")
			status = winrmCommands.moveFileSpecificInMachine(credentialId,hostname,auth,useSSLCet,"${dest}${app.projectFolderName}/*",dest)
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
	if (evaluateRollback){		
		try{
			timeout(time: 2, unit: 'HOURS') {
				input message: 'Do you want to proceed with the deployment?'
				// input message: 'Do you want to swap the slots?',
				parameters: [[$class: 'BooleanParameterDefinition',
					defaultValue: true,
					description: 'Ticking this box will continue with the deployment',
					name: 'swap']]
			}
		}
		catch(e){
			log.info("Se ha cancelado el despliegue. Ejecutando rollback")
			for (app in mapApplications){
				if(app.name == "bestinver_observatorioapi" )
				{
					continue
				}

				appNamePool = app.pre_pool
				dest = "C:/inetpub/${app.pre_folder}/"
				zipname = "${app.projectFolderName}.zip"

				def dateArray = datePart.split("-")
				def date_only = dateArray[0] 
				log.info("Date: ${date_only}")
				String backupBuildID = "${env.BUILD_ID}"
				log.info("Current build: ${backupBuildID}")		
				sh """
					echo "pathVersion: ${pathVersion}"
				"""

				log.info("Inicio de Proceso")
				log.info("App pool: ${appNamePool}")
				log.info("Carpeta de destino: ${dest}")
				log.info("Carpeta de backup: ${preBackupFolder}") 
				log.info("Ruta de backup: ${backupDir}")	

				log.info("Se para el app pool ${appNamePool}")
				status = winrmCommands.appPoolStopped(credentialId,hostname,auth,useSSLCet,appNamePool)

				log.info("Se borra el contenido de la carpeta ${dest}")
				status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}")
				log.info("Validamos que la carpeta de destino ${dest} existe, y si no, la creamos")
				status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}")
				log.info("Movemos el contenido de la carpeta de backup ${backupDir}/${app.backupFolder}/${date_only} a ${dest}")
				status = winrmCommands.moveFileSpecificInMachine(credentialId,hostname,auth,useSSLCet,"${backupDir}/${app.backupFolder}/${date_only}",dest)
				log.info("Descomprimimos el zip ${dest}Backup-${backupBuildID}.zip")
				status = winrmCommands.unzipFiles(credentialId,hostname,auth,useSSLCet,"${dest}Backup-${backupBuildID}.zip","${dest}")
				log.info("Eliminamos el zip de backup, ${dest}Backup-${backupBuildID}.zip, una vez se han extraído los ficheros")
				status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}Backup-${backupBuildID}.zip")
				log.info("Se crea la carpeta logs dentro de la carpeta de la aplicacion")
				status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${dest}logs")
				log.info("Arrancamos el app pool ${appNamePool}")
				status = winrmCommands.appPoolStarted(credentialId,hostname,auth,useSSLCet,appNamePool)
				log.info("Fin de Proceso")

			}	
			log.info("Se ha ejecutado el rollback")

			return status
		} 
	}
	log.info("Se ha aceptado el continuar con el despliegue")

	return status
}

return this;