import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {defaultProductImage} from "@/constants/DefaultProfuctImage";
import React, { useState } from "react";
import Button from "@/components/Button";
import { useCartContext } from "@/providers/CartProvider";
import {PizzaSize} from "@/assets/types";
import {useProduct} from "@/api/products";
import RemoteImage from "@/components/RemoteImage";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const {product, error, isLoading} = useProduct(id);
  const { addItem } = useCartContext();

  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("XL");

  const addToCart = () => {
    if(!product) {
      return;
    }

    addItem(product, selectedSize);
    router.push('/cart');
  };

  if(isLoading) return <ActivityIndicator />;

  if(error || !product) return <Text>Failed to fetch products</Text>


  return (
   <View style={styles.container}>
     <Stack.Screen options={{title: product.name}}/>
     <RemoteImage
      path={product.image}
      fallback={defaultProductImage}
      style={styles.image}
      resizeMode="contain"
     />

     <Text style={styles.price}>Select size</Text>
     <View style={styles.sizes}>
       {
         sizes.map((size) => (
          <Pressable
           onPress={() => {
             setSelectedSize(size)
           }}
           style={[styles.size, {
            backgroundColor: selectedSize === size ?
             'gainsboro' :
             'white',
          }]}
           key={size}
          >
            <Text key={size} style={[styles.sizeText, {
              color: selectedSize === size ? 'black' : 'gray',
            }]}>{size}</Text>
          </Pressable>
         ))
       }
     </View>
     <Text style={styles.price}>${product.price}</Text>
     <Button text="Add to cart" onPress={addToCart}/>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 'auto'
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});


export default ProductDetailsScreen;
