import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  FlatList,
  Platform,
  Alert,
} from 'react-native';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { RestTimer } from '../../components/ui/RestTimer';
import { Colors, Spacing, Radius } from '../../theme';
import { EXERCISES, MUSCLE_COLORS, MuscleGroup } from '../../constants/exercises';
import { useWorkoutStore, WorkoutExercise, WorkoutSet } from '@/src/store/workout-store';

export function WorkoutScreen() {
  const {
    activeWorkout,
    startWorkout,
    endWorkout,
    addExercise,
    removeExercise,
    addSet,
    updateSet,
    removeSet,
    completeSet,
  } = useWorkoutStore();

  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');

  const handleStartWorkout = () => {
    startWorkout();
  };

  const handleEndWorkout = () => {
    endWorkout();
  };

  const handleCompleteSet = (exerciseId: string, setId: string) => {
    completeSet(exerciseId, setId);
    setShowRestTimer(true);
  };

  const filteredExercises = EXERCISES.filter((e) => {
    const matchName = e.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMuscle = selectedMuscle === 'All' || e.muscleGroup === selectedMuscle;
    return matchName && matchMuscle;
  });

  const muscles: ('All' | MuscleGroup)[] = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];

  const elapsedMinutes = activeWorkout
    ? Math.floor((Date.now() - activeWorkout.startTime) / 60000)
    : 0;

  if (!activeWorkout) {
    return <NoWorkoutView onStart={handleStartWorkout} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Active Workout</Text>
          <Text style={styles.headerSub}>{elapsedMinutes}m elapsed</Text>
        </View>
        <GradientButton
          label="Finish"
          onPress={handleEndWorkout}
          size="sm"
          variant="danger"
          style={{ paddingHorizontal: 20 }}
        />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeWorkout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onAddSet={() => addSet(exercise.id)}
            onUpdateSet={(setId, data) => updateSet(exercise.id, setId, data)}
            onRemoveSet={(setId) => removeSet(exercise.id, setId)}
            onCompleteSet={(setId) => handleCompleteSet(exercise.id, setId)}
            onRemoveExercise={() => removeExercise(exercise.id)}
          />
        ))}

        <GradientButton
          label="+ Add Exercise"
          onPress={() => setShowExercisePicker(true)}
          style={styles.addExerciseBtn}
          variant="secondary"
        />
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal visible={showExercisePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Exercise</Text>
              <Pressable onPress={() => setShowExercisePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={Colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {muscles.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setSelectedMuscle(m)}
                  style={[
                    styles.filterChip,
                    selectedMuscle === m && { backgroundColor: Colors.accent.blue },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedMuscle === m && { color: '#fff' },
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.exerciseItem}
                  onPress={() => {
                    addExercise({ id: item.id, name: item.name, muscleGroup: item.muscleGroup });
                    setShowExercisePicker(false);
                    setSearchQuery('');
                  }}
                >
                  <View
                    style={[
                      styles.exerciseItemDot,
                      { backgroundColor: MUSCLE_COLORS[item.muscleGroup] },
                    ]}
                  />
                  <View>
                    <Text style={styles.exerciseItemName}>{item.name}</Text>
                    <Text style={styles.exerciseItemMuscle}>{item.muscleGroup}</Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      <RestTimer
        visible={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        defaultSeconds={90}
      />
    </View>
  );
}

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onAddSet: () => void;
  onUpdateSet: (setId: string, data: Partial<WorkoutSet>) => void;
  onRemoveSet: (setId: string) => void;
  onCompleteSet: (setId: string) => void;
  onRemoveExercise: () => void;
}

function ExerciseCard({
  exercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  onCompleteSet,
  onRemoveExercise,
}: ExerciseCardProps) {
  return (
    <Card style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseTitleRow}>
          <View
            style={[
              styles.muscleDot,
              { backgroundColor: MUSCLE_COLORS[exercise.muscleGroup] },
            ]}
          />
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Badge label={exercise.muscleGroup} color={MUSCLE_COLORS[exercise.muscleGroup]} />
        </View>
        <Pressable onPress={onRemoveExercise}>
          <Text style={styles.removeBtn}>✕</Text>
        </Pressable>
      </View>

      {/* Set Headers */}
      <View style={styles.setHeader}>
        <Text style={[styles.setHeaderText, { flex: 0.3 }]}>SET</Text>
        <Text style={[styles.setHeaderText, { flex: 1 }]}>WEIGHT (kg)</Text>
        <Text style={[styles.setHeaderText, { flex: 1 }]}>REPS</Text>
        <Text style={[styles.setHeaderText, { flex: 0.5 }]}>DONE</Text>
      </View>

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          set={set}
          index={index}
          onUpdate={(data) => onUpdateSet(set.id, data)}
          onRemove={() => onRemoveSet(set.id)}
          onComplete={() => onCompleteSet(set.id)}
        />
      ))}

      <Pressable style={styles.addSetBtn} onPress={onAddSet}>
        <Text style={styles.addSetBtnText}>+ Add Set</Text>
      </Pressable>
    </Card>
  );
}

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onUpdate: (data: Partial<WorkoutSet>) => void;
  onRemove: () => void;
  onComplete: () => void;
}

