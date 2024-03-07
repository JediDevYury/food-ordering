import {View, Text, Button} from 'react-native';
import {supabase} from "@/lib/supabase";

const ProfileScreen = () => {
  return (
   <View>
     <Text>Profile</Text>
     <Button
      title="Sign Out"
      onPress={async () => await supabase.auth.signOut()}
     />
   </View>
  )
};

export default ProfileScreen;
