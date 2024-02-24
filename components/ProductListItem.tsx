import {Text} from "@/components/Themed";
import {Image, StyleSheet, Pressable} from "react-native";
import Colors from "@/constants/Colors";
import {Product} from "@/assets/types";
import {Link} from "expo-router";

export const defaultProductImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
  product: Product;
}

export const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
   <Link href={`/menu/${product.id}`} asChild>
     <Pressable style={styles.container}>
       <Image
        style={styles.image}
        source={{uri: product.image || defaultProductImage}}
        resizeMode="contain"
       />

       <Text style={styles.title}>{product.name}</Text>
       <Text style={styles.price}>{product.price}</Text>
     </Pressable>
   </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '50%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    margin: 10,
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
