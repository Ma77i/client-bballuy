import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Colors from '@/constants/colors';

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ value, onValueChange, disabled = false }: ToggleSwitchProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        value && styles.containerActive,
        disabled && styles.containerDisabled,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View
        style={[
          styles.circle,
          value && styles.circleActive,
          disabled && styles.circleDisabled,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  containerActive: {
    backgroundColor: Colors.primary,
  },
  containerDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  circleActive: {
    alignSelf: 'flex-end',
  },
  circleDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
