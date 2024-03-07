import React from 'react';

import {FlatList, Platform, View, Text} from 'react-native';
import {StatusBar} from "expo-status-bar";
import {useCartContext} from "@/providers/CartProvider";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";

const CartScreen = () => {
  const { items, total, checkout } = useCartContext();

  return (
   <View style={{padding: 10}}>
     <FlatList
       data={items}
       renderItem={({item}) => (<CartListItem cartItem={item}/>)}
       keyExtractor={(item) => item.id}
       contentContainerStyle={{padding: 10, gap: 10}}
      />

     <Text style={{
       marginTop: 10,
       fontSize: 20,
       fontWeight: "500",
     }}>Total: ${total}</Text>

     <Button text={"Checkout"} onPress={checkout}/>
     <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
   </View>
  );
};

export default CartScreen;
