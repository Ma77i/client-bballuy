import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface TimePickerProps {
  value: string; // Format: "HH:MM"
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export default function TimePicker({ value, onValueChange, disabled = false }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleConfirm = () => {
    onValueChange(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, disabled && styles.containerDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Clock color={Colors.textMuted} size={20} />
        <Text style={styles.text}>{formatTime(value)}</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.overlay} onPress={handleCancel}>
          <View style={styles.picker}>
            <View style={styles.header}>
              <Text style={styles.title}>Select Time</Text>
            </View>
            
            <View style={styles.timeContainer}>
              <View style={styles.timeRow}>
                <Text style={styles.label}>Hour:</Text>
                <View style={styles.hourContainer}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 1;
                    const hourValue = hour === 12 ? '00' : hour.toString().padStart(2, '0');
                    return (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.timeButton,
                          tempValue.startsWith(hourValue) && styles.timeButtonSelected
                        ]}
                        onPress={() => setTempValue(`${hourValue}:${tempValue.split(':')[1]}`)}
                      >
                        <Text style={[
                          styles.timeButtonText,
                          tempValue.startsWith(hourValue) && styles.timeButtonTextSelected
                        ]}>
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              
              <View style={styles.timeRow}>
                <Text style={styles.label}>Minute:</Text>
                <View style={styles.minuteContainer}>
                  {Array.from({ length: 60 }, (_, i) => {
                    if (i % 15 !== 0) return null; // Only show 15-minute intervals
                    const minute = i.toString().padStart(2, '0');
                    return (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.timeButton,
                          tempValue.endsWith(minute) && styles.timeButtonSelected
                        ]}
                        onPress={() => setTempValue(`${tempValue.split(':')[0]}:${minute}`)}
                      >
                        <Text style={[
                          styles.timeButtonText,
                          tempValue.endsWith(minute) && styles.timeButtonTextSelected
                        ]}>
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              
              <View style={styles.timeRow}>
                <Text style={styles.label}>AM/PM:</Text>
                <View style={styles.ampmContainer}>
                  <TouchableOpacity
                    style={[
                      styles.timeButton,
                      !tempValue.includes('AM') && styles.timeButtonSelected
                    ]}
                    onPress={() => {
                      const [hours] = tempValue.split(':');
                      const hour = parseInt(hours);
                      const newHour = hour >= 12 ? hour - 12 : hour;
                      setTempValue(`${newHour.toString().padStart(2, '0')}:${tempValue.split(':')[1]}`);
                    }}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      !tempValue.includes('AM') && styles.timeButtonTextSelected
                    ]}>
                      PM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.timeButton,
                      tempValue.includes('AM') && styles.timeButtonSelected
                    ]}
                    onPress={() => {
                      const [hours] = tempValue.split(':');
                      const hour = parseInt(hours);
                      const newHour = hour < 12 ? hour : hour + 12;
                      setTempValue(`${newHour.toString().padStart(2, '0')}:${tempValue.split(':')[1]}`);
                    }}
                  >
                    <Text style={[
                      styles.timeButtonText,
                      tempValue.includes('AM') && styles.timeButtonTextSelected
                    ]}>
                      AM
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    minHeight: 44,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    margin: 20,
    maxHeight: 500,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  timeContainer: {
    padding: 20,
    gap: 20,
  },
  timeRow: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  hourContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minuteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ampmContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeButtonText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  timeButtonTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
});
