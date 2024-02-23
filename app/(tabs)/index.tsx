import { StyleSheet } from 'react-native';
import products from '@/assets/data/products';

import {View} from '@/components/Themed';
import {ProductListItem} from "@/components/ProductListItem";

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <ProductListItem product={products[0]}/>
      <ProductListItem product={products[1]}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
