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
    const shopCartLS = JSON.parse(localStorage.getItem('shopCart'));
    if (shopCartLS !== null) {
      this.setState((prevState) => ({
        cartItems: [].concat(...prevState.cartItems, shopCartLS),
      }));
    }
  };

  // Remove o item do carrinho
  removeItem = ({ target }) => {
    const { cartItems } = this.state;
    const selectedItem = target.parentNode.children[1].innerText;
    const newCartItems = cartItems
      .filter((cartItem) => cartItem.shopCartTitle !== selectedItem);
    this.setState({ cartItems: newCartItems });
    localStorage.setItem('shopCart', JSON.stringify(cartItems));
  };

  render() {
    const { cartItems } = this.state;
    const cartItemsLength = cartItems.length;
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
              cartItems.map((cartItem) => (
                <div key={ cartItem.shopCartId } style={ { display: 'flex' } }>
                  <button
                    data-testid="remove-product"
                    type="button"
                    onClick={ this.removeItem }
                  >
                    Excluir
                  </button>
                  <p
                    data-testid="shopping-cart-product-name"
                  >
                    {cartItem.shopCartTitle}
                  </p>
                  <button
                    data-testid="product-decrease-quantity"
                    type="button"
                    onClick={ this.removeProductItem }
                  >
                    -
                  </button>
                  <p
                    data-testid="shopping-cart-product-quantity"
                  >
                    {cartItem.shopCartQuantity}
                  </p>
                  <button
                    data-testid="product-increase-quantity"
                    type="button"
                    onClick={ this.addProductItem }
                  >
                    +
                  </button>
                  <p>{`R$${cartItem.shopCartPrice}`}</p>
                </div>
              ))
            )
        }
      </div>
    );
  }
}
