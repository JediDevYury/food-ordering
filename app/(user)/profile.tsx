import {View, Text, Button, StyleSheet} from 'react-native';
import {supabase} from "@/lib/supabase";
import {useAuth} from "@/providers/AuthProvider";

const ProfileScreen = () => {
  const {profile} = useAuth()


  return (
   <View style={styles.container}>
     <Text style={styles.text}>{profile.full_name || "Test User"}</Text>
     <Button
      title="Sign Out"
      onPress={async () => await supabase.auth.signOut()}
     />
   </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    lineHeight: 30,
  }
});
export default ProfileScreen;
