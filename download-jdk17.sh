#!/bin/bash
echo "Downloading Eclipse Temurin JDK 17..."

# Create downloads directory if it doesn't exist
mkdir -p ~/Downloads/jdk17

# Download JDK 17 MSI installer
curl -L "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.12%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.12_7.msi" -o ~/Downloads/jdk17/OpenJDK17U-jdk_x64_windows_hotspot_17.0.12_7.msi

echo "Download complete. JDK 17 installer saved to: ~/Downloads/jdk17/OpenJDK17U-jdk_x64_windows_hotspot_17.0.12_7.msi"
echo "Please run the installer manually and follow the installation steps."
echo "Make sure to check 'Set JAVA_HOME variable' during installation."