import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

interface TrainingSessionCardProps {
  id: string;
  name: string;
  description: string;
}

const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({ id, name, description }) => {
  const navigation = useNavigation();

  const handleStartSession = () => {
    navigation.navigate('SessionDetails', { sessionId: id });
  };

  const handleEditSession = () => {
    navigation.navigate('EditSession', { sessionId: id });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{name}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleStartSession}>Start</Button>
        <Button onPress={handleEditSession}>Edit</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default TrainingSessionCard;