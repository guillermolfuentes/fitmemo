import React, { useState } from 'react';
import { Card, Button } from 'react-native-paper';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import RoutineSessionExerciseSetRow from './RoutineSessionExerciseSetRow';
import { FontAwesome } from '@expo/vector-icons';

interface RoutineSessionExerciseCardProps {
  id: number;
  name: string;
  onDeletePress?: () => void;
  canDeleteRows: boolean;
}

const RoutineSessionExerciseCard = ({
  id,
  name,
  canDeleteRows,
  onDeletePress,
}: RoutineSessionExerciseCardProps) => {
  const [sets, setSets] = useState([
    { setNumber: 1, repetitions: "", weight: "" },
    { setNumber: 2, repetitions: "", weight: "" },
    { setNumber: 3, repetitions: "", weight: "" },
  ]);

  const addSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, repetitions: "", weight: "" },
    ]);
  };

  const handleRepetitionsChange = (index: number, text: string) => {
    const newSets = [...sets];
    newSets[index].repetitions = text;
    setSets(newSets);
  };

  const handleWeightChange = (index: number, text: string) => {
    const newSets = [...sets];
    newSets[index].weight = text;
    setSets(newSets);
  };

  const handleDeletePress = (index: number) => {
    const updatedSets = sets
      .filter((_, i) => i !== index)
      .map((set, i) => ({
        ...set,
        setNumber: i + 1,
      }));
    setSets(updatedSets);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.exerciseTitle}>
          <Text style={styles.exerciseName}>{name}</Text>
          {onDeletePress && (
            <TouchableOpacity onPress={onDeletePress}>
              <FontAwesome name="trash" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        {sets.map((set, index) => (
          <RoutineSessionExerciseSetRow
            key={index}
            setNumber={set.setNumber}
            repetitions={set.repetitions}
            weight={set.weight}
            onRepetitionsChange={(text) => handleRepetitionsChange(index, text)}
            onWeightChange={(text) => handleWeightChange(index, text)}
            onDeletePress={
              canDeleteRows ? () => handleDeletePress(index) : undefined
            }
          />
        ))}
        <Button mode="contained" onPress={addSet} style={styles.addButton}>
          Añadir serie
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  exerciseTitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
   
  },
});

export default RoutineSessionExerciseCard;
