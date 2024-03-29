import React, {useEffect, useState} from 'react';

import {Text, View, StyleSheet, TextInput, Image, Alert} from 'react-native';
import Button from "@/components/Button";
import {defaultProductImage} from "@/constants/DefaultProfuctImage";
import Colors from "@/constants/Colors";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct} from "@/api/products";
import {randomUUID} from "expo-crypto";
import {supabase} from "@/lib/supabase";
import {decode} from "base64-arraybuffer";
import * as FileSystem from 'expo-file-system';
import {TablesInsert} from "@/database.types";
import RemoteImage from "@/components/RemoteImage";

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ?  idString : '');
  const isUpdating = !!idString;
  const {mutate: insertProduct} = useInsertProduct();
  const { updateProduct } = useUpdateProduct();
  const { deleteProduct } = useDeleteProduct();
  const { product } = useProduct(id);

  const router = useRouter();

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

  const onSubmit = () => {
    if(isUpdating) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
     .from('product-images')
     .upload(filePath, decode(base64), { contentType });

    if (data) {
      return data.path;
    }
  };

  const onUpdate = async () => {
    if(!validateInput()) {
      return;
    }

    const newProduct: TablesInsert<'products'> = {
      name,
      price: parseFloat(price),
    }

    const imagePath = await uploadImage()

    if(imagePath) {
      newProduct.image = imagePath;
    }

    updateProduct({
      id,
      ...newProduct,
    }, {
      onSuccess: () => {
        resetFields();
        router.back();
      },
    })
  };

  const onCreate = async () => {
    if(!validateInput()) {
      return;
    }

    const newProduct: TablesInsert<'products'> = {
      name,
      price: parseFloat(price),
    }
    const imagePath = await uploadImage()

    if(imagePath) {
      newProduct.image = imagePath;
    }

    insertProduct(newProduct, {
      onSuccess: () => {
        resetFields();
        router.back();
      },
    });
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ])
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if(isUpdating && product) {
      setName(product.name);
      setPrice(product.price.toString());
      setImage(product.image);
    }
  }, [product]);

  return (
   <View style={styles.container}>
     <Stack.Screen options={{
       title: isUpdating ?
        'Update the product' :
        'Create a new product'
     }}/>
     <Image
      source={{
        uri: image || defaultProductImage,
      }}
      style={styles.image}
      resizeMode="contain"
     />
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
     <Button text={
        isUpdating ?
          'Update' :
          'Create'
     } onPress={onSubmit}/>
     {
        isUpdating &&
        <Button
          text="Delete"
          onPress={confirmDelete}
          style={styles.textButton}
        />
     }
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

