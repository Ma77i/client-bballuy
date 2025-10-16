import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTeamCreation } from '@/contexts/TeamCreationContext';
import { useAuth } from '@/contexts/AuthContext';
import StepIndicator from '@/components/ui/step-indicator';
import AvatarGroup from '@/components/ui/avatar-group';

export default function ReviewCreateStep() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, setCurrentStep, createTeam, resetForm } = useTeamCreation();
  const [isCreating, setIsCreating] = useState(false);

  const handlePrevious = () => {
    setCurrentStep(2);
    router.push('/create-team/step2');
  };

  const handleCreateTeam = async () => {
    setIsCreating(true);
    
    try {
      const result = await createTeam();
      
      if (result.success) {
        Alert.alert(
          'Success!',
          'Your team has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetForm();
                router.push(`/team/${result.teamId}` as any);
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to create team. Please try again.');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const allMembers = user ? [{
    id: user.id,
    name: user.display_name || 'You',
    avatar_url: user.avatar_url,
  }] : [];

  const invitedMembers = data.invitedMembers.map(member => ({
    id: member.id,
    name: member.display_name,
    avatar_url: member.avatar_url,
  }));

  const rosterMembers = [...allMembers, ...invitedMembers];

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Create Team',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
              <ArrowLeft color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StepIndicator 
          currentStep={3} 
          totalSteps={3}
          stepTitles={['Team Details', 'Invite Members', 'Review & Create']}
        />
        
        <View style={styles.content}>
          {/* Team Identification Section */}
          <View style={styles.section}>
            <View style={styles.teamHeader}>
              <View style={styles.teamLogo}>
                {data.teamDetails.logoPreview ? (
                  <Image source={{ uri: data.teamDetails.logoPreview }} style={styles.logoImage} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Shield color={Colors.primary} size={24} />
                  </View>
                )}
              </View>
              
              <View style={styles.teamInfo}>
                <Text style={styles.label}>Team Name</Text>
                <Text style={styles.teamName}>{data.teamDetails.name}</Text>
                
                <Text style={styles.label}>Team Description</Text>
                <Text style={styles.teamDescription}>
                  {data.teamDetails.description || 'No description provided'}
                </Text>
              </View>
            </View>
          </View>

          {/* Team Attributes */}
          <View style={styles.section}>
            <View style={styles.attributesGrid}>
              <View style={styles.attributeCard}>
                <Text style={styles.attributeLabel}>Team Type</Text>
                <Text style={styles.attributeValue}>{data.teamDetails.type}</Text>
              </View>
              
              {data.teamDetails.homeCourt && (
                <View style={styles.attributeCard}>
                  <Text style={styles.attributeLabel}>Home Court</Text>
                  <Text style={styles.attributeValue}>{data.teamDetails.homeCourt}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Roster Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Roster</Text>
            <AvatarGroup avatars={rosterMembers} maxVisible={5} size={50} showCount={true} />
            
            {data.invitedMembers.length > 0 && (
              <View style={styles.invitedMembersList}>
                <Text style={styles.invitedMembersTitle}>Invited Members:</Text>
                {data.invitedMembers.map((member, index) => (
                  <Text key={member.id} style={styles.invitedMemberText}>
                    {member.display_name}{index < data.invitedMembers.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Team Privacy */}
          <View style={styles.section}>
            <View style={styles.privacyCard}>
              <Shield color={Colors.primary} size={20} />
              <Text style={styles.privacyText}>
                {data.privacy.isPublic ? 'Public Team' : 'Private Team'}
              </Text>
            </View>
            
            {data.privacy.requiresApproval && (
              <View style={styles.privacyNote}>
                <Text style={styles.privacyNoteText}>Requires admin approval to join</Text>
              </View>
            )}
            
            {data.privacy.minimumPlayers && (
              <View style={styles.privacyNote}>
                <Text style={styles.privacyNoteText}>
                  Minimum {data.privacy.minimumPlayers} players required
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.createButton, isCreating && styles.createButtonDisabled]}
          onPress={handleCreateTeam}
          disabled={isCreating}
        >
          {isCreating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.white} size="small" />
              <Text style={styles.createButtonText}>Creating Team...</Text>
            </View>
          ) : (
            <Text style={styles.createButtonText}>Create Team</Text>
          )}
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
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  teamHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  teamName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  teamDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  attributesGrid: {
    gap: 12,
  },
  attributeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  attributeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  invitedMembersList: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  invitedMembersTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  invitedMemberText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  privacyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  privacyNote: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  privacyNoteText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomContainer: {
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
