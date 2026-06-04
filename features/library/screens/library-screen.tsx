import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, View, Text, Pressable, TextInput } from "react-native";

export function LibraryScreen() {
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
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full border border-border-subtle overflow-hidden">
            <View className="w-full h-full bg-surface-variant items-center justify-center">
              <Text className="font-numeric-data text-on-surface">J</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="pt-6 px-4 pb-24 space-y-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-headline-lg text-3xl text-on-background">Routine Creator</Text>
          <View className="bg-surface-container px-3 py-1 rounded-full border border-border-subtle">
            <Text className="font-label-md text-xs text-on-surface-variant">DRAFT #04</Text>
          </View>
        </View>

        {/* Main Panel */}
        <View className="bg-surface-card border border-border-subtle p-6 rounded-xl space-y-6">
          <View className="space-y-2">
            <Text className="font-label-md text-sm text-on-surface-variant uppercase">
              Routine Identity
            </Text>
            <TextInput
              className="w-full bg-surface-container-lowest border-b-2 border-border-subtle focus:border-primary-fixed text-on-surface p-3 font-body-lg text-lg"
              placeholderTextColor="#cdc7aa"
              placeholder="e.g. Hypertrophy - Push Day A"
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 space-y-2">
              <Text className="font-label-md text-sm text-on-surface-variant uppercase">
                Exercise Library
              </Text>
              <View className="relative justify-center">
                <TextInput
                  className="w-full bg-surface-container-lowest border-b-2 border-border-subtle focus:border-primary-fixed text-on-surface p-3 font-body-md text-base"
                  placeholderTextColor="#cdc7aa"
                  placeholder="Select Exercise..."
                />
                <View className="absolute right-3 top-3">
                  <MaterialIcons name="expand-more" size={24} color="#cdc7aa" />
                </View>
              </View>
            </View>
          </View>

          <View className="space-y-2">
            <Text className="font-label-md text-sm text-on-surface-variant uppercase">
              Custom Variation
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 bg-surface-container-lowest border-b-2 border-border-subtle focus:border-primary-fixed text-on-surface p-3 font-body-md text-base"
                placeholderTextColor="#cdc7aa"
                placeholder="Type custom exercise..."
              />
              <Pressable className="bg-surface-elevated px-4 py-2 flex-row items-center justify-center gap-2 border border-border-subtle active:scale-95">
                <MaterialIcons name="add" size={20} color="#e5e2e1" />
                <Text className="font-label-md text-sm text-on-surface">APPEND</Text>
              </Pressable>
            </View>
          </View>

          {/* Exercise List */}
          <View className="space-y-4 pt-4 border-t border-border-subtle">
            <View className="flex-row justify-between items-center">
              <Text className="font-headline-md text-2xl text-on-surface">Exercise Order</Text>
              <Text className="text-on-surface-variant font-numeric-data text-xs">3 MOVEMENTS</Text>
            </View>
            <View className="space-y-3">
              {[
                { name: "Barbell Back Squat", tag: "Quads" },
                { name: "Walking Lunges", tag: "Legs" },
                { name: "Leg Extensions", tag: "Isolation" },
              ].map((ex, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-4 bg-surface-container border border-border-subtle p-4 rounded-lg"
                >
                  <MaterialIcons name="drag-indicator" size={24} color="#cdc7aa" />
                  <View className="flex-1">
                    <Text className="font-numeric-data text-lg text-on-surface">{ex.name}</Text>
                    <View className="flex-row gap-2 mt-1">
                      <View className="border border-border-subtle px-1.5 rounded">
                        <Text className="text-[10px] font-label-md uppercase text-on-surface-variant">
                          {ex.tag}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <MaterialIcons name="close" size={24} color="#cdc7aa" />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Right Side / Settings Preview */}
        <View className="space-y-6">
          <View className="bg-surface-container-high border border-border-subtle rounded-xl p-6">
            <Text className="font-label-md text-sm text-on-surface-variant uppercase mb-4">
              Routine Settings
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-body-md text-base text-on-surface">Public Routine</Text>
                <View className="w-10 h-6 bg-surface-container-lowest rounded-full p-1 border border-border-subtle">
                  <View className="w-4 h-4 bg-on-surface-variant rounded-full" />
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="font-body-md text-base text-on-surface">Track PRs</Text>
                <View className="w-10 h-6 bg-primary-fixed rounded-full p-1 border border-border-subtle">
                  <View className="w-4 h-4 bg-on-primary-fixed rounded-full translate-x-4" />
                </View>
              </View>
            </View>
          </View>

          <View className="h-48 rounded-xl overflow-hidden border border-border-subtle relative bg-surface-container-lowest">
            <View className="absolute inset-0 bg-gradient-to-t from-surface to-transparent flex-col justify-end p-4 z-10">
              <Text className="font-display-lg text-2xl text-on-surface font-bold">
                PUSH YOUR LIMITS
              </Text>
            </View>
          </View>

          <Pressable className="w-full bg-primary-fixed py-4 rounded-xl flex-row items-center justify-center gap-3 active:scale-95 shadow-xl">
            <MaterialIcons name="save" size={24} color="#201c00" />
            <Text className="font-display-lg text-2xl text-on-primary-fixed">SAVE ROUTINE</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
