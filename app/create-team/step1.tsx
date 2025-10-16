/* eslint-disable @typescript-eslint/array-type */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTeamCreation } from '@/contexts/TeamCreationContext';
import { validateTeamDetails } from '@/lib/validation/team-creation';
import StepIndicator from '@/components/ui/step-indicator';
import ImagePicker from '@/components/ui/image-picker';
import Dropdown from '@/components/ui/dropdown';
import SearchInput from '@/components/ui/search-input';

const teamTypeOptions = [
  { label: 'Casual', value: 'Casual' },
  { label: 'Competitive', value: 'Competitive' },
];

export default function TeamDetailsStep() {
  const router = useRouter();
  const { data, updateTeamDetails, setCurrentStep, searchCourts, pickImageFromGallery, takePhoto, removeLogo } = useTeamCreation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [courtSearchResults, setCourtSearchResults] = useState<Array<{ id: string; name: string; address: string }>>([]);
  const [isSearchingCourts, setIsSearchingCourts] = useState(false);

  const handleNext = () => {
    const validation = validateTeamDetails(data.teamDetails);
    
    if (!validation.success) {
      const errorMap: Record<string, string> = {};
      validation.errors?.forEach(error => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
    setCurrentStep(2);
    router.push('/create-team/step2');
  };

  const handleCourtSearch = async (query: string) => {
    if (!query.trim()) {
      setCourtSearchResults([]);
      return;
    }

    setIsSearchingCourts(true);
    try {
      const results = await searchCourts(query);
      setCourtSearchResults(results);
    } catch (error) {
      console.error('Error searching courts:', error);
      setCourtSearchResults([]);
    } finally {
      setIsSearchingCourts(false);
    }
  };

  const handleCourtSelect = (court: { id: string; name: string; address: string }) => {
    updateTeamDetails({
      homeCourt: court.name,
      homeCourtId: court.id,
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Create Team',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StepIndicator 
          currentStep={1} 
          totalSteps={3}
          stepTitles={['Team Details', 'Invite Members', 'Review & Create']}
        />
        
        <View style={styles.content}>
          {/* Team Name */}
          <View style={styles.section}>
            <Text style={styles.label}>Team Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter team name"
              placeholderTextColor={Colors.textMuted}
              value={data.teamDetails.name}
              onChangeText={(text) => {
                updateTeamDetails({ name: text });
                if (errors.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Team Logo */}
          <View style={styles.section}>
            <ImagePicker
              imageUri={data.teamDetails.logoPreview}
              onPickFromGallery={pickImageFromGallery}
              onTakePhoto={takePhoto}
              onRemove={removeLogo}
            />
          </View>

          {/* Team Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Team Description/Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="A brief overview of your team"
              placeholderTextColor={Colors.textMuted}
              value={data.teamDetails.description}
              onChangeText={(text) => updateTeamDetails({ description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Team Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Team Type</Text>
            <Dropdown
              options={teamTypeOptions}
              selectedValue={data.teamDetails.type}
              onValueChange={(value) => updateTeamDetails({ type: value as 'Casual' | 'Competitive' })}
              placeholder="Select team type"
            />
          </View>

          {/* Home Court */}
          <View style={styles.section}>
            <Text style={styles.label}>Home Court (Optional)</Text>
            <SearchInput
              placeholder="Search for a court"
              searchResults={courtSearchResults.map(court => ({
                id: court.id,
                name: court.name,
                subtitle: court.address,
              }))}
              onSearch={handleCourtSearch}
              onSelectResult={(result) => {
                const court = courtSearchResults.find(c => c.id === result.id);
                if (court) {
                  handleCourtSelect(court);
                }
              }}
              isLoading={isSearchingCourts}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !data.teamDetails.name.trim() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!data.teamDetails.name.trim()}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
  },
  bottomContainer: {
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
