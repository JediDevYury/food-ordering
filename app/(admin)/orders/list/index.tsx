import {ActivityIndicator, FlatList, StyleSheet, Text} from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import { useAdminOrderList } from "@/api/orders";
import {useInsertOrderSubscription} from "@/api/orders/subscription";

export default function OrdersScreen() {
  const {data: orders, isLoading, error } = useAdminOrderList({
    archived: false
  });

  useInsertOrderSubscription();

  if(isLoading) return <ActivityIndicator />;

  if(error) return <Text>Failed to fetch orders</Text>

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
