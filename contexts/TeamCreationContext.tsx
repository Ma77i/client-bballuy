/* eslint-disable @typescript-eslint/array-type */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/backend/supabase';
import type { TablesInsert } from '@/lib/backend/database.types';

export interface TeamDetails {
  name: string;
  logoPreview: string | null; // signed URL para UI
  logoPath: string | null;    // ruta en Storage para guardar en DB
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
  email?: string; // opcional si no lo traés de DB
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
  searchCourts: (query: string) => Promise<Array<{ id: string; name: string }>>;
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

// ---------- Helpers de imagen / storage ----------

const uploadImageAsync = async (localUri: string): Promise<{ path: string; signedUrl: string }> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Obtener blob (en web funciona directo; en nativo, si falla, cambiar a expo-file-system)
  const response = await fetch(localUri);
  const blob = await response.blob();

  // Validaciones
  if (blob.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }
  if (!blob.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Ruta en Storage: <uid>/<timestamp>.<ext>
  const timestamp = Date.now();
  const extension = (blob.type.split('/')[1] || 'jpg').toLowerCase();
  const storagePath = `${user.id}/${timestamp}.${extension}`;

  // Subir al bucket team_logos (RLS: primer segmento = auth.uid())
  const { error: uploadError } = await supabase.storage
    .from('team_logos')
    .upload(storagePath, blob, {
      contentType: blob.type,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // URL firmada para previsualizar
  const { data: signedData, error: signedError } = await supabase.storage
    .from('team_logos')
    .createSignedUrl(storagePath, 3600);

  if (signedError || !signedData) throw signedError || new Error('Failed to generate signed URL');

  return {
    path: `team_logos/${storagePath}`, // esto guardás en DB
    signedUrl: signedData.signedUrl,   // esto mostrás en UI
  };
};

const revokePreviousIfNeeded = async (prevPath?: string) => {
  if (!prevPath || !prevPath.startsWith('team_logos/')) return;
  const relativePath = prevPath.replace('team_logos/', '');

  try {
    await supabase.storage.from('team_logos').remove([relativePath]);
  } catch (error) {
    console.warn('Failed to remove previous image:', error);
    // No cortamos el flujo si falla el borrado
  }
};

// ---------- Provider ----------

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

        await revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);

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

        await revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);

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
    revokePreviousIfNeeded(data.teamDetails.logoPath || undefined);
    updateTeamDetails({ logoPreview: null, logoPath: null });
  };

  const searchCourts = async (query: string) => {
    try {
      if (!query.trim()) return [];

      const { data: courts, error } = await supabase
        .from('courts')
        .select('id, name') // columnas que existen
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
        .select('id, display_name, avatar_url') // email no está en users_public
        .ilike('display_name', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return (users || []) as InvitedMember[];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const createTeam = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      console.log('current user id:', user.id);

      // 1) Crear team y pedir sólo id (evita SELECT completo con RLS extra)
      const { data: teamRow, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: data.teamDetails.name,
          description: data.teamDetails.description,
          type: data.teamDetails.type,
          home_court_id: data.teamDetails.homeCourtId,
          captain_id: user.id, // requerido por policy INSERT
          is_public: data.privacy.isPublic,
          requires_approval: data.privacy.requiresApproval,
          minimum_players: data.privacy.minimumPlayers,
          logo_url: data.teamDetails.logoPath, // guardamos la ruta de storage
        })
        .select('id')
        .single();

      if (teamError) throw teamError;
      const teamId = teamRow!.id;

      // 2) Agregar current user como capitán (coincidir enum app_role)
      const { error: captainError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'team_captain', // 👈 si usás enum app_role
          status: 'active',      // quitalo si tu tabla no tiene esta columna
        });

      if (captainError) throw captainError;

      // 3) Agregar invitados (como 'player')
      if (data.invitedMembers.length > 0) {
        const memberInserts: TablesInsert<'team_members'>[] = data.invitedMembers.map(m => ({
          team_id: teamId,
          user_id: m.id,
          role: 'player',
          status: 'pending'
        }));

        const { error: membersError } = await supabase
          .from('team_members')
          .insert(memberInserts);

        if (membersError) throw membersError;
      }

      return { success: true, teamId };
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
