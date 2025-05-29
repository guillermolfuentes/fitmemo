import { Equipment } from "@/types/training/models/Equipment";
import { MuscleGroup } from "@/types/training/models/MuscleGroup";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card, Title, Paragraph, Button } from "react-native-paper";

interface ExerciseCardProps {
  name: string;
  muscleGroup: MuscleGroup;
  material: Equipment;
  onAdd: () => void;
}

const ExerciseCard = ({
  name,
  muscleGroup,
  material,
  onAdd,
}: ExerciseCardProps) => {
  const { t } = useTranslation();
  const muscleGroupTranslations: Record<MuscleGroup, string> = {
    chest: t("screens.training.muscle_group.chest"),
    back: t("screens.training.muscle_group.back"),
    legs: t("screens.training.muscle_group.legs"),
    arms: t("screens.training.muscle_group.arms"),
    shoulders: t("screens.training.muscle_group.shoulders"),
    abs: t("screens.training.muscle_group.abs"),
  };

  const equipmentTranslations: Record<Equipment, string> = {
    gym: t("screens.training.equipment.gym"),
    dumbbells: t("screens.training.equipment.dumbbells"),
    barbell: t("screens.training.equipment.barbell"),
    no_equipment: t("screens.training.equipment.no_equipment"),
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{name}</Title>
        <Paragraph>
          {t("components.exercise_card.muscle_group_title")}{" "}
          {muscleGroupTranslations[muscleGroup] || muscleGroup}
        </Paragraph>
        <Paragraph>
          {t("components.exercise_card.equipment_title")}{" "}
          {equipmentTranslations[material] || material}
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" onPress={onAdd} icon="plus">
          {t("common.add")}
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
