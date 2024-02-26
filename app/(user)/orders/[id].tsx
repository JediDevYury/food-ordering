import { Text, View, FlatList, StyleSheet } from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {Stack} from "expo-router";
import orders from "@/assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";

export default function OrderDetailsScreen () {
  const { id } = useLocalSearchParams();

  const order = orders.find(order => order.id.toString() === id);

  if (!order) {
    return (
      <View>
        <Text style={{fontSize: 20}}>Not found</Text>
      </View>
    )
  }

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
