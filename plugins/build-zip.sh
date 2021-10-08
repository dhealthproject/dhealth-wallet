#! /bin/bash

PACKAGE="yourdlt-wallet"
VERSION="1.1.0"
DESTINATION="release"

# Prepares build
buildArtifact="${PACKAGE}_${VERSION}.zip"
buildArtifactPath="${DESTINATION}/${PACKAGE}_${VERSION}.zip"

if [[ -e "${buildArtifactPath}" ]]; then
	echo "Build for software ${buildArtifact} already executed."
else
	# Installs dependencies
	npm install

	# Build software
	npm run build

	# Bundle release
	export npm_package_name="${PACKAGE}"
	export npm_package_version="${VERSION}"
	./node_modules/npm-build-zip/bin/npm-build-zip.js --source="dist" --destination="release"
fi
