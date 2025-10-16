import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Shield, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";

export default function ConsentScreen() {
  const router = useRouter();
  const [tosAccepted, setTosAccepted] = useState<boolean>(false);
  const [ppAccepted, setPpAccepted] = useState<boolean>(false);

  const canContinue = tosAccepted && ppAccepted;

  const CONSENT_VERSION = "1.0.0";

  const handleContinue = async () => {
    if (!canContinue) return;
    await AsyncStorage.setItem(
      "pendingConsent",
      JSON.stringify({
        tos: true,
        privacy: true,
        version: CONSENT_VERSION,
        acceptedAt: new Date().toISOString(),
      })
    );
    router.push("/signup");
  };

  // para abrir ToS/Privacy en web
  const openTOS = () =>
    WebBrowser.openBrowserAsync("https://tu-dominio.com/terms");
  const openPrivacy = () =>
    WebBrowser.openBrowserAsync("https://tu-dominio.com/privacy");
  return (
    <View style={styles.container}>
      <View style={{ paddingTop: 40 }} />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield color={Colors.primary} size={48} />
          </View>
          <Text style={styles.title}>Privacy & Terms</Text>
          <Text style={styles.subtitle}>
            Please review and accept our Terms of Service and Privacy Policy to
            continue.
          </Text>
        </View>

        <View style={styles.consentSection}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setTosAccepted(!tosAccepted)}
          >
            <View
              style={[styles.checkbox, tosAccepted && styles.checkboxChecked]}
            >
              {tosAccepted && <Check color={Colors.white} size={16} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the <Text style={styles.link} onPress={openTOS}>Terms of Service</Text>
              {/* I agree to the <Text style={styles.link}>Terms of Service</Text> */}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setPpAccepted(!ppAccepted)}
          >
            <View
              style={[styles.checkbox, ppAccepted && styles.checkboxChecked]}
            >
              {ppAccepted && <Check color={Colors.white} size={16} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the <Text style={styles.link} onPress={openPrivacy}>Privacy Policy</Text>
              {/* I agree to the <Text style={styles.link}>Privacy Policy</Text> */}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Your Privacy Matters</Text>
          <Text style={styles.infoText}>
            • We encrypt your data at rest and in transit{"\n"}• You control
            your profile visibility{"\n"}• You can export or delete your data
            anytime{"\n"}• We never sell your personal information
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.primaryButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    gap: 16,
    alignItems: "center" as const,
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceLight,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 24,
  },
  consentSection: {
    gap: 16,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline" as const,
  },
  infoBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actions: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center" as const,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600" as const,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600" as const,
  },
});
