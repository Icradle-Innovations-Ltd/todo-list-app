import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Card, Text, Button, Divider, useTheme } from 'react-native-paper';

interface AboutSectionProps {
  visible: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ visible }) => {
  const theme = useTheme();

  if (!visible) return null;

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="About the App" />
        <Card.Content>
          <Text style={styles.paragraph}>
            Todo List App is a comprehensive task management application designed to help you organize your daily activities, 
            set reminders, and track your productivity.
          </Text>
          <Text style={styles.paragraph}>
            Version: 1.0.0
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Developer Information" />
        <Card.Content>
          <Text style={styles.companyName}>iCradle Innovations Ltd</Text>
          <Text style={styles.paragraph}>
            We build innovative solutions that help people and businesses achieve their goals through technology.
          </Text>
          <Text style={styles.paragraph}>
            Website: icradle.io
          </Text>
          
          <View style={styles.socialButtons}>
            <Button 
              mode="outlined" 
              icon="github" 
              onPress={() => openLink('https://github.com/Icradle-Innovations-Ltd')}
              style={styles.socialButton}
            >
              GitHub
            </Button>
            <Button 
              mode="outlined" 
              icon="linkedin" 
              onPress={() => openLink('https://www.linkedin.com/in/icradleinnovationsltd')}
              style={styles.socialButton}
            >
              LinkedIn
            </Button>
            <Button 
              mode="outlined" 
              icon="web" 
              onPress={() => openLink('https://icradle.io')}
              style={styles.socialButton}
            >
              Website
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Legal Information" />
        <Card.Content>
          <Button 
            mode="text" 
            icon="file-document-outline" 
            onPress={() => openLink('https://icradle.io/privacy-policy')}
            style={styles.legalButton}
          >
            Privacy Policy
          </Button>
          <Divider style={styles.divider} />
          <Button 
            mode="text" 
            icon="file-document-outline" 
            onPress={() => openLink('https://icradle.io/terms-of-service')}
            style={styles.legalButton}
          >
            Terms and Conditions
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  socialButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  legalButton: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 4,
  },
});

export default AboutSection;