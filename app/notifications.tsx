import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import ToggleSwitch from '@/components/ui/toggle-switch';
import Dropdown from '@/components/ui/dropdown';
import TimePicker from '@/components/ui/time-picker';

interface NotificationSettings {
  doNotDisturb: {
    enabled: boolean;
    fromTime: string;
    toTime: string;
  };
  events: {
    newEventInvitations: boolean;
    eventReminders: boolean;
  };
  communication: {
    chatMessages: boolean;
  };
  teamsAndPlayers: {
    teamUpdates: boolean;
    playerStatistics: boolean;
  };
  advancedSettings: {
    notificationSound: string;
  };
}

const soundOptions = [
  { label: 'Default', value: 'default' },
  { label: 'None', value: 'none' },
  { label: 'Chime', value: 'chime' },
  { label: 'Bell', value: 'bell' },
  { label: 'Basketball', value: 'basketball' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    doNotDisturb: {
      enabled: false,
      fromTime: '22:00',
      toTime: '08:00',
    },
    events: {
      newEventInvitations: true,
      eventReminders: true,
    },
    communication: {
      chatMessages: true,
    },
    teamsAndPlayers: {
      teamUpdates: false,
      playerStatistics: true,
    },
    advancedSettings: {
      notificationSound: 'default',
    },
  });

  const updateSettings = (section: keyof NotificationSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const updateDoNotDisturbSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      doNotDisturb: {
        ...prev.doNotDisturb,
        [key]: value,
      },
    }));
  };

  const SettingCard = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.settingCard}>
      {children}
    </View>
  );

  const SettingRow = ({ 
    title, 
    description, 
    children 
  }: { 
    title: string; 
    description: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingControl}>
        {children}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Notifications',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft color={Colors.text} size={24} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Do Not Disturb Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Do Not Disturb</Text>
            <SettingCard>
              <SettingRow
                title="Do Not Disturb"
                description="Silence notifications during specific hours."
              >
                <ToggleSwitch
                  value={settings.doNotDisturb.enabled}
                  onValueChange={(value) => updateDoNotDisturbSettings('enabled', value)}
                />
              </SettingRow>
              
              {settings.doNotDisturb.enabled && (
                <>
                  <View style={styles.timeContainer}>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeLabel}>From</Text>
                      <TimePicker
                        value={settings.doNotDisturb.fromTime}
                        onValueChange={(value) => updateDoNotDisturbSettings('fromTime', value)}
                      />
                    </View>
                    <View style={styles.timeRow}>
                      <Text style={styles.timeLabel}>To</Text>
                      <TimePicker
                        value={settings.doNotDisturb.toTime}
                        onValueChange={(value) => updateDoNotDisturbSettings('toTime', value)}
                      />
                    </View>
                  </View>
                  <Text style={styles.infoText}>
                    You will not receive any notifications during the Do Not Disturb period. 
                    However, you will still see them in your notification center when the period ends.
                  </Text>
                </>
              )}
            </SettingCard>
          </View>

          {/* Events Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Events</Text>
            <SettingCard>
              <SettingRow
                title="New Event Invitations"
                description="Get notified when you are invited to a new game."
              >
                <ToggleSwitch
                  value={settings.events.newEventInvitations}
                  onValueChange={(value) => updateSettings('events', 'newEventInvitations', value)}
                />
              </SettingRow>
              
              <SettingRow
                title="Event Reminders"
                description="Reminders for your upcoming games."
              >
                <ToggleSwitch
                  value={settings.events.eventReminders}
                  onValueChange={(value) => updateSettings('events', 'eventReminders', value)}
                />
              </SettingRow>
            </SettingCard>
          </View>

          {/* Communication Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Communication</Text>
            <SettingCard>
              <SettingRow
                title="Chat Messages"
                description="Notifications for new messages in event chats."
              >
                <ToggleSwitch
                  value={settings.communication.chatMessages}
                  onValueChange={(value) => updateSettings('communication', 'chatMessages', value)}
                />
              </SettingRow>
            </SettingCard>
          </View>

          {/* Teams & Players Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Teams & Players</Text>
            <SettingCard>
              <SettingRow
                title="Team Updates"
                description="Roster changes, schedule updates, etc."
              >
                <ToggleSwitch
                  value={settings.teamsAndPlayers.teamUpdates}
                  onValueChange={(value) => updateSettings('teamsAndPlayers', 'teamUpdates', value)}
                />
              </SettingRow>
              
              <SettingRow
                title="Player Statistics"
                description="When friends achieve new milestones."
              >
                <ToggleSwitch
                  value={settings.teamsAndPlayers.playerStatistics}
                  onValueChange={(value) => updateSettings('teamsAndPlayers', 'playerStatistics', value)}
                />
              </SettingRow>
            </SettingCard>
          </View>

          {/* Advanced Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Settings</Text>
            <SettingCard>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Notification Sound</Text>
                </View>
                <View style={styles.settingControl}>
                  <Dropdown
                    options={soundOptions}
                    selectedValue={settings.advancedSettings.notificationSound}
                    onValueChange={(value) => updateSettings('advancedSettings', 'notificationSound', value)}
                    placeholder="Select sound"
                  />
                </View>
              </View>
            </SettingCard>
          </View>
        </View>
      </ScrollView>
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  timeContainer: {
    gap: 12,
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    minWidth: 40,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 8,
  },
});
