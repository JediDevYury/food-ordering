import React from "react";
import {Link, Stack} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Pressable} from "react-native";
import Colors from "@/constants/Colors";

export default function MenuStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerRight: () => (
         <Link href="/cart" asChild>
           <Pressable>
             {
               ({pressed}) => (
                 <FontAwesome
                   name="shopping-cart"
                   size={28}
                   color={Colors.light.tint}
                 />
               )
             }
           </Pressable>
         </Link>
        ),
        title: 'Menu',
      }}/>
    </Stack>
  )
}
