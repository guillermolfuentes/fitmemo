import { Equipment } from "@/types/training/models/Equipment";
import { MuscleGroup } from "@/types/training/models/MuscleGroup";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

interface ExerciseSearchProps {
  onSearch: (filters: {
    name: string;
    muscleGroup?: MuscleGroup;
    equipment?: Equipment;
  }) => void;
}

const ExerciseSearch = ({ onSearch }: ExerciseSearchProps) => {
  const [name, setExerciseName] = useState("");
  const [equipment, setEquipment] = useState<Equipment>();
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>();
  const { t } = useTranslation();

  const handleSearch = () => {
    onSearch({ name, equipment, muscleGroup });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t("components.exercise_search.search_placeholder")}
        value={name}
        onChangeText={setExerciseName}
        left={<TextInput.Icon icon="magnify" />}
      />
      <View style={styles.dropdownContainer}>
        <View style={styles.filterDropdown}>
          <Dropdown
            label={t("components.exercise_search.equipment_label")}
            value={equipment}
            hideMenuHeader={true}
            onSelect={(value) => {
              setEquipment(value as Equipment);
            }}
            options={[
              {
                label: t("screens.training.equipment.dumbbells"),
                value: "dumbbells",
              },
              {
                label: t("screens.training.equipment.barbell"),
                value: "barbell",
              },
              {
                label: t("screens.training.equipment.gym"),
                value: t("screens.training.equipment.gym"),
              },
              {
                label: t("screens.training.equipment.no_equipment"),
                value: "no_equipment",
              },
            ]}
          />
        </View>

        <Dropdown
          label={t("components.exercise_search.muscle_group_label")}
          value={muscleGroup}
          hideMenuHeader={true}
          onSelect={(value) => {
            setMuscleGroup(value as MuscleGroup);
          }}
          options={[
            { label: t("screens.training.muscle_group.chest"), value: "chest" },
            { label: t("screens.training.muscle_group.back"), value: "back" },
            { label: t("screens.training.muscle_group.legs"), value: "legs" },
            { label: t("screens.training.muscle_group.arms"), value: "arms" },
            {
              label: t("screens.training.muscle_group.shoulders"),
              value: "shoulders",
            },
            { label: t("screens.training.muscle_group.abs"), value: "abs" },
          ]}
        />
      </View>
      <Button mode="contained" onPress={handleSearch} icon="magnify">
        {t("components.exercise_search.search_button")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  input: {
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: "column",
    marginBottom: 15,
    marginTop: 10,
  },
  filterDropdown: {
    marginBottom: 10,
  },
});

export default ExerciseSearch;
