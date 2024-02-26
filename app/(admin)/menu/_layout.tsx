import React from "react";
import {Link, Stack} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Pressable} from "react-native";
import Colors from "@/constants/Colors";

export default function MenuStack() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
       name="index"
       options={{
         title: 'Menu',
         headerRight: () => (
          <Link href="/(admin)/menu/create" asChild>
            <Pressable>
              {
                ({pressed}) => (
                 <FontAwesome
                  name="plus-square-o"
                  size={25}
                  color={Colors.light.tint}
                  pressed={pressed}
                 />
                )
              }
            </Pressable>
          </Link>
         )
       }}/>

      <Stack.Screen
       name="[id]"
       options={{
         title: 'Menu',
         headerRight: () => (
          <Link href="/" asChild>
            <Pressable>
              {
                ({pressed}) => (
                 <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  pressed={pressed}
                 />
                )
              }
            </Pressable>
          </Link>
         )
       }}/>
    </Stack>
  )
}
