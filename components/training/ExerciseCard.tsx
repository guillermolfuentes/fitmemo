import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

interface ExerciseCardProps {
  name: string;
  muscleGroup: string;
  material: string;
  onAdd: () => void;
}

const ExerciseCard = ({
  name,
  muscleGroup,
  material,
  onAdd,
}: ExerciseCardProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{name}</Title>
        <Paragraph>Grupo Muscular: {muscleGroup}</Paragraph>
        <Paragraph>Material: {material}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={onAdd} icon="plus">
          Añadir
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
});

export default ExerciseCard;
