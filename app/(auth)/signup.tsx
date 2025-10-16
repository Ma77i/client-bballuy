import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/backend/supabase";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithOAuth } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const passwordStrength = calculatePasswordStrength(password);

  const handleSignUp = async () => {
    const nameValidation = validateDisplayName(displayName);
    if (!nameValidation.valid) {
      Alert.alert("Invalid Name", nameValidation.error);
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      Alert.alert("Invalid Email", emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      Alert.alert("Invalid Password", passwordValidation.errors.join("\n"));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    const { data, error } = await signUp(email, password, displayName);
    setIsLoading(false);

    if (error) {
      Alert.alert("Sign Up Failed", error.message);
      return;
    }

    const userId = data?.user?.id;
    if (userId) {
      await syncPendingConsent(userId);
    }

    Alert.alert(
      "Success",
      "Account created successfully! Let’s finish setting up your profile.",
      [
        {
          text: "Continue",
          onPress: () => router.replace("/profile-setup"),
        },
      ]
    );
    // else {
    //       Alert.alert('Success', 'Account created! Please check your email to verify your account.', [
    //         { text: 'OK', onPress: () => router.replace('/(auth)/signin') },
    //       ]);
    //     }
  };

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    const { error } = await signInWithOAuth(provider);
    if (error) {
      Alert.alert("OAuth Failed", error.message);
    }
  };

  async function syncPendingConsent(userId: string) {
    try {
      const pending = await AsyncStorage.getItem("pendingConsent");
      if (!pending) return;

      const parsed = JSON.parse(pending);
      const { version, acceptedAt } = parsed;

      const { error } = await supabase.from("user_consents").upsert({
        user_id: userId,
        tos_version: version,
        privacy_version: version,
        accepted_at: acceptedAt,
        source: "app",
      });

      if (error) {
        console.error("Error syncing consent:", error);
      } else {
        await AsyncStorage.removeItem("pendingConsent");
      }
    } catch (err) {
      console.error("Unexpected error syncing consent:", err);
    }
  }

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

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuth("google")}
            >
              <Text style={styles.oauthButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuth("apple")}
            >
              <Text style={styles.oauthButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.oauthButton}
              onPress={() => handleOAuth("facebook")}
            >
              <Text style={styles.oauthButtonText}>Continue with Facebook</Text>
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
