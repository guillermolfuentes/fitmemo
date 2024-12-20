import React, { useState } from 'react';
import { Card, Button } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import RoutineSessionExerciseSetRow from './RoutineSessionExerciseSetRow';

interface RoutineSessionExerciseCardProps {
  id: number;
  name: string;
  onStartSession: () => void;
  onEditSession: () => void;
}

const RoutineSessionExerciseCard = ({
  id,
  name,
  onStartSession,
  onEditSession,
}: RoutineSessionExerciseCardProps) => {
  const [sets, setSets] = useState([
    { setNumber: 1, repetitions: '', weight: '' },
    { setNumber: 2, repetitions: '', weight: '' },
    { setNumber: 3, repetitions: '', weight: '' },
  ]);

  const addSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, repetitions: '', weight: '' },
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
     const newSets = sets.filter((_, i) => i !== index);
     setSets(newSets);
   };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.exerciseName}>{name}</Text>
        {sets.map((set, index) => (
          <RoutineSessionExerciseSetRow
            key={index}
            setNumber={set.setNumber}
            repetitions={set.repetitions}
            weight={set.weight}
            onRepetitionsChange={(text) => handleRepetitionsChange(index, text)}
            onWeightChange={(text) => handleWeightChange(index, text)}
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
