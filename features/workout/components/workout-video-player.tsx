import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { AppText } from "@/components/app-text";
import { theme } from "@/theme";

type WorkoutVideoPlayerProps = {
  visible: boolean;
  videoId: string;
  exerciseName: string;
  onClose: () => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_HEIGHT = Math.round((SCREEN_WIDTH - 32) * (9 / 16));

/**
 * Builds an inline HTML page that embeds a YouTube video via the IFrame Player API.
 * Using inline HTML avoids needing to allowlist external URIs.
 */
function buildYouTubeHTML(videoId: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { background: #000; width: 100%; height: 100%; overflow: hidden; }
    #player { width: 100%; height: 100%; }
    iframe { width: 100%; height: 100%; border: 0; }
  </style>
</head>
<body>
  <div id="player"></div>
  <script>
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    function onYouTubeIframeAPIReady() {
      new YT.Player('player', {
        videoId: '${videoId}',
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          fs: 0,
        },
        events: {
          onReady: function(e) { e.target.playVideo(); }
        }
      });
    }
  </script>
</body>
</html>
`;
}

export function WorkoutVideoPlayer({
  visible,
  videoId,
  exerciseName,
  onClose,
}: WorkoutVideoPlayerProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 80,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 60,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.ytBadge}>
                <Ionicons name="logo-youtube" size={16} color="#FF0000" />
              </View>
              <AppText variant="sectionTitle" style={styles.title}>
                {exerciseName}
              </AppText>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              <Ionicons name="close" size={22} color={theme.colors.subtext} />
            </Pressable>
          </View>

          {/* Video player */}
          <View style={styles.videoWrapper}>
            {visible && (
              <WebView
                style={styles.webview}
                originWhitelist={["*"]}
                source={{ html: buildYouTubeHTML(videoId) }}
                javaScriptEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* Caption */}
          <View style={styles.caption}>
            <Ionicons name="information-circle-outline" size={14} color={theme.colors.subtext} />
            <AppText variant="caption" color="subtext" style={styles.captionText}>
              Watch the tutorial before starting your sets
            </AppText>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: 32,
    overflow: "hidden",
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.subtext,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 6,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  ytBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.cardElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.cardElevated,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnPressed: {
    opacity: 0.6,
  },
  videoWrapper: {
    marginHorizontal: theme.spacing.md,
    height: VIDEO_HEIGHT,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  caption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  captionText: {
    flex: 1,
  },
});
