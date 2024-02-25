import {createContext, PropsWithChildren, useCallback, useContext, useState} from "react";
import {Product, CartItem} from "@/assets/types";
import {randomUUID} from "expo-crypto";

export type TCartContext = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem['size']) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
};

export const CartContext = createContext<TCartContext>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
});

const CartProvider = ({children}: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
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
