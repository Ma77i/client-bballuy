import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
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
}

export default function SearchInput({
  placeholder,
  searchResults,
  onSearch,
  onSelectResult,
  isLoading = false,
  showResults = true,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch(query);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result);
    setQuery(result.name);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
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
          onFocus={() => query.trim() && setShowDropdown(true)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <X color={Colors.textMuted} size={20} />
          </TouchableOpacity>
        )}
      </View>

      {showResults && showDropdown && searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.resultItem}
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
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
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
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
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
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  results: {
    maxHeight: 200,
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultContent: {
    gap: 4,
  },
  resultName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  resultSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
