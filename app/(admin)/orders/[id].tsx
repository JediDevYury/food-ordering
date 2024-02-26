import { Text, View, FlatList, StyleSheet, Pressable } from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {Stack} from "expo-router";
import orders from "@/assets/data/orders";
import OrderListItem from "@/components/OrderListItem";
import OrderItemListItem from "@/components/OrderItemListItem";
import { OrderStatusList } from '@/assets/types';
import Colors from "@/constants/Colors";

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
      ListFooterComponent={() => {
        return (
         <>
           <Text style={{ fontWeight: 'bold' }}>Status</Text>
           <View style={{ flexDirection: 'row', gap: 5 }}>
             {OrderStatusList.map((status) => (
              <Pressable
               key={status}
               onPress={() => console.warn('Update status')}
               style={{
                 borderColor: Colors.light.tint,
                 borderWidth: 1,
                 padding: 10,
                 borderRadius: 5,
                 marginVertical: 10,
                 backgroundColor:
                  order.status === status
                   ? Colors.light.tint
                   : 'transparent',
               }}
              >
                <Text
                 style={{
                   color:
                    order.status === status ? 'white' : Colors.light.tint,
                 }}
                >
                  {status}
                </Text>
              </Pressable>
             ))}
           </View>
         </>

        )
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
