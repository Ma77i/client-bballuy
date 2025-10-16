/* eslint-disable @typescript-eslint/array-type */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/backend/supabase';

export interface TeamDetails {
  name: string;
  logoPreview: string | null; // signed URL for UI
  logoPath: string | null;    // storage path to persist in DB
  description: string;
  type: 'Casual' | 'Competitive';
  homeCourt: string | null;
  homeCourtId: string | null;
}

export interface TeamPrivacy {
  isPublic: boolean;
  requiresApproval: boolean;
  minimumPlayers: number | null;
}

export interface InvitedMember {
  id: string;
  display_name: string;
  avatar_url: string | null;
  email: string;
}

export interface TeamCreationData {
  teamDetails: TeamDetails;
  invitedMembers: InvitedMember[];
  privacy: TeamPrivacy;
}

interface TeamCreationContextType {
  currentStep: number;
  data: TeamCreationData;
  setCurrentStep: (step: number) => void;
  updateTeamDetails: (details: Partial<TeamDetails>) => void;
  updateInvitedMembers: (members: InvitedMember[]) => void;
  updatePrivacy: (privacy: Partial<TeamPrivacy>) => void;
  pickImageFromGallery: () => Promise<void>;
  takePhoto: () => Promise<void>;
  removeLogo: () => void;
  searchCourts: (query: string) => Promise<Array<{ id: string; name: string; address: string }>>;
  searchUsers: (query: string) => Promise<InvitedMember[]>;
  createTeam: () => Promise<{ success: boolean; teamId?: string; error?: string }>;
  resetForm: () => void;
}

const initialData: TeamCreationData = {
  teamDetails: {
    name: '',
    logoPreview: null,
    logoPath: null,
    description: '',
    type: 'Casual',
    homeCourt: null,
    homeCourtId: null,
  },
  invitedMembers: [],
  privacy: {
    isPublic: true,
    requiresApproval: false,
    minimumPlayers: null,
  },
};

const TeamCreationContext = createContext<TeamCreationContextType | undefined>(undefined);

// Utility functions for image upload
const uploadImageAsync = async (localUri: string): Promise<{ path: string; signedUrl: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch the file and get blob
  const response = await fetch(localUri);
  const blob = await response.blob();
  
  // Check file size (5MB limit)
  if (blob.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  // Check if it's an image
  if (!blob.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Generate storage path
  const timestamp = Date.now();
  const extension = blob.type.split('/')[1] || 'jpg';
  const storagePath = `${user.id}/${timestamp}.${extension}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('team_logos')
    .upload(storagePath, blob, {
      contentType: blob.type,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Generate signed URL
  const { data: signedData, error: signedError } = await supabase.storage
    .from('team_logos')
    .createSignedUrl(storagePath, 3600); // 1 hour TTL

  if (signedError || !signedData) throw signedError || new Error('Failed to generate signed URL');

  return {
    path: `team_logos/${storagePath}`,
    signedUrl: signedData.signedUrl,
  };
};

const revokePreviousIfNeeded = async (prevPath?: string) => {
  if (!prevPath || !prevPath.startsWith('team_logos/')) return;
  
  const relativePath = prevPath.replace('team_logos/', '');
  
  try {
    await supabase.storage.from('team_logos').remove([relativePath]);
  } catch (error) {
    console.warn('Failed to remove previous image:', error);
    // Don't throw - this is not critical
  }
};

export function TeamCreationProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<TeamCreationData>(initialData);

  const updateTeamDetails = (details: Partial<TeamDetails>) => {
    setData(prev => ({
      ...prev,
      teamDetails: { ...prev.teamDetails, ...details },
    }));
  };

  const updateInvitedMembers = (members: InvitedMember[]) => {
    setData(prev => ({
      ...prev,
      invitedMembers: members,
    }));
  };

  const updatePrivacy = (privacy: Partial<TeamPrivacy>) => {
    setData(prev => ({
      ...prev,
      privacy: { ...prev.privacy, ...privacy },
    }));
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access media library was denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const localUri = result.assets[0].uri;
        
        // Revoke previous image if exists
        await revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);
        
        // Upload new image
        const { path, signedUrl } = await uploadImageAsync(localUri);
        
        updateTeamDetails({ 
          logoPreview: signedUrl,
          logoPath: path,
        });
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      throw error;
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access camera was denied');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const localUri = result.assets[0].uri;
        
        // Revoke previous image if exists
        await revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);
        
        // Upload new image
        const { path, signedUrl } = await uploadImageAsync(localUri);
        
        updateTeamDetails({ 
          logoPreview: signedUrl,
          logoPath: path,
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  };

  const removeLogo = () => {
    // Optionally revoke previous image
    revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);
    
    updateTeamDetails({
      logoPreview: null,
      logoPath: null,
    });
  };

  const searchCourts = async (query: string) => {
    try {
      if (!query.trim()) return [];

      const { data: courts, error } = await supabase
        .from('courts')
        .select('id, name, address')
        .ilike('name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return courts || [];
    } catch (error) {
      console.error('Error searching courts:', error);
      return [];
    }
  };

  const searchUsers = async (query: string) => {
    try {
      if (!query.trim()) return [];

      const { data: users, error } = await supabase
        .from('users_public')
        .select('id, display_name, avatar_url, email')
        .or(`display_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return users || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const createTeam = async () => {
    try {
      // Get current user first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
        console.log('current user id:', user?.id);
      // Create team in database
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: data.teamDetails.name,
          description: data.teamDetails.description,
          type: data.teamDetails.type,
          home_court_id: data.teamDetails.homeCourtId,
          captain_id: user.id, // Set the creator as captain
          is_public: data.privacy.isPublic,
          requires_approval: data.privacy.requiresApproval,
          minimum_players: data.privacy.minimumPlayers,
          logo_url: data.teamDetails.logoPath, // Store the storage path
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add current user as captain
      const { error: captainError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'captain',
          status: 'active',
        });

      if (captainError) throw captainError;

      // Add invited members
      if (data.invitedMembers.length > 0) {
        const memberInserts = data.invitedMembers.map(member => ({
          team_id: team.id,
          user_id: member.id,
          role: 'member',
          status: 'pending',
        }));

        const { error: membersError } = await supabase
          .from('team_members')
          .insert(memberInserts);

        if (membersError) throw membersError;
      }

      return { success: true, teamId: team.id };
    } catch (error) {
      console.error('Error creating team:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const resetForm = () => {
    setData(initialData);
    setCurrentStep(1);
  };

  return (
    <TeamCreationContext.Provider
      value={{
        currentStep,
        data,
        setCurrentStep,
        updateTeamDetails,
        updateInvitedMembers,
        updatePrivacy,
        pickImageFromGallery,
        takePhoto,
        removeLogo,
        searchCourts,
        searchUsers,
        createTeam,
        resetForm,
      }}
    >
      {children}
    </TeamCreationContext.Provider>
  );
}

export function useTeamCreation() {
  const context = useContext(TeamCreationContext);
  if (context === undefined) {
    throw new Error('useTeamCreation must be used within a TeamCreationProvider');
  }
  return context;
}
