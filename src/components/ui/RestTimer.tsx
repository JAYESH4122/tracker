import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Colors, Radius } from '../../theme';

interface RestTimerProps {
  visible: boolean;
  defaultSeconds?: number;
  onClose: () => void;
}

export function RestTimer({ visible, defaultSeconds = 90, onClose }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (visible) {
      setSeconds(defaultSeconds);
      setRunning(true);
    }
  }, [visible, defaultSeconds]);

  useEffect(() => {
    if (!running || !visible || seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, running, visible]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
  const progress = 1 - seconds / defaultSeconds;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>REST TIMER</Text>

          {/* Progress ring using border trick */}
          <View style={styles.ringOuter}>
            <View style={[styles.ringBg]} />
            <View style={styles.ringCenter}>
              <Text style={styles.time}>{seconds <= 0 ? '00:00' : timeStr}</Text>
              {seconds <= 0 && <Text style={styles.doneText}>Done! 🎉</Text>}
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.btnRow}>
            <Pressable
              style={[styles.btn, { backgroundColor: Colors.card.border }]}
              onPress={() => setSeconds((s) => Math.max(0, s - 15))}
            >
              <Text style={styles.btnText}>−15s</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: Colors.accent.blue, flex: 1.5 }]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Skip Rest</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: Colors.card.border }]}
              onPress={() => setSeconds((s) => s + 15)}
            >
              <Text style={styles.btnText}>+15s</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.card.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.muted,
    letterSpacing: 3,
    marginBottom: 28,
  },
  ringOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: Colors.accent.blue + '33',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringBg: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.card.secondary,
  },
  ringCenter: {
    alignItems: 'center',
  },
  time: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: -2,
  },
  doneText: {
    fontSize: 14,
    color: Colors.status.success,
    fontWeight: '700',
    marginTop: 4,
  },
  progressBg: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.card.border,
    borderRadius: 2,
    marginBottom: 28,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent.blue,
    borderRadius: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});