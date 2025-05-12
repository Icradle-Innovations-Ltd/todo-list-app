# QuickDone - Todo List App

## Overview
QuickDone is a mobile application built with React Native and Expo that helps users manage their tasks efficiently. The app allows users to create, edit, delete, and organize tasks with a clean and intuitive interface.

## Features
- **Task Management**: Create, edit, and delete tasks
- **Task Organization**: Mark tasks as completed or pending
- **User-Friendly Interface**: Clean and intuitive design for easy navigation
- **Persistent Storage**: Tasks are saved locally on the device
- **Cross-Platform**: Works on both Android and iOS devices
- **Camera Integration**: Attach photos to tasks
- **Calendar Integration**: Sync tasks with your calendar
- **Storage Access**: Save and manage task attachments

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd todo-list-app/TodoApp
   ```

2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```
   npx expo start
   ```

4. **Run on a device or emulator**
   - Scan the QR code with the Expo Go app on your device
   - Press 'a' to run on an Android emulator
   - Press 'i' to run on an iOS simulator (macOS only)

## Building the App

### Development Builds

#### Using EAS Build (Cloud)
```bash
# Android
npx eas build --platform android --profile development

# iOS
npx eas build --platform ios --profile development
```

#### Local Android Development APK
```bash
# Navigate to the android directory
cd android

# Build debug APK
./gradlew assembleDebug

# The APK will be available at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Production Builds

#### Using EAS Build (Cloud)
```bash
# Android
npx eas build --platform android --profile production

# iOS
npx eas build --platform ios --profile production
```

#### Local Android Production APK
```bash
# Navigate to the android directory
cd android

# Build release APK
./gradlew assembleRelease

# The APK will be available at:
# android/app/build/outputs/apk/release/app-release.apk
```

### Android App Bundle (AAB) for Google Play

```bash
# Navigate to the android directory
cd android

# Build release bundle
./gradlew bundleRelease

# The AAB will be available at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Signing Android Builds

For production builds, you need to create a keystore file:

```bash
# Generate a keystore file (only needed once)
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Place the keystore file in android/app directory
```

### Current Version
- **Version Name**: 1.0.1
- **Version Code**: 2
- **Release Date**: May 15, 2024

## Development

### Project Structure
```
TodoApp/
├── assets/            # Contains images, fonts, and other static assets
├── components/        # Reusable UI components
├── screens/           # App screens
├── App.js             # Main application entry point
├── app.json           # Expo configuration
└── package.json       # Dependencies and scripts
```

### Key Components
- **TaskItem**: Displays individual task with options to mark as complete or delete
- **TaskList**: Renders the list of tasks
- **AddTaskForm**: Form for adding new tasks
- **EditTaskForm**: Form for editing existing tasks

### Screens
- **HomeScreen**: Main screen displaying the list of tasks
- **AddTaskScreen**: Screen for adding new tasks
- **EditTaskScreen**: Screen for editing existing tasks

## Usage Guide

### Adding a Task
1. Open the app
2. Tap the "+" button
3. Enter task details
4. Tap "Add Task"

### Editing a Task
1. Tap on the task you want to edit
2. Modify the task details
3. Tap "Save Changes"

### Completing a Task
1. Tap the checkbox next to the task
2. The task will be marked as completed

### Deleting a Task
1. Swipe left on the task
2. Tap the "Delete" button

## Troubleshooting

### Common Issues

#### App crashes on startup
- Ensure all dependencies are installed correctly
- Check for any errors in the console
- Verify that the Expo configuration is correct

#### Tasks not saving
- Check if the storage permissions are granted
- Verify that the storage functionality is working correctly

#### UI rendering issues
- Clear the cache and restart the app
- Update to the latest version of the app

## Technical Details

### Technologies Used
- **React Native**: Framework for building native apps
- **Expo**: Platform for universal React applications
- **AsyncStorage**: Local storage solution
- **React Navigation**: Navigation library

### State Management
The app uses React's Context API for state management, allowing for efficient updates and rendering of tasks.

### Data Persistence
Tasks are stored locally using AsyncStorage, ensuring that data persists between app sessions.

## Future Enhancements
- Cloud synchronization
- Task categories and tags
- Reminder notifications
- Dark mode support
- Multi-user support

## Privacy Policy

QuickDone requires certain permissions to provide its full functionality:

- **Camera Permission**: Used to take photos to attach to tasks
- **Calendar Permission**: Used to sync tasks with your calendar
- **Storage Permission**: Used to save task attachments and app data

For more details about how we handle your data, please refer to our [Privacy Policy](https://www.icradleinnovations.com/privacy-policy).

## Support and Contact
For support or inquiries, please contact [info@icradleinnovations.com](mailto:info@icradleinnovations.com).

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## About iCradle Innovations
QuickDone is developed and maintained by iCradle Innovations, a software development company based in Kampala, Uganda, specializing in mobile and web applications.