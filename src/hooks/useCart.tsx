import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  products: Product[];
  //setProducts: () => void;
  amount: Stock[];
  //setAmount: () => void;
  cart: Product[];
  setCart: (item: Product[]) => void;
  addProduct: (productId: Product[]) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [amount, setAmount] = useState<Stock[]>([]);
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
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
            amount: 3
          }
        ]);
      }
    } catch {
      toast.error('Quantidade solicitada fora de estoque');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      toast.error('Quantidade solicitada fora de estoque');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
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
