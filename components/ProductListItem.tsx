import {Text, View} from "@/components/Themed";
import {Image, StyleSheet} from "react-native";
import Colors from "@/constants/Colors";
import {Product} from "@/assets/data/products";

export const ProductListItem = ({ product }: {
  product: Product;
}) => {
  console.log(product)
  return (
   <View style={styles.container}>
     <Image
      style={styles.image}
      source={{ uri: product.image }}
     />

     <Text style={styles.title}>{product.name}</Text>
     <Text style={styles.price}>{product.price}</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});