function SetRow({ set, index, onUpdate, onRemove, onComplete }: SetRowProps) {
  return (
    <View style={[styles.setRow, set.completed && styles.setRowCompleted]}>
      <Text style={[styles.setIndex, { flex: 0.3 }]}>{index + 1}</Text>
      <TextInput
        style={[styles.setInput, { flex: 1 }]}
        value={set.weight.toString()}
        onChangeText={(v) => onUpdate({ weight: parseFloat(v) || 0 })}
        keyboardType="decimal-pad"
        selectTextOnFocus
      />
      <TextInput
        style={[styles.setInput, { flex: 1 }]}
        value={set.reps.toString()}
        onChangeText={(v) => onUpdate({ reps: parseInt(v) || 0 })}
        keyboardType="number-pad"
        selectTextOnFocus
      />
      <Pressable
        style={[styles.checkBtn, set.completed && styles.checkBtnDone]}
        onPress={onComplete}
      >
        <Text style={styles.checkBtnText}>{set.completed ? '✓' : '○'}</Text>
      </Pressable>
    </View>
  );
}

function NoWorkoutView({ onStart }: { onStart: () => void }) {
  const { workoutHistory } = useWorkoutStore();
  const lastWorkout = workoutHistory[0];

  return (
    <View style={styles.noWorkoutContainer}>
      <Text style={styles.noWorkoutEmoji}>💪</Text>
      <Text style={styles.noWorkoutTitle}>Ready to train?</Text>
      <Text style={styles.noWorkoutSub}>Start a new workout and track every rep.</Text>

      <GradientButton
        label="Start Workout"
        onPress={onStart}
        size="lg"
        style={styles.startBtn}
      />

      {lastWorkout && (
        <Card style={styles.lastWorkoutCard}>
          <Text style={styles.lastWorkoutLabel}>LAST WORKOUT</Text>
          <Text style={styles.lastWorkoutDate}>{lastWorkout.date}</Text>
          <Text style={styles.lastWorkoutExercises}>
            {lastWorkout.exercises.map((e) => e.name).join(', ')}
          </Text>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.accent.blue,
    marginTop: 2,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    padding: Spacing.md,
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  muscleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  removeBtn: {
    color: Colors.text.muted,
    fontSize: 16,
    padding: 4,
  },
  setHeader: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  setHeaderText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: Radius.sm,
    paddingHorizontal: 4,
    marginBottom: 4,
    gap: 8,
  },
  setRowCompleted: {
    backgroundColor: Colors.accent.blue + '11',
  },
  setIndex: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    fontWeight: '600',
  },
  setInput: {
    backgroundColor: Colors.card.border,
    borderRadius: 8,
    padding: 8,
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  checkBtn: {
    flex: 0.5,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.card.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtnDone: {
    backgroundColor: Colors.accent.blue,
  },
  checkBtnText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  addSetBtn: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.card.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addSetBtnText: {
    color: Colors.text.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  addExerciseBtn: {
    marginBottom: 12,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bg.secondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '80%',
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  modalClose: {
    color: Colors.text.muted,
    fontSize: 18,
    padding: 4,
  },
  searchInput: {
    backgroundColor: Colors.card.primary,
    borderRadius: 12,
    padding: 12,
    color: Colors.text.primary,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.card.primary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  exerciseItemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  exerciseItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  exerciseItemMuscle: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  // No workout view
  noWorkoutContainer: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
    padding: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
    alignItems: 'center',
  },
  noWorkoutEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noWorkoutTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  noWorkoutSub: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  startBtn: {
    width: '100%',
    marginBottom: 24,
  },
  lastWorkoutCard: {
    width: '100%',
  },
  lastWorkoutLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  lastWorkoutDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  lastWorkoutExercises: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});