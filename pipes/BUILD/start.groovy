def start() {
	log.info "COMPILE"
	log.info "MavenBuild"
	
	log.info "COMPILE"
	
	log.info "MavenBuild"
	log.info "PATH -> ${env.PATH}"
	
	//artifactory.mavenBuildDepoy("division-maven", "division-release",  "pom.xml", "install")
	
	String dir = "${WORKSPACE}" //"${WORKSPACE}/target/"
	String prj = "${PRJ}"
	String version = "${VERSION}"
	zipper.packing( dir , prj , version )
	
	return 0; // devolveremos como error la fase de compilacion para que no continue el pipe
}

return this;
