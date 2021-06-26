#! /bin/bash

PACKAGE="yourdlt-wallet"
VERSION="1.1.0"

# Prepares build
echo $1 > plugins/plugins.json
export buildJobHash=`sha512sum plugins/plugins.json | cut -d " " -f 1`
echo ${buildJobHash} > plugins/recipe.sha512

artifactPath="/var/www/vhosts/dapps.dhealth.cloud/artifacts"
buildJobPlatform=$2
pluginsArchiveFile="${buildJobHash}.plugins.zip"

buildArtifact="${PACKAGE}_${VERSION}.zip"
artifactFile="${buildJobHash}.zip"

buildArtifactPath="${artifactPath}/${artifactFile}"
pluginArchivePath="${artifactPath}/${pluginsArchiveFile}"
if [[ -e "${buildArtifactPath}" ]]; then
	echo "Build for recipe with hash ${buildJobHash} already executed."
else
	# Installs dependencies
	npm install
	DISPLAY=:44 xvfb-run --server-num 44 node_modules/electron/dist/electron public/plugins.js

	# Build software
	npm run build

	# Bundle release
	export npm_package_name="${PACKAGE}"
	export npm_package_version="${VERSION}"
	./node_modules/npm-build-zip/bin/npm-build-zip.js --source="dist" --destination="release"

	# Copies to WWW (dapps.dhealth.cloud/xxx)
	cp release/${buildArtifact} ${buildArtifactPath}
	zip ${pluginArchivePath} plugins/
fi
