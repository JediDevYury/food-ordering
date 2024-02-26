import {FlatList, StyleSheet} from 'react-native';
import orders from '@/assets/data/orders';
import OrderListItem from '@/components/OrderListItem';

export default function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      renderItem={({item}) => <OrderListItem order={item}/>}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    margin: 10,
    gap: 10,
  },
});
