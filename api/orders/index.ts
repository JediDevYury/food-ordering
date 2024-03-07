import {useAuth} from "@/providers/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase";
import {UpdateTables, InsertTables} from "@/assets/types";
export const useAdminOrderList = ({archived = false}) => {
  const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

  return useQuery({
    queryKey: ['orders', { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
       .from('orders')
       .select('*')
       .in('status', statuses)
       .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['orders', {
      userId: id,
    }],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
       .from('orders')
       .select('*')
       .eq('user_id', id)
       .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
       .from('orders')
       .select('*, order_items(*, products(*))')
       .eq('id', id)
       .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    async mutationFn(order : InsertTables<'orders'>) {
      if (!session.user) return null;

      const { error, data } = await supabase
       .from('orders')
       .insert({
         ...order,
         user_id: session.user.id,
       })
       .select()
       .single();

      if (error) {
        throw error;
      }
      return data;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
    onError(error) {
      console.log(error);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  const {mutate, ...response} = useMutation({
    async mutationFn({id, updatedFields} : {
      id: number,
      updatedFields: UpdateTables<'orders'>,
    }) {
      const {data: updatedOrder, error} = await supabase
       .from('orders')
       .update(updatedFields)
       .eq('id', id)
       .select()
       .single();

      if(error) throw new Error(error.message);

      return updatedOrder;
    },
    async onSuccess(_, {id}) {
      await queryClient.invalidateQueries({
        queryKey: ['orders', id],
      });

      await queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });

  return {
    updateOrder: mutate,
    ...response,
  }
};
