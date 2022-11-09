import React, { Component } from 'react';

export default class ShoppingCart extends Component {
  state = {
    cartItems: [],
  };

  render() {
    const { cartItems } = this.state;
    const cartItemsLength = cartItems.length;
    return (
      <div>
        { cartItemsLength ? cartItems : (
          <div data-testid="shopping-cart-empty-message">
            Seu carrinho está vazio
          </div>
        )}
      </div>
    );
  }
}
