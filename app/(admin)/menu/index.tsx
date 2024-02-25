import { StyleSheet, FlatList } from 'react-native';
import products from '@/assets/data/products';

import {View} from '@/components/Themed';
import {ProductListItem} from "@/components/ProductListItem";

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{
          gap: 10,
          padding: 10,
        }}
        columnWrapperStyle={{
          gap: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
  },
});
