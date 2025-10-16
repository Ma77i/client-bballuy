import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { MapPin, Search, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import HeaderMenu from '@/components/HeaderMenu';
import { useNotifications, createSampleNotifications } from '@/contexts/NotificationContext';

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addNotification } = useNotifications();

  // Add sample notifications for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      createSampleNotifications(addNotification);
    }, 5000); // Add notifications after 5 seconds

    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Courts Near You', headerStyle: { backgroundColor: Colors.surface }, headerTintColor: Colors.text, headerRight: () => <HeaderMenu /> }} />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color={Colors.textMuted} size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a court"
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={Colors.text} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.mapPlaceholder}>
          <MapPin color={Colors.primary} size={48} />
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Courts will appear here{'\n'}(React Native Maps integration required)
          </Text>
        </View>

        <View style={styles.courtsListContainer}>
          <Text style={styles.sectionTitle}>Nearby Courts</Text>
          <ScrollView style={styles.courtsList}>
            {[
              { name: 'Golden Gate Park Court', distance: '0.5 mi', players: 12, rating: 4.5 },
              { name: 'Mission Rec Center', distance: '1.2 mi', players: 8, rating: 4.8 },
              { name: 'Dolores Park Courts', distance: '1.8 mi', players: 15, rating: 4.2 },
            ].map((court, index) => (
              <TouchableOpacity key={index} style={styles.courtCard}>
                <View style={styles.courtInfo}>
                  <Text style={styles.courtName}>{court.name}</Text>
                  <Text style={styles.courtDetails}>
                    {court.distance} • {court.players} players • ⭐ {court.rating}
                  </Text>
                </View>
                <View style={styles.courtAction}>
                  <Text style={styles.viewButton}>View</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  searchContainer: {
    flexDirection: 'row' as const,
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: Colors.surface,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center' as const,
  },
  courtsListContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  courtsList: {
    flex: 1,
  },
  courtCard: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center' as const,
  },
  courtInfo: {
    flex: 1,
    gap: 4,
  },
  courtName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  courtDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  courtAction: {
    paddingLeft: 16,
  },
  viewButton: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
