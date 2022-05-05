import React from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

const Home = (): JSX.Element => {
  const { addProduct, cart, products } = useCart();

  function findIndexCartAmount(id: number){
    const item = cart.filter((item) => item.id === id);
    if(item[0] !== undefined){
      const { amount } = item[0];
      return amount;
    }
    return 0;
  }

  function handleAddProduct(id: number) {
    const productToAddInCart = products.filter((product) => product.id === id);
    addProduct(productToAddInCart);
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {findIndexCartAmount(product.id)}
            </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
      ))}
    </ProductList>
  );
};

export default Home;
