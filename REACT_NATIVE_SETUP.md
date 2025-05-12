# React Native Development Environment Setup

This guide will help you set up the correct environment for React Native development.

## Prerequisites

1. **JDK 17 (Required for React Native)**
   - Download and install Eclipse Temurin JDK 17 from [Adoptium](https://adoptium.net/temurin/releases/?version=17)
   - Choose the Windows x64 MSI installer
   - During installation, make sure to check "Set JAVA_HOME variable"

2. **Android SDK**
   - You already have Android SDK installed at `C:\Users\amonm\AppData\Local\Android\Sdk`

## Setting Up the Environment

1. **Use the provided scripts**
   - `switch-jdk.bat`: Switches between JDK versions
     - `switch-jdk.bat 17`: Switch to JDK 17 (for React Native)
     - `switch-jdk.bat 21`: Switch to JDK 21 (your system default)
   
   - `setup-react-native-env.bat`: Sets up the complete React Native environment
     - Switches to JDK 17
     - Sets Android SDK environment variables

2. **Before working on React Native**
   - Open a command prompt in the project directory
   - Run `setup-react-native-env.bat`
   - This will configure the current terminal session for React Native development

## Troubleshooting

If you encounter issues with the JDK version:

1. Verify JDK 17 is installed correctly:
   ```
   "C:\Program Files\Eclipse Adoptium\jdk-17.0.15+6\bin\java" -version
   ```

2. Check your environment variables:
   ```
   echo %JAVA_HOME%
   echo %ANDROID_HOME%
   ```

3. Make sure the paths in the batch files match your actual installation paths.

## Notes

- The environment changes made by these scripts are temporary and only affect the current terminal session.
- If you open a new terminal, you'll need to run the setup script again.
- Your system default JDK (21) will remain unchanged for other applications.

## Building Android APKs and App Bundles

After setting up the environment, you can build Android APKs and App Bundles (AAB) for your React Native app.

### Development APK

```bash
# Navigate to the android directory
cd TodoApp/android

# Build debug APK
./gradlew assembleDebug

# The APK will be available at:
# TodoApp/android/app/build/outputs/apk/debug/app-debug.apk
```

### Production APK

```bash
# Navigate to the android directory
cd TodoApp/android

# Build release APK
./gradlew assembleRelease

# The APK will be available at:
# TodoApp/android/app/build/outputs/apk/release/app-release.apk
```

### Android App Bundle (AAB) for Google Play

```bash
# Navigate to the android directory
cd TodoApp/android

# Build release bundle
./gradlew bundleRelease

# The AAB will be available at:
# TodoApp/android/app/build/outputs/bundle/release/app-release.aab
```

### Signing Android Builds

For production builds, you need to create a keystore file:

```bash
# Generate a keystore file (only needed once)
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Place the keystore file in TodoApp/android/app directory
```

Configure the signing in `TodoApp/android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-upload-key.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```