import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioButtonGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
}

export default function RadioButtonGroup({
  options,
  selectedValue,
  onValueChange,
  direction = 'vertical',
}: RadioButtonGroupProps) {
  return (
    <View style={[styles.container, direction === 'horizontal' && styles.horizontalContainer]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            selectedValue === option.value && styles.optionSelected,
          ]}
          onPress={() => onValueChange(option.value)}
        >
          <View style={styles.optionContent}>
            <View style={styles.textContent}>
              <Text style={[
                styles.optionLabel,
                selectedValue === option.value && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
              {option.description && (
                <Text style={[
                  styles.optionDescription,
                  selectedValue === option.value && styles.optionDescriptionSelected,
                ]}>
                  {option.description}
                </Text>
              )}
            </View>
            <View style={[
              styles.radioButton,
              selectedValue === option.value && styles.radioButtonSelected,
            ]}>
              {selectedValue === option.value && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  horizontalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.white,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  optionDescriptionSelected: {
    color: Colors.white,
    opacity: 0.9,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioButtonSelected: {
    borderColor: Colors.white,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },
});
