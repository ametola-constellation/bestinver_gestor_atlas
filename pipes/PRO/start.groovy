// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR

def start(pathVersion , def pathConf="", String branch="") {
	log.info "FASE PRO: ${pathVersion} , ${pathConf}"
	
	sh """
		ls -al ${WORKSPACE}
		ls -al ${pathConf}
		ls -al ${pathVersion}
	"""
	def status = 0

	/* String branch_name = "${env.BRANCH_NAME}"
	log.info("Branch name: ${branch_name}")

	def mapDeployments = load "${WORKSPACE}/pipes/deployments.groovy"
	def deployments = mapDeployments.selectElementsToDeploy()

	Date date = new Date()
	String datePart = date.format("yyyyMMdd-HHmmss")
	
	def shared = load "${WORKSPACE}/pipes/shared.groovy"
	def mapApplications = shared.addApplicationsDev()

	def credentialId = "bes_WebPrivada_bstdevops"
	def hostname = "SVBINPWEB02"
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
	def runningAppsFolder = "" 

	for (app in mapApplications){
		if (deployments[app.name] == false){
			println("${app.name} will not be deployed")
			continue
		}
		else{
			println("Deploying ${app.name}")
			// CERTS PART

			
			try{
				
				dest = "C:/deploy/deploy_${datePart}/${app.pro_folder}"
				proBackupFolder = "PRO_DEPLOY_${datePart}"
				backupDir = "C:/backups/${proBackupFolder}"
				zipname = "${app.projectFolderName}.zip"
				runningAppsFolder = "C:/inetpub/${app.pro_folder}" // TODO: create struct in shared

				log.info("Inicio de Proceso")
				log.info("Carpeta de destino: ${dest}")
				log.info("Carpeta de backup: ${proBackupFolder}")
				log.info("Ruta de backup: ${backupDir}")
				log.info("Ruta donde corre el servicio: ${runningAppsFolder}")
				
				log.info("Validamos que la carpeta de backup existe, y si no, la creamos ${backupDir}/${app.pro_backupFolder}")
				status = winrmCommands.validateWebApp(credentialId,hostname,auth,useSSLCet,"${backupDir}/${app.pro_backupFolder}")
				// log.info("Movemos (copiamos) la carpeta actual ${runningAppsFolder} a la recien creada de backup ${backupDir}/${app.pro_backupFolder}")
				// status = winrmCommands.backupFiles(credentialId,hostname,auth,useSSLCet,runningAppsFolder,"${backupDir}/${app.uat_backupFolder}")
				log.info("Movemos el zip de la aplicacion ${pathVersion}/${app.projectFolderName}.zip a la carpeta destino dentro de la maquina")
				status = winrmCommands.artifactDownloadSpecific(credentialId,hostname,auth,useSSLCet,"${pathVersion}/${app.projectFolderName}.zip","${dest}")
				log.info("Descomprimimos el zip ${dest}/${zipname} en ${dest}")
				status = winrmCommands.unzipFiles(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}","${dest}")
				log.info("Eliminamos el zip una vez se han extraido los ficheros")
				status = winrmCommands.deleteDirectoryFile(credentialId,hostname,auth,useSSLCet,"${dest}/${zipname}")

				log.info("Fin de Proceso")

			}		
			catch(e){
				log.info "ERROR in Application: ${app.name}"
				status = 1
			}


		}
	
	
	
	} */

	return status
}

return this;