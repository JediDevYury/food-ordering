import {useMutation} from "@tanstack/react-query";
import {TablesInsert} from "@/database.types";
import {supabase} from "@/lib/supabase";

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(orderItems : TablesInsert<'order_items'>[]) {
      const { error, data } = await supabase
       .from('order_items')
       .insert(orderItems)
       .select();

      if (error) {
        throw error;
      }
      return data;
    },
    onError(error) {
      console.log(error);
    },
  });
};
