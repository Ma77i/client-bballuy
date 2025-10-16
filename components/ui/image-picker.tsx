import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Upload, Camera, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface ImagePickerProps {
  imageUri: string | null;
  onPickFromGallery: () => Promise<void>;
  onTakePhoto: () => Promise<void>;
  onRemove?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ImagePicker({ 
  imageUri, 
  onPickFromGallery, 
  onTakePhoto, 
  onRemove,
  placeholder = "Upload Image",
  disabled = false
}: ImagePickerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePickFromGallery = async () => {
    if (disabled || isUploading) return;
    
    setIsUploading(true);
    try {
      await onPickFromGallery();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to pick image from gallery';
      Alert.alert('Error', message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (disabled || isUploading) return;
    
    setIsUploading(true);
    try {
      await onTakePhoto();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to take photo';
      Alert.alert('Error', message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (disabled || isUploading || !onRemove) return;
    onRemove();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Team Logo</Text>
      
      {imageUri ? (
        <View style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {onRemove && (
            <TouchableOpacity style={styles.removeButton} onPress={handleRemove} disabled={disabled || isUploading}>
              <X color={Colors.white} size={16} />
            </TouchableOpacity>
          )}
          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color={Colors.white} size="small" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, (disabled || isUploading) && styles.buttonDisabled]} 
          onPress={handlePickFromGallery}
          disabled={disabled || isUploading}
        >
          <Upload color={disabled || isUploading ? Colors.textMuted : Colors.primary} size={20} />
          <Text style={[styles.buttonText, (disabled || isUploading) && styles.buttonTextDisabled]}>
            Upload from Gallery
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, (disabled || isUploading) && styles.buttonDisabled]} 
          onPress={handleTakePhoto}
          disabled={disabled || isUploading}
        >
          <Camera color={disabled || isUploading ? Colors.textMuted : Colors.primary} size={20} />
          <Text style={[styles.buttonText, (disabled || isUploading) && styles.buttonTextDisabled]}>
            Take Photo
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.caption}>Images are stored securely. You can change this later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  buttonTextDisabled: {
    color: Colors.textMuted,
  },
  caption: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});