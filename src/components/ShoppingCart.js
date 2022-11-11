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
    const selectedItem = target.id;
    const newCartItems = cartItems
      .filter((cartItem) => cartItem.shopCartId !== selectedItem);
    this.setState({ cartItems: newCartItems });
    localStorage.setItem('shopCart', JSON.stringify(newCartItems));
  };

  addProductItem = ({ target }) => {
    const { cartItems } = this.state;
    const selectedItem = target.id;
    const newCartItems = [...cartItems];
    const item = newCartItems.find((cartItem) => cartItem.shopCartId === selectedItem);
    item.shopCartQuantity += 1;
    this.setState({ cartItems: newCartItems });
    localStorage.setItem('shopCart', JSON.stringify(newCartItems));
  };

  removeProductItem = ({ target }) => {
    const { cartItems } = this.state;
    const selectedItem = target.id;
    const newCartItems = [...cartItems];
    const item = newCartItems.find((cartItem) => cartItem.shopCartId === selectedItem);
    item.shopCartQuantity -= 1;
    // if (item.qtd < 1) {
    //   const arrFiltered = newCartItems
    //     .filter((cartItem) => cartItem.name !== selectedItem);
    //   this.setState({ cartItems: arrFiltered });
    // } else {
    //   this.setState({ cartItems: newCartItems });
    // }
    if (item.shopCartQuantity <= 1) {
      item.shopCartQuantity = 1;
    }
    this.setState({ cartItems: newCartItems });
    localStorage.setItem('shopCart', JSON.stringify(newCartItems));
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
                    id={ cartItem.shopCartId }
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
                    id={ cartItem.shopCartId }
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
                    id={ cartItem.shopCartId }
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
