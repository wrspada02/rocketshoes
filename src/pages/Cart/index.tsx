import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

import { Product } from "../../types"

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount, amount } = useCart();

   const total =
       cart.reduce((sumTotal, product) => {
          sumTotal += product.amount * product.price;
          return sumTotal;
       }, 0);
  

  function handleProductIncrement(product: Product) {
    const indexCart = searchIndexCart(product.id);
    const canIncrement = incrementTest(indexCart, product.id);
    if(canIncrement){
      const newCart = createNewCartArrayIncrement(indexCart);
      updateProductAmount(newCart);
    }
  }

  function handleProductDecrement(product: Product){
    const indexCart = searchIndexCart(product.id);
    const canDecrement = decrementTest(indexCart);

    if(canDecrement){
      const newCart = createNewCartArrayDecrement(indexCart);
      updateProductAmount(newCart);
    }
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  function searchIndexCart(id: number){
    const index = cart.findIndex((item) => item.id === id);
    return index;
  }

  function decrementTest(indexCart: number){
    if(cart[indexCart].amount <= 1){
      return false;
    }
    return true;
  }

  function incrementTest(indexCart: number, id: number){
    if(cart[indexCart].amount < 
      amount[id-1].amount){
        return true;
      } 
      return false;
  }

  function createNewCartArrayDecrement(index: number){
    const newArray = [...cart];

    newArray[index].amount -= 1;
    return newArray;
  }

  function createNewCartArrayIncrement(index: number){
    const newArray = [...cart];
    newArray[index].amount += 1;
    return newArray;
  }


  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {cart.map((product) => (
            <tr data-testid="product" key={product.id}>
            <td>
              <img src={product.image} alt={product.title} />
            </td>
            <td>
              <strong>{product.title}</strong>
              <span>{formatPrice(product.price)}</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                  disabled={cart[searchIndexCart(product.id)].amount <= 1}
                  onClick={() => handleProductDecrement(product)}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={cart[searchIndexCart(product.id)].amount}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                  disabled={cart[searchIndexCart(product.id)].amount >= amount[product.id-1].amount}
                  onClick={() => handleProductIncrement(product)}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>{formatPrice(product.amount*product.price)}</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
                onClick={() => handleRemoveProduct(product.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{formatPrice(Number(total))}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
