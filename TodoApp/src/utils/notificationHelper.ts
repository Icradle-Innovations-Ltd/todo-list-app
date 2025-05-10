import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if we're in a development build (not Expo Go)
const isDevBuild = Constants.appOwnership !== 'expo';
export const canUseNotifications = isDevBuild || Platform.OS !== 'android';

// Configure notifications
if (canUseNotifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Wrapper for requestPermissionsAsync
export const requestNotificationPermissions = async () => {
  if (!canUseNotifications) {
    return { status: 'denied' };
  }
  return await Notifications.requestPermissionsAsync();
};

// Wrapper for scheduleNotificationAsync
export const scheduleNotification = async (
  title: string,
  body: string,
  date: Date,
  data: any = {}
) => {
  if (!canUseNotifications) {
    console.log('Notification would be scheduled for:', title, 'at', date.toLocaleString());
    return null;
  }
  
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: date,
  });
};

export default {
  canUseNotifications,
  requestNotificationPermissions,
  scheduleNotification,
  // Export other functions as needed
};