import { Equipment } from "@/types/training/models/Equipment";
import { MuscleGroup } from "@/types/training/models/MuscleGroup";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

interface ExerciseCardProps {
  name: string;
  muscleGroup: MuscleGroup;
  material: Equipment;
  onAdd: () => void;
}

const muscleGroupTranslations: Record<MuscleGroup, string> = {
  chest: "Pecho",
  back: "Espalda",
  legs: "Piernas",
  arms: "Brazos",
  shoulders: "Hombros",
  abs: "Abdominales",
};

const equipmentTranslations: Record<Equipment, string> = {
  gym: "Gimnasio",
  dumbbells: "Mancuernas",
  barbell: "Barra",
  no_equipment: "Sin equipo",
};

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
        <Paragraph>
          Grupo Muscular: {muscleGroupTranslations[muscleGroup] || muscleGroup}
        </Paragraph>
        <Paragraph>
          Material: {equipmentTranslations[material] || material}
        </Paragraph>
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
