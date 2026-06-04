import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, View, Text } from "react-native";

import { useHistoryStore } from "@/store/use-history-store";
import { formatDateLabel, formatDuration, groupWorkoutsByDate } from "@/utils/workout";

export function HistoryScreen() {
  const router = useRouter();
  const workouts = useHistoryStore((state) => state.workouts);
  const groupedWorkouts = useMemo(() => groupWorkoutsByDate(workouts), [workouts]);

  return (
    <View className="flex-1 bg-surface">
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-4 h-16 border-b border-border-subtle bg-surface z-50">
        <View className="flex-row items-center gap-4">
          <Pressable className="p-2 rounded-lg active:bg-surface-variant transition-colors">
            <MaterialIcons name="menu" size={24} color="#cdc7aa" />
          </Pressable>
          <Text className="font-display-lg text-2xl tracking-tighter text-primary-fixed">GRIT</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 24,
          paddingHorizontal: 16,
          paddingBottom: 180,
          gap: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="font-headline-lg text-3xl text-on-background mb-1">Workout History</Text>
          <Text className="font-body-md text-on-surface-variant">
            Completed sessions grouped by date
          </Text>
        </View>

        {groupedWorkouts.length > 0 ? (
          <View className="pl-8 relative pb-4 space-y-8">
            <View className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-border-subtle" />

            {groupedWorkouts.map((group) => (
              <View key={group.date} className="space-y-4">
                <View className="relative">
                  <View className="absolute -left-[28px] top-1 w-4 h-4 rounded-full border-4 border-surface z-10 bg-on-surface-variant" />
                  <Text className="font-label-md text-xs text-on-surface-variant uppercase tracking-widest pl-2">
                    {formatDateLabel(group.date)}
                  </Text>
                </View>

                <View className="space-y-4 pl-2">
                  {group.workouts.map((workout) => {
                    const newPrs = workout.exercises.filter((exercise) => exercise.newPr).length;

                    return (
                      <Pressable
                        key={workout.id}
                        onPress={() => router.push(`/history/${workout.id}`)}
                        className="bg-surface-container-low border border-border-subtle p-4 rounded-xl active:border-primary-fixed/50"
                      >
                        <View className="flex-row justify-between items-start mb-3">
                          <View className="flex-1">
                            <Text className="font-headline-md text-lg text-on-surface mb-1">
                              {workout.name}
                            </Text>
                            <Text className="font-label-md text-[12px] text-on-surface-variant uppercase">
                              {workout.exerciseCount} exercises • {workout.setCount} sets
                            </Text>
                          </View>
                          <MaterialIcons name="chevron-right" size={20} color="#cdc7aa" />
                        </View>

                        <View className="flex-row gap-6">
                          <View>
                            <Text className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-tighter">
                              Volume
                            </Text>
                            <Text className="font-numeric-data text-sm text-on-surface">
                              {workout.totalVolume.toLocaleString()} kg
                            </Text>
                          </View>
                          <View>
                            <Text className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-tighter">
                              Duration
                            </Text>
                            <Text className="font-numeric-data text-sm text-on-surface">
                              {formatDuration(workout.durationSeconds)}
                            </Text>
                          </View>
                          {newPrs > 0 && (
                            <View className="bg-primary-fixed/10 px-2 py-1 rounded self-start border border-primary-fixed/30 mt-1 ml-auto">
                              <Text className="font-label-md text-[10px] text-primary-fixed uppercase tracking-wider">
                                New PR 🎉
                              </Text>
                            </View>
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-surface-card border border-border-subtle rounded-xl p-6 items-center">
            <Text className="font-headline-md text-xl text-on-surface mb-2">
              No workouts saved yet
            </Text>
            <Text className="font-body-md text-on-surface-variant text-center">
              Finish a workout session and it will appear here grouped by date.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
