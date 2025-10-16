import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Colors from "@/constants/colors";

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  current: number;
  total: number;
  onNext: () => void;
  onSkip?: () => void;
}

export default function OnboardingSlide({
  title,
  subtitle,
  description,
  image,
  current,
  total,
  onNext,
  onSkip,
}: Props) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: image }}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === current ? Colors.primary : Colors.border,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonsRow}>
          {onSkip && (
            <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  image: { height: 300, justifyContent: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
  },
  textBox: { marginTop: 32, gap: 8 },
  title: {
    textAlign: "center" as const,
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.text,
    lineHeight: 48,
  },
  subtitle: {
    textAlign: "center" as const,
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 28,
  },
  desc: { textAlign: "center" as const, fontSize: 16, color: Colors.textSecondary },
  footer: { marginTop: "auto", alignItems: "center", gap: 16 },
  dots: { flexDirection: "row", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    width: "100%"
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 62,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 62,
    borderRadius: 12,
  },
  nextText: { color: "white", fontWeight: "600", fontSize: 16 },
  skip: { color: Colors.textSecondary, fontSize: 16 },
});
