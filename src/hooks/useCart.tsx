import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextData {
  products: Product[];
  amount: Stock[];
  cart: Product[];
  setCart: (item: Product[]) => void;
  addProduct: (productId: Product[]) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: (product: Product[]) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [amount, setAmount] = useState<Stock[]>([]);
  const [cart, setCart] = useState<Product[]>(() => {

    const storeCart = localStorage.getItem('@RocketShoes:cart');
    if(storeCart) return JSON.parse(storeCart);
  });

  useEffect(() => {
    async function loadProducts() {
      await api.get('/products')
      .then(response => setProducts(response.data));
      
      await api.get('/stock')
      .then(response => setAmount(response.data));
    }

    loadProducts();
  }, []);

  useEffect(() => { 
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = async (product: Product[]) => {
    try {
      const { id } = product[0];
      const verifyId = isIdAlreadyExists(id);
      if(verifyId){
        await setCart([...cart, 
          {
            id: product[0].id,
            image: product[0].image,
            price: product[0].price,
            title: product[0].title,
            amount: 1
          }
        ]);
      }
    } catch {
      toast.error('Quantidade solicitada fora de estoque');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const newCart = [...cart];
      const index = newCart.findIndex((product) => product.id === productId);
      newCart.splice(index, 1);
      setCart(newCart);
    } catch {
      toast.error('Quantidade solicitada fora de estoque');
    }
  };

  const updateProductAmount = async (product: Product[]) => {
    try {
      setCart(product);
    } catch {
      toast.error('Erro na altera????o de quantidade do produto');
    }
  };

  function isIdAlreadyExists(id: number){
    const verifyIdProductExists = cart.filter((product) => product.id === id);
    if(verifyIdProductExists[0])return false;
    return true;
  }

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, products, setCart, amount}}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
