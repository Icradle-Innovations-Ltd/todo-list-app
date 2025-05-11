import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type NavigationHeaderProps = {
  title: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showCancelButton?: boolean;
  onCancel?: () => void;
};

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  showBackButton = true,
  showHomeButton = true,
  showCancelButton = false,
  onCancel,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      {showBackButton && (
        <Appbar.BackAction onPress={handleGoBack} color={theme.colors.primary} />
      )}
      <Appbar.Content title={title} titleStyle={{ color: theme.colors.primary }} />
      {showCancelButton && (
        <Appbar.Action icon="close" onPress={onCancel} color={theme.colors.error} />
      )}
      {showHomeButton && (
        <Appbar.Action icon="home" onPress={handleGoHome} color={theme.colors.primary} />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
});

export default NavigationHeader;