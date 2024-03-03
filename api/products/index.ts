import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";

export const useProductList = () => {
  const {data: products, ...response} = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const {data, error} = await supabase.from('products').select('*');

      if(error) throw new Error(error.message);

      return data;
    },
  });

  return {
    products,
    ...response,
  }
};

export const useProduct = (id: number) => {
  const {data: product, ...response} = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const {data, error} = await supabase
       .from('products')
       .select('*')
       .eq('id', id)
       .single();

      if(error) throw new Error(error.message);

      return data;
    },
  });

  return {
    product,
    ...response,
  }
};

export const useInsertProduct = () => {
  const queryClient = useQueryClient();

  const {mutate, ...response} = useMutation({
    async mutationFn(product: any) {
      const {data, error} = await supabase
       .from('products')
       .insert({
        name: product.name,
        price: product.price,
        image: product.image,
      })
       .single();

      if(error) throw new Error(error.message);

      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });

  return {
    insertProduct: mutate,
    ...response,
  }
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const {mutate, ...response} = useMutation({
    async mutationFn(product: any) {
      const {data, error} = await supabase
       .from('products')
       .update({
         name: product.name,
         price: product.price,
         image: product.image,
       })
       .eq('id', product.id)
       .select()
       .single();

      if(error) throw new Error(error.message);

      return data;
    },
    async onSuccess(_, product) {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['product', product.id],
      });
    },
  });

  return {
    updateProduct: mutate,
    ...response,
  }
};


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const {mutate, ...response} = useMutation({
    async mutationFn(id: number) {
      const {error} = await supabase
       .from('products')
       .delete()
       .eq('id', id)

      if(error) throw new Error(error.message);

      return;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },
  });

  return {
    deleteProduct: mutate,
    ...response,
  }
};
