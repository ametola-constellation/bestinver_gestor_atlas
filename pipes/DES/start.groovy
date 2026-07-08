// Funcion de arranque del proceso de despliegue de desarrollo
// devuelve 0 si OK  y <>0 si ERROR

def start(pathVersion , def pathConf="") {
	
	try
	{
		println "FASE DES"	
		
		String sp_credential = "SPN-Bestinver-Cloud"
		String resourceGroup ="DEV-ACC-AZR-BTIR-MWAB-RGP-01"
		String [] containerApps = "dev-bestinver-onboarding dev-bestinver-remediation dev-bestinver-middleoffice dev-bestinver-webservice".split()
		String [] images = "bestinver.gestoraltas.onboarding bestinver.gestoraltas.remediation bestinver.gestoraltas.middleoffice bestinver.gestoraltas.ws".split()
		String [] appconfigLabel = "GestorAltas-DEV Remediacion-DEV MiddleOffice-DEV Wordpress-DEV".split()
		String registry = "articloudpro-bestinver-docker-deploy.jfrog.io/bes_webprivadacloud"

		println "Nos conectamos a Azure"
		azure.login(sp_credential)

		containerApps.eachWithIndex { containerApp, index ->
			String image = images[index]
			String appconfig = appconfigLabel[index]
			println "Desplegamos la aplicacion en el container ${containerApp}"
			azure.containerAppSettings("${containerApp}",resourceGroup,"${registry}/${image}:${VERSION}","ASPNETCORE_ENVIRONMENT=DEV APP_CONFIG_LABELS=${appconfig} USER_IDENTITY_ID=7b5eb2ce-22ac-4706-bc19-74c50c47eb94 AzureMonitor__Enabled=true")
		}
	}
	catch(Exception e) 
	{
	   echo "Error " + e.toString()
	   throw e
	}
	return 0; 
}

return this;