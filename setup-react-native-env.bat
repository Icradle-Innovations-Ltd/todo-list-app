@echo off
echo Setting up React Native development environment...

REM Switch to JDK 17
call switch-jdk.bat 17

REM Set Android SDK environment variables
set ANDROID_HOME=C:\Users\amonm\AppData\Local\Android\Sdk
set PATH=%PATH%;%ANDROID_HOME%\platform-tools

echo Environment variables set:
echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%

echo You can now run React Native commands.