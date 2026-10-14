import EntryFrame from '@/components/entry/EntryFrame';
import { Button, Field, Notice } from '@/components/foundation/Primitives';
import { errorText } from '@/components/pickup/error-copy';
import Text from '@/components/AppText';

import { useRouter } from "expo-router";
import { useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateDisplayName,
  calculatePasswordStrength,
} from "@/lib/utils/validation";



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



  if (confirmationPending) return <EntryFrame title="REVISÁ TU CORREO" description="Abrí el enlace de confirmación y después iniciá sesión. No necesitás registrarte otra vez.">
    <Button label="Ir a iniciar sesión" onPress={() => router.replace('/(auth)/signin')} />
  </EntryFrame>;
  return <EntryFrame title="CREÁ TU CUENTA" description="Encontrá canchas y convocatorias para jugar.">
    {formError && <Notice>{errorText(formError)}</Notice>}
    <Field label="Nombre visible" placeholder="Tu nombre" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" />
    <Field label="Correo electrónico" placeholder="tu@correo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
    <Field label="Contraseña" placeholder="Creá tu contraseña" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" autoComplete="new-password" />
    <Button secondary label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onPress={() => setShowPassword(!showPassword)} />
    {password.length > 0 && <Text variant="caption" tone="dark">Seguridad: {{weak:'Baja',fair:'Media',good:'Buena',strong:'Alta'}[passwordStrength.label]}</Text>}
    <Field label="Confirmar contraseña" placeholder="Repetí tu contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} autoCapitalize="none" />
    <Button label="Crear cuenta" busy={isLoading} onPress={() => void handleSignUp()} />
    <Button secondary label="Ya tengo cuenta: iniciar sesión" onPress={() => router.push('/(auth)/signin')} />
  </EntryFrame>;
}
