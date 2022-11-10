import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ShoppingCart extends Component {
  state = {
    cartItems: [],
  };

  componentDidMount() {
    this.getLocalStorage();
  }

  // Pegando os valores do localStorage
  getLocalStorage = () => {
    const shopCartQuantity = JSON.parse(localStorage.getItem('Quantity'));
    const shopCartTitle = JSON.parse(localStorage.getItem('Titles'));
    // const shopCartPrice = JSON.parse(localStorage.getItem('Prices'));
    if (shopCartTitle !== null) {
      for (let i = 0; i < shopCartTitle.length; i += 1) {
        this.setState(
          (prevState) => ({
            cartItems: [...prevState.cartItems, shopCartTitle[i]],
            cartQuantity: [...prevState.cartQuantity, shopCartQuantity[i]],
          }),
        );
      }
    }
  };

  render() {
    const { cartItems, cartQuantity } = this.state;
    const cartItemsLength = cartItems.length;
    console.log(cartItems);
    return (
      <div>
        <Link to="/">Home</Link>
        {
          cartItemsLength === 0
            ? (
              <span
                data-testid="shopping-cart-empty-message"
              >
                Seu carrinho está vazio
              </span>
            )
            : (
              <ul>
                {cartItems.map((item, index) => (
                  <div key={ `${index} ${item}` }>
                    <li
                      data-testid="shopping-cart-product-name"
                    >
                      {item}
                    </li>
                    <p
                      data-testid="shopping-cart-product-quantity"
                    >
                      {cartQuantity[index]}
                    </p>
                  </div>
                ))}
              </ul>
            )
        }
      </div>
    );
  }
}
