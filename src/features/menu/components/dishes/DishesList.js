// components/dishes/DishesList.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import DishItem from './DishItem';

const DishesList = ({ data }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => console.log('Dish selected:', item.name)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.sizes[0].price} جنيه</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => <DishItem dish={item} />}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default DishesList;
