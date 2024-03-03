import {StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {Text, View} from '@/components/Themed';
import {ProductListItem} from "@/components/ProductListItem";
import {useProductList} from "@/api/products";

export default function MenuScreen() {
  const {products, isLoading, error} = useProductList();

  if(isLoading) return <ActivityIndicator />;

  if(error) return <Text>Failed to fetch products</Text>

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
