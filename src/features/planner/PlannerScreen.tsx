import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Card } from '../../components/ui/Card';
import { GradientButton } from '../../components/ui/GradientButton';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { Colors, Spacing, Radius } from '../../theme';
import { EXERCISES, MUSCLE_COLORS, MuscleGroup } from '../../constants/exercises';

interface Template {
  id: string;
  name: string;
  exercises: string[];
  muscleGroups: MuscleGroup[];
}

interface ScheduledDay {
  day: string;
  templateId: string | null;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'push',
    name: 'Push Day',
    exercises: ['Bench Press', 'Overhead Press', 'Incline Bench Press', 'Lateral Raise'],
    muscleGroups: ['Chest', 'Shoulders'],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    exercises: ['Deadlift', 'Pull Up', 'Bent Over Row', 'Lat Pulldown'],
    muscleGroups: ['Back'],
  },
  {
    id: 'legs',
    name: 'Leg Day',
    exercises: ['Squat', 'Leg Press', 'Leg Curl', 'Calf Raise'],
    muscleGroups: ['Legs'],
  },
  {
    id: 'upper',
    name: 'Upper Body',
    exercises: ['Bench Press', 'Bent Over Row', 'Overhead Press', 'Bicep Curl'],
    muscleGroups: ['Chest', 'Back', 'Shoulders', 'Arms'],
  },
];

export function PlannerScreen() {
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);
  const [schedule, setSchedule] = useState<ScheduledDay[]>(
    DAYS.map((day) => ({ day, templateId: null }))
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleScheduleDay = (day: string) => {
    setSelectedDay(day);
    setShowScheduleModal(true);
  };

  const assignTemplate = (templateId: string | null) => {
    setSchedule((prev) =>
      prev.map((s) => (s.day === selectedDay ? { ...s, templateId } : s))
    );
    setShowScheduleModal(false);
  };

  const createTemplate = () => {
    if (!newTemplateName.trim() || !selectedExercises.length) return;
    const muscleGroups = [
      ...new Set(
        selectedExercises
          .map((name) => EXERCISES.find((e) => e.name === name)?.muscleGroup)
          .filter(Boolean) as MuscleGroup[]
      ),
    ];
    const template: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      exercises: selectedExercises,
      muscleGroups,
    };
    setTemplates((prev) => [...prev, template]);
    setNewTemplateName('');
    setSelectedExercises([]);
    setShowCreateModal(false);
  };

  const toggleExercise = (name: string) => {
    setSelectedExercises((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Planner</Text>

      {/* Weekly Schedule */}
      <Card style={styles.section}>
        <SectionHeader title="Weekly Schedule" />
        <View style={styles.weekGrid}>
          {schedule.map((s) => {
            const template = templates.find((t) => t.id === s.templateId);
            return (
              <Pressable
                key={s.day}
                style={[styles.dayCell, template && { borderColor: Colors.accent.blue + '55' }]}
                onPress={() => handleScheduleDay(s.day)}
              >
                <Text style={styles.dayLabel}>{s.day}</Text>
                {template ? (
                  <>
                    <View style={styles.dayDot} />
                    <Text style={styles.dayTemplateName} numberOfLines={1}>
                      {template.name}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.dayRest}>Rest</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </Card>

      {/* Templates */}
      <View style={styles.templateHeader}>
        <SectionHeader title="Templates" />
        <GradientButton
          label="+ New"
          onPress={() => setShowCreateModal(true)}
          size="sm"
          style={{ marginTop: -12 }}
        />
      </View>

      {templates.map((template) => (
        <Card key={template.id} style={styles.templateCard}>
          <View style={styles.templateTop}>
            <Text style={styles.templateName}>{template.name}</Text>
            <View style={styles.muscleChips}>
              {template.muscleGroups.slice(0, 2).map((m) => (
                <Badge key={m} label={m} color={MUSCLE_COLORS[m]} />
              ))}
            </View>
          </View>
          <Text style={styles.templateExercises}>
            {template.exercises.join(' · ')}
          </Text>
          <View style={styles.templateActions}>
            <Text style={styles.templateCount}>{template.exercises.length} exercises</Text>
            <GradientButton
              label="Start"
              onPress={() => {}}
              size="sm"
              style={{ paddingHorizontal: 16 }}
            />
          </View>
        </Card>
      ))}

      {/* Schedule Modal */}
      <Modal visible={showScheduleModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Schedule {selectedDay}</Text>
            <Pressable style={styles.scheduleOption} onPress={() => assignTemplate(null)}>
              <Text style={styles.scheduleOptionText}>Rest Day</Text>
            </Pressable>
            {templates.map((t) => (
              <Pressable key={t.id} style={styles.scheduleOption} onPress={() => assignTemplate(t.id)}>
                <Text style={styles.scheduleOptionText}>{t.name}</Text>
                <Text style={styles.scheduleOptionSub}>{t.exercises.length} exercises</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setShowScheduleModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Create Template Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { maxHeight: '85%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>New Template</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Text style={{ color: Colors.text.muted, fontSize: 18 }}>✕</Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.nameInput}
              placeholder="Template name..."
              placeholderTextColor={Colors.text.muted}
              value={newTemplateName}
              onChangeText={setNewTemplateName}
            />
            <Text style={styles.pickLabel}>SELECT EXERCISES</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {EXERCISES.map((e) => {
                const selected = selectedExercises.includes(e.name);
                return (
                  <Pressable
                    key={e.id}
                    style={[styles.exerciseRow, selected && styles.exerciseRowSelected]}
                    onPress={() => toggleExercise(e.name)}
                  >
                    <View style={[styles.exerciseDot, { backgroundColor: MUSCLE_COLORS[e.muscleGroup] }]} />
                    <Text style={styles.exerciseRowName}>{e.name}</Text>
                    {selected && <Text style={{ color: Colors.accent.blue }}>✓</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
            <GradientButton
              label={`Create (${selectedExercises.length} exercises)`}
              onPress={createTemplate}
              size="md"
              style={{ marginTop: 16 }}
              disabled={!newTemplateName.trim() || !selectedExercises.length}
            />
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  content: {
    padding: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    letterSpacing: -1,
  },
  section: {
    marginBottom: Spacing.md,
  },
  weekGrid: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dayCell: {
    flex: 1,
    minWidth: 70,
    backgroundColor: Colors.card.secondary,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
    minHeight: 72,
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent.blue,
    marginBottom: 4,
  },
  dayTemplateName: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.accent.blue,
    textAlign: 'center',
  },
  dayRest: {
    fontSize: 11,
    color: Colors.text.muted,
    marginTop: 4,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  templateCard: {
    marginBottom: 10,
  },
  templateTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  templateName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  muscleChips: {
    flexDirection: 'row',
    gap: 6,
  },
  templateExercises: {
    fontSize: 12,
    color: Colors.text.muted,
    lineHeight: 18,
    marginBottom: 10,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateCount: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.bg.secondary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  scheduleOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
  },
  scheduleOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  scheduleOptionSub: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 16,
    padding: 14,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.text.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  nameInput: {
    backgroundColor: Colors.card.primary,
    borderRadius: 12,
    padding: 14,
    color: Colors.text.primary,
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  pickLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card.border,
    paddingHorizontal: 4,
  },
  exerciseRowSelected: {
    backgroundColor: Colors.accent.blue + '11',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  exerciseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  exerciseRowName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});