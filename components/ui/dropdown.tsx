import Text from '@/components/AppText';
import { useRef, useState, type KeyboardEvent } from 'react';
import { AccessibilityInfo, Platform, View, ScrollView, StyleSheet, Modal, Pressable, useWindowDimensions } from 'react-native';
import { Check, ChevronDown, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { palette, spacing } from '@/constants/design';
import { Button } from '@/components/foundation/Primitives';
import { usePresentationMotion } from '@/components/foundation/PresentationProvider';

interface DropdownOption { label: string; value: string }
interface DropdownProps {
  options: DropdownOption[]; selectedValue: string; onValueChange(value: string): void;
  placeholder?: string; disabled?: boolean; label?: string; arcade?: boolean;
}
export default function Dropdown({ options, selectedValue, onValueChange, placeholder = 'Select an option', disabled = false, label, arcade = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const trigger = useRef<View>(null), heading = useRef<View>(null);
  const { height } = useWindowDimensions();
  const { reduced } = usePresentationMotion();
  const selectedOption = options.find(option => option.value === selectedValue);
  function restoreFocus() {
    if (Platform.OS === 'web') trigger.current?.focus();
    else if (trigger.current) AccessibilityInfo.sendAccessibilityEvent(trigger.current, 'focus');
  }
  function close() { setIsOpen(false); if (Platform.OS === 'web') requestAnimationFrame(restoreFocus); }
  function select(value: string) { onValueChange(value); close(); }
  const keyboard = Platform.OS === 'web' ? { onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== ' ' || !(event.target instanceof HTMLElement)) return;
    const targetLabel = event.target.closest('[role="radio"]')?.getAttribute('aria-label');
    const option = options.find(option => option.label === targetLabel);
    if (option) { event.preventDefault(); if (!event.repeat) select(option.value); }
  } } : {};
  const optionRows = options.map((option, index) => <Pressable key={option.value} accessibilityRole="radio" accessibilityLabel={option.label}
    accessibilityState={{ checked: option.value === selectedValue }} aria-checked={option.value === selectedValue}
    style={({pressed}) => [styles.option, option.value === selectedValue && styles.optionSelected, index === 0 && styles.optionFirst,
      index === options.length - 1 && styles.optionLast, arcade && { minHeight: 48, padding: spacing.md, flexDirection: 'row', gap: spacing.sm, alignItems: 'center',
        backgroundColor: option.value === selectedValue ? palette.orange : palette.cream, borderBottomColor: palette.muted }, pressed && {opacity:.85}]}
    onPress={() => select(option.value)}>
    <Text style={[styles.optionText, option.value === selectedValue && styles.optionTextSelected, arcade && {color:palette.navy,flex:1}]}>{option.label}</Text>
    {arcade && option.value === selectedValue && <Check size={20} color={palette.navy} aria-hidden />}
  </Pressable>);
  return <View style={{gap:4}}>
    {label && <Text variant="caption" style={{color:palette.muted}}>{label}</Text>}
    <Pressable ref={trigger} accessibilityRole="button" accessibilityLabel={label ? label + ': ' + (selectedOption?.label ?? placeholder) : selectedOption?.label ?? placeholder}
      accessibilityState={{ disabled, expanded: isOpen }} aria-expanded={isOpen} disabled={disabled}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} onPress={()=>setIsOpen(true)}
      style={({pressed})=>[styles.container, disabled && styles.containerDisabled,
        arcade && {backgroundColor:palette.cream,borderColor:palette.cream,borderRadius:12,minHeight:48,paddingHorizontal:12,gap:8},
        pressed && {opacity:.85}, focused && {outlineColor:palette.orange,outlineWidth:3,outlineOffset:2,outlineStyle:'solid'}]}>
      <Text style={[styles.text, selectedOption ? styles.textSelected : styles.textPlaceholder,arcade && {color:palette.navy,fontSize:14}]}>{selectedOption ? selectedOption.label : placeholder}</Text>
      <ChevronDown color={arcade ? palette.navy : Colors.textMuted} size={20} aria-hidden />
    </Pressable>
    <Modal visible={isOpen} transparent animationType={arcade && reduced ? 'none' : 'fade'} onRequestClose={close} onDismiss={restoreFocus}
      onShow={()=>{ if(Platform.OS === 'web') heading.current?.focus(); else if(heading.current) AccessibilityInfo.sendAccessibilityEvent(heading.current,'focus'); }}>
      <Pressable style={styles.overlay} onPress={close} accessible={false}>
        <View {...keyboard} accessibilityViewIsModal style={[styles.dropdown,arcade && {backgroundColor:palette.cream,maxHeight:height*.7,width:'88%',maxWidth:440}]} onStartShouldSetResponder={()=>true}>
          {arcade && <View style={{padding:spacing.md,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <View ref={heading} tabIndex={Platform.OS === 'web' ? -1 : undefined} accessible accessibilityRole="header" accessibilityLabel={label}>
              <Text variant="display" tone="light" style={{fontSize:26,lineHeight:32}}>{label}</Text>
            </View>
            <Button quiet iconOnly tone="light" label={'Cerrar selector de ' + label?.toLocaleLowerCase('es')} icon={<X size={22} color={palette.navy} />} onPress={close} />
          </View>}
          {arcade ? <ScrollView keyboardShouldPersistTaps="handled" style={{flexGrow:0}}>{optionRows}</ScrollView> : optionRows}
        </View>
      </Pressable>
    </Modal>
  </View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    flex: 1,
  },
  textSelected: {
    color: Colors.text,
  },
  textPlaceholder: {
    color: Colors.textMuted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    margin: 20,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: 0,
  },
  optionSelected: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});


