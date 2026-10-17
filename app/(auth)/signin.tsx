import EntryFrame from '@/components/entry/EntryFrame';
import { Button, Field, Notice } from '@/components/foundation/Primitives';
import { errorText } from '@/components/pickup/error-copy';

import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/lib/utils/validation';



export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const submitting = useRef(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (submitting.current) return;
    setFormError(null);
    const emailValidation = validateEmail(email.trim());
    if (!emailValidation.valid) {
      setFormError(emailValidation.error ?? 'Enter a valid email address');
      return;
    }

    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    submitting.current = true;
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) setFormError(error.message);
      else router.replace('/splash');
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };



  return <EntryFrame title="VOLVÉ A LA CANCHA" description="Iniciá sesión para seguir jugando.">
    {formError && <Notice>{errorText(formError)}</Notice>}
    <Field label="Correo electrónico" placeholder="tu@correo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" />
    <Field label="Contraseña" placeholder="Ingresá tu contraseña" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} passwordVisibility={{ visible: showPassword, onToggle: () => setShowPassword(value => !value) }} autoCapitalize="none" autoComplete="current-password" />
    <Button label="Iniciar sesión" busy={isLoading} onPress={() => void handleSignIn()} />
    <Button secondary label="Crear una cuenta" onPress={() => router.push('/(auth)/age-gate')} />
  </EntryFrame>;
}
