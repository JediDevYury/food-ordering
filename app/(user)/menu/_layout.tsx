import React from "react";
import {Link, Stack} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Pressable} from "react-native";
import Colors from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";

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
                   pressed={pressed}
                 />
               )
             }
           </Pressable>
         </Link>
        ),
        headerLeft: () => (
         <Link href="/" asChild>
           <Pressable>
             {
               () => (
                <Ionicons
                 name="chevron-back"
                 color={Colors.light.tint}
                 size={32}
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
