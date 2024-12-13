import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface TrainingSessionCardProps {
  id: number;
  name: string;
  onStartSession: (id: number) => void;
  onEditSession: (id: number) => void;
}

const TrainingSessionCard = ({
  id,
  name,
  onStartSession,
  onEditSession,
}: TrainingSessionCardProps) => {
  const navigation = useNavigation();
  const [routineSessionId, setRoutineSessionId] = useState<number | null>(null);

  useEffect(() => {
    setRoutineSessionId(id);
  }, [id]);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <Title>{name}</Title>
          <IconButton icon="pencil" onPress={() => onEditSession(id)} />
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" icon="play" onPress={() => onStartSession(id)}>
          Start session
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
});

export default TrainingSessionCard;
