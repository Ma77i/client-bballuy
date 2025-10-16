import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Link } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useTeamCreation, InvitedMember } from '@/contexts/TeamCreationContext';
import { useAuth } from '@/contexts/AuthContext';
import StepIndicator from '@/components/ui/step-indicator';
import SearchInput from '@/components/ui/search-input';
import RadioButtonGroup from '@/components/ui/radio-button';
import ToggleSwitch from '@/components/ui/toggle-switch';
import Dropdown from '@/components/ui/dropdown';
import AvatarGroup from '@/components/ui/avatar-group';

const privacyOptions = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can find and join the team.',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only people with an invite can join.',
  },
];

const minimumPlayersOptions = [
  { label: '2 players', value: '2' },
  { label: '3 players', value: '3' },
  { label: '4 players', value: '4' },
  { label: '5 players', value: '5' },
  { label: '6 players', value: '6' },
  { label: '8 players', value: '8' },
  { label: '10 players', value: '10' },
];

export default function InviteMembersStep() {
  const router = useRouter();
  const { user } = useAuth();
  const { data, updateInvitedMembers, updatePrivacy, setCurrentStep, searchUsers } = useTeamCreation();
  const [searchResults, setSearchResults] = useState<InvitedMember[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  // Add current user to roster for display
  const currentRoster = user ? [{
    id: user.id,
    name: user.display_name || 'You',
    avatar_url: user.avatar_url,
  }] : [];

  const handlePrevious = () => {
    setCurrentStep(1);
    router.push('/create-team/step1');
  };

  const handleNext = () => {
    setCurrentStep(3);
    router.push('/create-team/step3');
  };

  const handleUserSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearchingUsers(true);
    try {
      const results = await searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleUserSelect = (user: InvitedMember) => {
    const isAlreadyAdded = data.invitedMembers.some(member => member.id === user.id);
    if (!isAlreadyAdded) {
      updateInvitedMembers([...data.invitedMembers, user]);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    updateInvitedMembers(data.invitedMembers.filter(member => member.id !== memberId));
  };

  const handleCopyInviteLink = async () => {
    try {
      // Generate invite link (in real app, this would use the actual team ID)
      const inviteLink = `https://yourapp.com/join-team/invite-123`;
      await Clipboard.setStringAsync(inviteLink);
      Alert.alert('Success', 'Invite link copied to clipboard!');
    } catch (error) {
      console.error('Error copying invite link:', error);
      Alert.alert('Error', 'Failed to copy invite link');
    }
  };

  const handlePrivacyChange = (value: string) => {
    updatePrivacy({ isPublic: value === 'public' });
  };

  const handleMinimumPlayersChange = (value: string) => {
    updatePrivacy({ minimumPlayers: parseInt(value) });
  };

  const allMembers = [...currentRoster, ...data.invitedMembers.map(member => ({
    id: member.id,
    name: member.display_name,
    avatar_url: member.avatar_url,
  }))];

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
          currentStep={2} 
          totalSteps={3}
          stepTitles={['Team Details', 'Invite Members', 'Review & Create']}
        />
        
        <View style={styles.content}>
          {/* Invite Members Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Invite Members</Text>
            
            <SearchInput
              placeholder="Search for users"
              searchResults={searchResults.map(user => ({
                id: user.id,
                name: user.display_name,
                subtitle: user.email,
              }))}
              onSearch={handleUserSearch}
              onSelectResult={(result) => {
                const user = searchResults.find(u => u.id === result.id);
                if (user) {
                  handleUserSelect(user);
                }
              }}
              isLoading={isSearchingUsers}
            />
            
            <View style={styles.orContainer}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            
            <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyInviteLink}>
              <Link color={Colors.white} size={20} />
              <Text style={styles.copyLinkText}>Copy Invite Link</Text>
            </TouchableOpacity>
          </View>

          {/* Current Roster Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Roster</Text>
            <AvatarGroup avatars={allMembers} maxVisible={3} size={50} showCount={true} />
            
            {data.invitedMembers.length > 0 && (
              <View style={styles.invitedMembers}>
                {data.invitedMembers.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberInfo}>
                      <View style={styles.memberAvatar}>
                        {member.avatar_url ? (
                          <Text>Avatar</Text>
                        ) : (
                          <Text style={styles.memberInitial}>
                            {member.display_name.charAt(0).toUpperCase()}
                          </Text>
                        )}
                      </View>
                      <View>
                        <Text style={styles.memberName}>{member.display_name}</Text>
                        <Text style={styles.memberEmail}>{member.email}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveMember(member.id)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Team Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Team Privacy</Text>
            
            <RadioButtonGroup
              options={privacyOptions}
              selectedValue={data.privacy.isPublic ? 'public' : 'private'}
              onValueChange={handlePrivacyChange}
            />
            
            <View style={styles.privacyOption}>
              <View style={styles.privacyOptionContent}>
                <Text style={styles.privacyOptionText}>Requires Admin Approval to Join</Text>
                <ToggleSwitch
                  value={data.privacy.requiresApproval}
                  onValueChange={(value) => updatePrivacy({ requiresApproval: value })}
                />
              </View>
            </View>
            
            <View style={styles.minimumPlayersContainer}>
              <Text style={styles.label}>Minimum Players Required (Optional)</Text>
              <Dropdown
                options={minimumPlayersOptions}
                selectedValue={data.privacy.minimumPlayers?.toString() || ''}
                onValueChange={handleMinimumPlayersChange}
                placeholder="Select minimum players"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>Previous</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  copyLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  copyLinkText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  invitedMembers: {
    gap: 12,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  memberEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.error,
    borderRadius: 6,
  },
  removeButtonText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  privacyOption: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
  },
  privacyOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyOptionText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  minimumPlayersContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  bottomContainer: {
    padding: 24,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previousButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
