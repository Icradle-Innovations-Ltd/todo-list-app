#!/bin/bash
echo "Setting up React Native development environment..."

# Try to find JDK 17 installation
JDK17_PATH=""
POSSIBLE_PATHS=(
  "/c/Program Files/Eclipse Adoptium/jdk-17.0.12+7"
  "/c/Program Files/Eclipse Adoptium/jdk-17.0.12_7"
  "/c/Program Files/Eclipse Adoptium/jdk-17"
  "/c/Program Files/Java/jdk-17"
)

for path in "${POSSIBLE_PATHS[@]}"; do
  if [ -d "$path" ]; then
    JDK17_PATH="$path"
    break
  fi
done

# If JDK17 not found in common locations, try to find it
if [ -z "$JDK17_PATH" ]; then
  echo "Searching for JDK 17 installation..."
  # Try to find any JDK 17 installation
  JAVA_PATH=$(which java)
  if [ -n "$JAVA_PATH" ]; then
    echo "Found Java at: $JAVA_PATH"
    JAVA_VERSION=$(java -version 2>&1 | grep -i version | cut -d'"' -f2)
    echo "Java version: $JAVA_VERSION"
    
    if [[ "$JAVA_VERSION" == 17* ]]; then
      # If Java 17 is already the default, use it
      JDK17_PATH=$(dirname $(dirname $(readlink -f $(which java))))
      echo "Using JDK 17 at: $JDK17_PATH"
    fi
  fi
fi

# If still not found, ask user
if [ -z "$JDK17_PATH" ]; then
  echo "JDK 17 not found in common locations."
  echo "Please enter the full path to your JDK 17 installation (e.g., /c/Program Files/Eclipse Adoptium/jdk-17.0.12+7):"
  read -r JDK17_PATH
  
  if [ ! -d "$JDK17_PATH" ]; then
    echo "Invalid path: $JDK17_PATH"
    echo "Please make sure JDK 17 is installed and try again."
    exit 1
  fi
fi

# Switch to JDK 17
export JAVA_HOME="$JDK17_PATH"
export PATH="$JAVA_HOME/bin:$PATH"

# Set Android SDK environment variables
export ANDROID_HOME="/c/Users/amonm/AppData/Local/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/platform-tools"

echo "Environment variables set:"
echo "JAVA_HOME=$JAVA_HOME"
echo "ANDROID_HOME=$ANDROID_HOME"

echo "Current Java version:"
java -version

echo "You can now run React Native commands."