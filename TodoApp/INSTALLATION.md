# Todo List App - Installation Guide

This guide provides detailed instructions for installing and setting up the Todo List App on different platforms.

## End Users

### Android Installation

#### From Google Play Store
1. Open the Google Play Store on your Android device
2. Search for "Todo List App"
3. Tap "Install"
4. Once installed, tap "Open" to launch the app

#### From APK File
1. Download the APK file from our website
2. Enable installation from unknown sources:
   - Go to Settings > Security
   - Enable "Unknown Sources"
3. Open the downloaded APK file
4. Follow the on-screen instructions to install
5. Tap "Open" to launch the app

### iOS Installation

1. Open the App Store on your iOS device
2. Search for "Todo List App"
3. Tap "Get" or the download icon
4. Authenticate with Face ID, Touch ID, or your Apple ID password
5. Once installed, tap "Open" to launch the app

## Developers

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn (v1.22 or higher)
- Expo CLI
- Git
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Clone and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app/TodoApp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on a device or emulator:
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator (macOS only)

### Building for Development

#### Android Development Build

```bash
npx eas build --platform android --profile development
```

#### iOS Development Build

```bash
npx eas build --platform ios --profile development
```

### Building for Production

#### Android Production Build

```bash
npx eas build --platform android --profile production
```

#### iOS Production Build

```bash
npx eas build --platform ios --profile production
```

## System Requirements

### Mobile Devices

#### Android
- Android 6.0 (Marshmallow) or higher
- 50 MB of free storage space
- 1 GB RAM or higher

#### iOS
- iOS 12.0 or higher
- 50 MB of free storage space
- Compatible with iPhone, iPad, and iPod touch

### Development Environment

#### Windows
- Windows 10 or higher
- 8 GB RAM (16 GB recommended)
- 4 GB available disk space
- Intel Core i5 or equivalent

#### macOS
- macOS 10.15 (Catalina) or higher
- 8 GB RAM (16 GB recommended)
- 4 GB available disk space
- Intel Core i5 or Apple Silicon

#### Linux
- Ubuntu 18.04 LTS or higher
- 8 GB RAM (16 GB recommended)
- 4 GB available disk space
- Intel Core i5 or equivalent

## Troubleshooting Installation Issues

### Common Android Issues

1. **"App not installed" error**
   - Make sure you have enough storage space
   - Try restarting your device
   - Check if you have a conflicting app with the same package name

2. **App crashes on startup**
   - Make sure your Android version is compatible
   - Clear the app cache and data
   - Reinstall the app

### Common iOS Issues

1. **"Unable to Download App" error**
   - Check your internet connection
   - Make sure you have enough storage space
   - Sign out and sign back into your Apple ID

2. **App crashes on startup**
   - Make sure your iOS version is compatible
   - Restart your device
   - Reinstall the app

### Development Environment Issues

1. **Node.js or npm errors**
   - Make sure you have the correct versions installed
   - Try clearing the npm cache: `npm cache clean --force`
   - Reinstall Node.js and npm

2. **Expo CLI errors**
   - Update Expo CLI: `npm install -g expo-cli`
   - Clear Expo cache: `expo r -c`
   - Check Expo status: [status.expo.dev](https://status.expo.dev)

3. **Android Studio or Xcode issues**
   - Make sure you have the latest versions installed
   - Update all SDK components
   - Check that environment variables are set correctly

## Updating the App

### End Users

- The app will automatically check for updates
- You can also manually check for updates in the app settings
- Alternatively, update through the Google Play Store or App Store

### Developers

- Pull the latest changes from the repository:
  ```bash
  git pull origin main
  ```
- Update dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

## Uninstallation

### Android
1. Long press the app icon
2. Tap "Uninstall" or drag to the "Uninstall" option
3. Confirm uninstallation

### iOS
1. Long press the app icon
2. Tap "Remove App"
3. Tap "Delete App"
4. Confirm deletion

## Support

If you encounter any issues during installation:

- Email: support@todolistapp.com
- Website: www.todolistapp.com/support
- GitHub Issues: https://github.com/yourusername/todo-list-app/issues