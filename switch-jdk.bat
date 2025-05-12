@echo off
echo Current Java version:
java -version

if "%1"=="17" (
  echo Switching to JDK 17...
  set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.15+6
  set PATH=C:\Program Files\Eclipse Adoptium\jdk-17.0.15+6\bin;%PATH%
) else if "%1"=="21" (
  echo Switching to JDK 21...
  set JAVA_HOME=C:\Program Files\Java\jdk-21
  set PATH=C:\Program Files\Java\jdk-21\bin;%PATH%
) else (
  echo Usage: switch-jdk.bat [17^|21]
  echo   17: Switch to JDK 17 (for React Native)
  echo   21: Switch to JDK 21 (system default)
  exit /b 1
)

echo New Java version:
java -version