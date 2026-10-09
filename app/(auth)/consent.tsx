import Text from '@/components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Shield, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveDevelopmentConsent } from '@/lib/auth/consent';

export default function ConsentScreen() {
  const router = useRouter();
  const [tosAccepted, setTosAccepted] = useState<boolean>(false);
  const [ppAccepted, setPpAccepted] = useState<boolean>(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const canContinue = tosAccepted && ppAccepted && !saving;

  const handleContinue = async () => {
    if (!canContinue || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setError(null);
    try {
      await saveDevelopmentConsent(AsyncStorage, tosAccepted, ppAccepted);
      router.push("/signup");
    } catch {
      setError('Unable to save your acknowledgements. Please retry.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  };
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
            Development preview: the terms and privacy notices are provisional.
            Approved policies are not available in this version.
          </Text>
        </View>

        <View style={styles.consentSection}>
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityLabel="Acknowledge development terms"
            aria-checked={tosAccepted}
            accessibilityState={{ checked: tosAccepted, disabled: saving }}
            disabled={saving}
            style={styles.checkboxRow}
            onPress={() => setTosAccepted(!tosAccepted)}
          >
            <View
              style={[styles.checkbox, tosAccepted && styles.checkboxChecked]}
            >
              {tosAccepted && <Check color={Colors.white} size={16} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I understand this is a development preview with provisional terms.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityLabel="Acknowledge development privacy notice"
            aria-checked={ppAccepted}
            accessibilityState={{ checked: ppAccepted, disabled: saving }}
            disabled={saving}
            style={styles.checkboxRow}
            onPress={() => setPpAccepted(!ppAccepted)}
          >
            <View
              style={[styles.checkbox, ppAccepted && styles.checkboxChecked]}
            >
              {ppAccepted && <Check color={Colors.white} size={16} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I understand the privacy notice is provisional and will use test information.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>For development testing</Text>
          <Text style={styles.infoText}>
            Use test information when trying this preview. These acknowledgements
            are recorded for the test flow; they are not acceptance of finalized
            legal policies. Public registration requires approved policies first.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        {error && <Text accessibilityRole="alert" style={styles.infoText}>{error}</Text>}
        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.primaryButton, !canContinue && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : error ? 'Retry' : 'Continue'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          disabled={saving}
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
