import Text from '@/components/AppText';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  calculatePasswordStrength,
} from "@/lib/utils/validation";
import Colors from "@/constants/colors";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitting = useRef(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmationPending, setConfirmationPending] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);

  const handleSignUp = async () => {
    if (submitting.current) return;
    setFormError(null);
    const nameValidation = validateDisplayName(displayName.trim());
    if (!nameValidation.valid) {
      setFormError(nameValidation.error ?? "Enter a valid name");
      return;
    }

    const emailValidation = validateEmail(email.trim());
    if (!emailValidation.valid) {
      setFormError(emailValidation.error ?? "Enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setFormError(passwordValidation.errors.join("\n"));
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    submitting.current = true;
    setIsLoading(true);
    try {
      const { error, requiresConfirmation } = await signUp(email, password, displayName);
      if (error) { setFormError(error.message); return; }
      if (requiresConfirmation) { setConfirmationPending(true); return; }
      router.replace('/splash');
    } catch {
      setFormError('Unable to finish setup. Try signing in to continue your account.');
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };



  if (confirmationPending) return (
    <View style={[styles.container, { padding: 24, justifyContent: 'center', gap: 24 }]}>
      <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>Follow the confirmation link, then return here and sign in. You do not need to register again.</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(auth)/signin')}>
        <Text style={styles.primaryButtonText}>Go to sign in</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <View style={styles.container}>
        <View style={{ paddingTop: 60 }} />
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the StreetHoops community</Text>
          </View>

          <View style={styles.form}>
            {formError && <Text accessibilityRole="alert" style={{ color: Colors.error }}>{formError}</Text>}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={Colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Min 10 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff color={Colors.textMuted} size={20} />
                  ) : (
                    <Eye color={Colors.textMuted} size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        { width: `${(passwordStrength.score / 7) * 100}%` },
                        passwordStrength.label === "weak" &&
                          styles.strengthWeak,
                        passwordStrength.label === "fair" &&
                          styles.strengthFair,
                        passwordStrength.label === "good" &&
                          styles.strengthGood,
                        passwordStrength.label === "strong" &&
                          styles.strengthStrong,
                      ]}
                    />
                  </View>
                  <Text style={styles.strengthLabel}>
                    Strength: {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={Colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    gap: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
  },
  eyeButton: {
    padding: 16,
  },
  strengthContainer: {
    gap: 6,
  },
  strengthBar: {
    height: 4,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    overflow: "hidden" as const,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthWeak: {
    backgroundColor: Colors.error,
  },
  strengthFair: {
    backgroundColor: Colors.warning,
  },
  strengthGood: {
    backgroundColor: Colors.primary,
  },
  strengthStrong: {
    backgroundColor: Colors.success,
  },
  strengthLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: "capitalize" as const,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center" as const,
    marginTop: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600" as const,
  },
  footer: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600" as const,
  },
  divider: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  oauthButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  oauthButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
