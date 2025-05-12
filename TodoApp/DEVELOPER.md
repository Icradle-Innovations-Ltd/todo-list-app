# Todo List App - Developer Documentation

## Architecture Overview

The Todo List App follows a component-based architecture using React Native and Expo. The application is structured to maintain separation of concerns and promote code reusability.

## Development Environment Setup

### Required Tools
- Node.js (v14+)
- npm (v6+) or Yarn (v1.22+)
- Expo CLI (`npm install -g expo-cli`)
- Git
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- VS Code or any preferred code editor

### Environment Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-list-app/TodoApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

## Project Structure

```
TodoApp/
├── assets/                # Static assets
│   ├── adaptive-icon.png  # Adaptive app icon
│   ├── favicon.png        # Favicon
│   ├── icon.png           # App icon
│   └── splash.png         # Splash screen
│
├── components/            # Reusable UI components
│   ├── TaskItem.js        # Individual task component
│   ├── TaskList.js        # List of tasks component
│   ├── AddTaskForm.js     # Form for adding tasks
│   └── EditTaskForm.js    # Form for editing tasks
│
├── screens/               # App screens
│   ├── HomeScreen.js      # Main screen with task list
│   ├── AddTaskScreen.js   # Screen for adding tasks
│   └── EditTaskScreen.js  # Screen for editing tasks
│
├── context/               # Context API for state management
│   └── TaskContext.js     # Task state management
│
├── utils/                 # Utility functions
│   ├── storage.js         # AsyncStorage functions
│   └── helpers.js         # Helper functions
│
├── navigation/            # Navigation configuration
│   └── AppNavigator.js    # App navigation setup
│
├── App.js                 # Main application entry point
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── package.json           # Dependencies and scripts
└── eas.json               # EAS Build configuration
```

## Core Components

### TaskItem.js
Renders an individual task with options to mark as complete or delete.

```jsx
// Key props
{
  id: String,           // Unique identifier for the task
  title: String,        // Task title
  completed: Boolean,   // Task completion status
  onToggle: Function,   // Function to toggle completion status
  onDelete: Function,   // Function to delete the task
  onEdit: Function      // Function to navigate to edit screen
}
```

### TaskList.js
Renders the list of tasks using FlatList.

```jsx
// Key props
{
  tasks: Array,         // Array of task objects
  onToggleTask: Function, // Function to toggle task completion
  onDeleteTask: Function, // Function to delete a task
  onEditTask: Function    // Function to edit a task
}
```

### AddTaskForm.js
Form component for adding new tasks.

```jsx
// Key props
{
  onAddTask: Function   // Function to add a new task
}
```

### EditTaskForm.js
Form component for editing existing tasks.

```jsx
// Key props
{
  task: Object,         // Task object to edit
  onUpdateTask: Function // Function to update the task
}
```

## State Management

The app uses React's Context API for state management. The `TaskContext.js` file provides the context and reducer for managing tasks.

### TaskContext.js

```jsx
// Task actions
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      // Add a new task
    case 'UPDATE_TASK':
      // Update an existing task
    case 'DELETE_TASK':
      // Delete a task
    case 'TOGGLE_TASK':
      // Toggle task completion status
    case 'SET_TASKS':
      // Set all tasks (used when loading from storage)
    default:
      return state;
  }
};
```

## Data Persistence

Tasks are stored locally using AsyncStorage. The storage functions are defined in `utils/storage.js`.

### storage.js

```javascript
// Key functions
const saveTasks = async (tasks) => {
  // Save tasks to AsyncStorage
};

const loadTasks = async () => {
  // Load tasks from AsyncStorage
};
```

## Navigation

The app uses React Navigation for screen navigation. The navigation configuration is defined in `navigation/AppNavigator.js`.

### AppNavigator.js

```jsx
// Navigation structure
const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

## Build Process

The app uses EAS Build for creating production builds.

### Development Build

```bash
npx eas build --platform android --profile development
# or
npx eas build --platform ios --profile development
```

### Production Build

```bash
npx eas build --platform android --profile production
# or
npx eas build --platform ios --profile production
```

## Testing

### Unit Testing

The app uses Jest for unit testing.

```bash
npm test
# or
yarn test
```

### E2E Testing

For end-to-end testing, the app uses Detox.

```bash
npm run e2e
# or
yarn e2e
```

## Coding Standards

### JavaScript/React Style Guide

- Use functional components with hooks
- Use destructuring for props
- Use async/await for asynchronous operations
- Follow the ESLint configuration

### Naming Conventions

- **Components**: PascalCase (e.g., `TaskItem.js`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Variables**: camelCase (e.g., `taskList`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_TASKS`)

## Deployment

### App Store (iOS)

1. Create a production build using EAS Build
   ```bash
   npx eas build --platform ios --profile production
   ```
2. Submit the build to App Store Connect
   ```bash
   npx eas submit --platform ios
   ```

### Google Play Store (Android)

1. Create a production build using EAS Build
   ```bash
   npx eas build --platform android --profile production
   ```
2. Submit the build to Google Play Console
   ```bash
   npx eas submit --platform android
   ```

## Signing Android APK for Distribution

To distribute your Android app, you need to sign it with a production keystore. Follow these steps:

### 1. Generate a Production Keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

You will be prompted to:
- Create a password for the keystore
- Enter your name, organization, and location information
- Create a password for the key (can be the same as the keystore password)

**IMPORTANT**: Store this keystore file and passwords securely. If you lose them, you won't be able to update your app on the Play Store.

### 2. Configure Gradle for Release Signing

Edit `android/app/build.gradle` to add your signing configuration:

```gradle
android {
    ...
    signingConfigs {
        debug {
            ...
        }
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        debug {
            ...
        }
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

For better security, you can store passwords in `gradle.properties` and reference them:

```gradle
// In gradle.properties (DO NOT commit this file to version control)
MYAPP_RELEASE_STORE_PASSWORD=your-keystore-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password

// In build.gradle
release {
    storeFile file('my-release-key.keystore')
    storePassword MYAPP_RELEASE_STORE_PASSWORD
    keyAlias 'my-key-alias'
    keyPassword MYAPP_RELEASE_KEY_PASSWORD
}
```

### 3. Generate a Signed APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 4. Verify the Signed APK

You can verify the APK is signed correctly using:

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Common Development Issues

1. **Metro bundler issues**
   - Clear Metro cache: `npx expo start --clear`

2. **Dependency conflicts**
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Build failures**
   - Check EAS build logs for specific errors
   - Verify that all native dependencies are properly configured

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Documentation

If the app integrates with any external APIs, document them here with endpoints, request/response formats, and authentication requirements.

## Performance Optimization

- Use `React.memo()` for components that don't need frequent re-renders
- Implement virtualization for long lists using `FlatList`
- Minimize state updates and use `useCallback` for memoized functions
- Use image optimization for assets

## Security Considerations

- Don't store sensitive information in AsyncStorage without encryption
- Implement proper input validation
- Keep dependencies updated to avoid security vulnerabilities

## Version History

- **v1.0.0** - Initial release with basic task management
- **v1.1.0** - Added task categories and improved UI
- **v1.2.0** - Added reminder notifications

## License

This project is licensed under the MIT License - see the LICENSE file for details.