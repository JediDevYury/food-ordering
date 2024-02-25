import React from 'react';

import {FlatList, Platform, View} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {useCartContext} from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";

const CartScreen = () => {
  const { items } = useCartContext();

  return (
   <View>
     <FlatList
       data={items}
       renderItem={({item}) => (<CartListItem cartItem={item}/>)}
       keyExtractor={(item) => item.id}
       contentContainerStyle={{padding: 10, gap: 10}}
      />
     <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
   </View>
  );
};

export default CartScreen;
