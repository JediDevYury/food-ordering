import {PropsWithChildren, useEffect, useRef, useState} from "react";
import {registerForPushNotificationsAsync} from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/providers/AuthProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { profile } = useAuth();
  const [_, setExpoPushToken] = useState<string | undefined>();
  const [__, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const savePushToken = async (newToken: string | undefined) => {
    setExpoPushToken(newToken);

    if(!newToken) return;

    await supabase.from('profiles').update({
      user_push_token: newToken
    }).eq('id', profile?.id);
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
     .then(token => {
       return savePushToken(token);
    }).catch(err => console.log(err));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      if(notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }

      if(responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return <>{children}</>
};

export default NotificationProvider;
