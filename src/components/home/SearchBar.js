// components/FakeSearchBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchBar = ({navigation}) => {
  return (
    <TouchableOpacity style={styles.container} 
    onPress={() => navigation.navigate('SearchScreen')}
    >
      <MaterialIcons name="search" size={20} color="#666" />
      <Text style={styles.placeholder}>ابحث عن مطعم أو وجبة...</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  placeholder: {
    color: '#999',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SearchBar;
