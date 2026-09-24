import { useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import type { CourtMapProps } from './types';
import { catalogRegion } from '@/lib/courts/catalog';
export default function CourtMap({ courts, location, onSelect }: CourtMapProps) {
  const map = useRef<MapView>(null);
  const region = catalogRegion(courts);
  useEffect(() => {
    if (location) map.current?.animateToRegion({ ...location, latitudeDelta: 0.015, longitudeDelta: 0.015 });
  }, [location]);
  return <MapView ref={map} style={{ height: 280, width: '100%' }} initialRegion={region}
    accessibilityLabel="Court map" onMapReady={() => map.current?.animateToRegion(location ? { ...location, latitudeDelta: 0.015, longitudeDelta: 0.015 } : region)}>
    {courts.map(court => <Marker key={court.id} identifier={court.id} coordinate={court}
      title={court.name} accessibilityLabel={`Open ${court.name}`} onPress={() => onSelect(court.id)} />)}
    {location && <Marker coordinate={location} title="Your location" pinColor="blue" />}
  </MapView>;
}
