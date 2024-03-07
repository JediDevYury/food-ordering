import {createContext, PropsWithChildren, useCallback, useContext, useMemo, useState} from "react";
import {PizzaSize, Tables} from "@/assets/types";
import {randomUUID} from "expo-crypto";
import {useInsertOrder} from "@/api/orders";
import {useRouter} from "expo-router";
import {useInsertOrderItems} from "@/api/order-items";

type Product = Tables<'products'>

export type CartItem = {
  id: string;
  product: Tables<'products'>;
  product_id: number;
  size: PizzaSize;
  quantity: number;
};


export type TCartContext = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void,
};

export const CartContext = createContext<TCartContext>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({children}: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const {mutate: insertOrder} = useInsertOrder();
  const {mutate: insertOrderItems} = useInsertOrderItems();
  const router = useRouter();

  const addItem = useCallback((product: Product, size: CartItem['size']) => {
    // TODO: if already in cart, increase quantity

    const existingItem = items.find((item) =>
     item.product === product && item.size === size);

    if (existingItem) {
      updateQuantity(existingItem.id, 1);

      return;
    }

    const cartItem: CartItem = {
      product,
      size,
      quantity: 1,
      product_id: product.id,
      id: randomUUID(), // TODO: generate unique id
    };

    setItems([...items, cartItem]);
  }, [items]);

  const updateQuantity = useCallback((itemId: string, amount: -1 | 1) => {
    const updatedItems = items
     .map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + amount,
      };
    })
     .filter((item) => item.quantity > 0);

    setItems(updatedItems);
  }, [items]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => (sum += item.product.price * item.quantity), 0);
  }, [items]);

  const clearCart = () => {
    setItems([]);
  };

  const saveOrderItems = (order: Tables<'orders'> | null) => {
    const orderItems = items.map((item) => ({
      order_id: order!.id,
      product_id: item.product_id,
      size: item.size,
      quantity: item.quantity,
    }));

    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearCart();
        router.push(`/(user)/orders/${order?.id}`);
      },
    });
  };

  const checkout = () => {
    insertOrder({total}, {
      onSuccess: saveOrderItems,
    });
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      total,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}

export default CartProvider;
