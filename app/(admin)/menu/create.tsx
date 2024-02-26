import React, {useState} from 'react';

import {Text, View, StyleSheet, TextInput, Image} from 'react-native';
import Button from "@/components/Button";
import {defaultProductImage} from "@/components/ProductListItem";
import Colors from "@/constants/Colors";
import {Stack} from "expo-router";
import * as ImagePicker from 'expo-image-picker';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const resetFields = () => {
    setName('');
    setPrice('');
  }

  const validateInput = () => {
    setErrors('');

    if(!name) {
      setErrors('Name is required');
      return false;
    }

    if(!price) {
      setErrors('Price is required');
      return false;
    }

    if(isNaN(parseFloat(price))) {
      setErrors('Price is not a valid number');
      return false;
    }

    return true;
  };

  const onCreate = () => {
    if(!validateInput()) {
      return;
    }

    console.warn('Creating product: ', name, price);

    // TODO: Save into database
    resetFields();
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
   <View style={styles.container}>
     <Stack.Screen options={{title: 'Create a new product'}}/>
     <Image
      style={styles.image}
      source={{
       uri: image || defaultProductImage,
     }}/>
     <Text style={styles.textButton} onPress={pickImage}>Select an image</Text>
     <Text style={styles.label}>Name</Text>
     <TextInput
      value={name}
      placeholder="Name"
      style={styles.input}
      onChangeText={setName}
     />
     <Text style={styles.label}>Price ($)</Text>
     <TextInput
      onChangeText={setPrice}
      value={price}
      placeholder="0.00"
      style={styles.input}
      keyboardType="numeric"
     />
     <Text style={{
        color: 'red',
     }}>{errors}</Text>
     <Button text="Create Product" onPress={onCreate}/>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    backgroundColor: 'gainsboro',
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  }
});

export default CreateProduct;
