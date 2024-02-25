import {View, Text, Image, StyleSheet, Pressable} from "react-native";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import products from "@/assets/data/products";
import {defaultProductImage} from "@/components/ProductListItem";
import { useState } from "react";
import Button from "@/components/Button";
import { useCartContext } from "@/providers/CartProvider";
import {PizzaSize} from "@/assets/types";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { addItem } = useCartContext();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<PizzaSize>("XL");

  const product = products.find((product) => product.id.toString() === id);

  const addToCart = () => {
    if(!product) {
      return;
    }

    addItem(product, selectedSize);
    router.push('/cart');
  };

  if(!product) {
    return (
      <View>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
   <View style={styles.container}>
     <Stack.Screen options={{title: product?.name}}/>
     <Image style={styles.image} source={{uri: product?.image || defaultProductImage}}/>

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
