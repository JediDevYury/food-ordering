import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator} from "react-native";
import {Link, Stack, useLocalSearchParams} from "expo-router";
import {defaultProductImage} from "@/constants/DefaultProfuctImage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import React from "react";
import {useProduct} from "@/api/products";
import RemoteImage from "@/components/RemoteImage";

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();

  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const {product, error, isLoading} = useProduct(id);

  if(isLoading) return <ActivityIndicator />;

  if(error || !product) return <Text>Failed to fetch products</Text>

  return (
   <View style={styles.container}>
     <Stack.Screen
      options={{
        title: 'Menu',
        headerRight: () => (
         <Link href={
            `/(admin)/menu/create?id=${id}`

         } asChild>
           <Pressable>
             {
               ({pressed}) => (
                <FontAwesome
                 name="pencil"
                 size={25}
                 color={Colors.light.tint}
                 pressed={pressed}
                />
               )
             }
           </Pressable>
         </Link>
        )
      }}/>
     <Stack.Screen options={{title: product?.name}}/>
     <RemoteImage
      path={product.image}
      fallback={defaultProductImage}
      style={styles.image}
      resizeMode="contain"
     />
     <Text style={styles.title}>{product?.name}</Text>
     <Text style={styles.price}>Price: ${product?.price}</Text>
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
