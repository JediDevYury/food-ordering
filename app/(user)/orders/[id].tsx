import {Text, View, FlatList, StyleSheet, ActivityIndicator} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {Stack} from "expo-router";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import {useOrderDetails} from "@/api/orders";
import {useUpdateOrderSubscription} from "@/api/orders/subscription";

export default function OrderDetailsScreen () {
  const { id: idString } = useLocalSearchParams();

  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const {data: order, isLoading, error} = useOrderDetails(id)

  useUpdateOrderSubscription(id)

  if(isLoading) return <ActivityIndicator />;

  if(error || !order) return <Text>Failed to fetch order</Text>

  return (
   <View style={{
     padding: 10,
     gap: 20,
     flex: 1
   }}>
     <Stack.Screen options={{
        title: `Order for #${id}`,
     }}/>

     <FlatList
      data={order.order_items}
      renderItem={({item}) => <OrderItemListItem item={item}/>}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={() => {
        return <OrderListItem order={order}/>
      }}
     />
   </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10
  }
})
