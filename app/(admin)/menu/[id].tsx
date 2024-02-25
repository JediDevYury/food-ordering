import {View, Text, Image, StyleSheet} from "react-native";
import {Stack, useLocalSearchParams} from "expo-router";
import products from "@/assets/data/products";
import {defaultProductImage} from "@/components/ProductListItem";

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  const product = products.find((product) => product.id.toString() === id);

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
     <Text style={styles.title}>{product.name}</Text>
     <Text style={styles.price}>Price: ${product.price}</Text>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default ProductDetailsScreen;
