import Text from '@/components/AppText';
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SearchResult {
  id: string;
  name: string;
  subtitle?: string;
}

interface SearchInputProps {
  placeholder: string;
  searchResults: SearchResult[];
  onSearch: (query: string) => void;
  onSelectResult: (result: SearchResult) => void;
  isLoading?: boolean;
  showResults?: boolean;
  /** caracteres mínimos para disparar búsqueda (default 2) */
  minChars?: number;
  /** debounce en ms (default 300) */
  debounceMs?: number;
}

export default function SearchInput({
  placeholder,
  searchResults,
  onSearch,
  onSelectResult,
  isLoading = false,
  showResults = true,
  minChars = 2,
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Evita re-disparar onSearch con el mismo texto
  const lastSearchedRef = useRef<string>('');

  // Debounce de la búsqueda + guardas contra repeticiones
  useEffect(() => {
    const q = query.trim();
    const handle = setTimeout(() => {
      if (q.length >= minChars && q !== lastSearchedRef.current) {
        lastSearchedRef.current = q;
        onSearch(q);
        setDropdownOpen(true);
      } else if (q.length < minChars) {
        setDropdownOpen(false);
      }
    }, debounceMs);

    return () => clearTimeout(handle);
  }, [query, minChars, debounceMs, onSearch]);

  // Keep the dropdown open for loading, results and an explicit empty state.
  const shouldShowDropdown = showResults && query.trim().length >= minChars && dropdownOpen;

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result);
    setQuery(result.name);
    setDropdownOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setDropdownOpen(false);
    lastSearchedRef.current = '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Search color={Colors.textMuted} size={20} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            if (query.trim().length >= minChars) setDropdownOpen(true);
          }}
          // En web, onBlur puede cerrar el dropdown; lo demoramos un frame si hace click en un ítem
          onBlur={() => {
            setTimeout(() => setDropdownOpen(false), 120);
          }}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <X color={Colors.textMuted} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {shouldShowDropdown && (
        <View style={styles.resultsContainer}>
          {/* Estado de carga "sticky": solo si no hay resultados aún */}
          {isLoading && searchResults.length === 0 ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>Searching…</Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateText}>No results</Text>
            </View>
          ) : (
            <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.resultItem}
                  activeOpacity={0.85}
                  onPress={() => handleSelectResult(result)}
                >
                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    {result.subtitle && (
                      <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', zIndex: 1 },
  inputContainer: {
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
  input: { flex: 1, fontSize: 16, color: Colors.text },
  resultsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  results: { maxHeight: 240 },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultContent: { gap: 4 },
  resultName: { fontSize: 16, color: Colors.text, fontWeight: '500' },
  resultSubtitle: { fontSize: 14, color: Colors.textSecondary },
  stateContainer: { padding: 16, alignItems: 'center' },
  stateText: { fontSize: 14, color: Colors.textMuted },
});
