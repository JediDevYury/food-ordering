import {Platform} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import Constants from "expo-constants";
import {supabase} from "@/lib/supabase";
import {Tables} from "@/assets/types";

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    })).data;

    return token;
  }

  return;
}

async function sendPushNotification(expoPushToken: string, order: Tables<"orders">) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: `Your order #${order.id} has been updated to ${order.status}`,
    body: 'It should get there in 10 minutes!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

const getUserToken = async (userId: string) => {
  const {data, error} = await supabase.from('profiles').select('*').eq('id', userId).single();

  if(error) {
    throw new Error(error.message);
  }

  return data?.user_push_token;
};

export const notifyUserAboutOrderUpdate = async (order: Tables<"orders">) => {
  if(!order.user_id) {
    return;
  }

  const userToken = await getUserToken(order.user_id);

  if(!userToken) {
    throw new Error('User has no push token');
  }

  await sendPushNotification(userToken, order);
};

export {registerForPushNotificationsAsync, sendPushNotification};
