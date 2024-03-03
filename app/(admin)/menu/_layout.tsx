import React from "react";
import {Link, Stack} from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Pressable} from "react-native";
import Colors from "@/constants/Colors";
import {Ionicons} from "@expo/vector-icons";
export default function MenuStack() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
       name="index"
       options={{
         headerBackButtonMenuEnabled: true,
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
         ),
         headerLeft: () => (
          <Link href="/" style={{
            fontWeight: '100',
          }} asChild>
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
         )
       }}/>
    </Stack>
  )
}
