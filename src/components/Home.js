import React from 'react';
import { Link } from 'react-router-dom';
import {
  getCategories,
  getProductByQuery,
  getProductsFromCategoryAndQuery,
} from '../services/api';

class Home extends React.Component {
  state = {
    categorys: [],
    productInput: '',
    buttonDisable: true,
    filterAPI: [],
    test: true,
    shopCart: [],
  };

  async componentDidMount() {
    const valores = await getCategories();
    this.setState({ categorys: valores });
    this.getLocalStorage();
  }

  // Renderiza os elementos na tela
  callAPI = async ({ target }) => {
    const { productInput } = this.state;
    const nameCategory = target.name;
    const idCategory = target.id;
    // Caso clique nos botões de categoria, filtra a lista em relação ao botão clicado
    if (target.type === 'button') {
      const API = await getProductsFromCategoryAndQuery(idCategory, nameCategory);
      this.setState({
        filterAPI: API.results.map((product) => product),
        test: false,
      });
    // Busca pela API o produto digitado
    } else {
      const API = await getProductByQuery(productInput);
      this.setState({
        filterAPI: API.results.map((product) => product),
        test: false,
      });
    }
  };

  // Botão de acesso desabilata quando não tem valor nos inputs
  buttonDisable = () => {
    const { productInput: product } = this.state;
    let isValid = false;
    if (product.length > 0) {
      isValid = false;
    } else {
      isValid = true;
    }
    this.setState({ buttonDisable: isValid });
  };

  // Função para que altere os valores do input e salve o seu valor no state
  onInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        // Realiza a validação do botão cada vez que alterar algo na tela
        this.buttonDisable();
      },
    );
  };

  // Pega os valores do localStorage
  getLocalStorage = () => {
    const shopCartLS = JSON.parse(localStorage.getItem('shopCart'));
    if (shopCartLS !== null) {
      this.setState((prevState) => ({
        shopCart: [].concat(...prevState.shopCart, shopCartLS),
      }));
    }
  };

  // Adiciona no localStorage
  handleUpdateLocalStorage = () => {
    const { shopCart } = this.state;
    localStorage.setItem('shopCart', JSON.stringify(shopCart));
  };

  // Adiciona o item clicado no state shopCart
  addShopCart = (event) => {
    const { children } = event.target.parentNode;
    const quantity = 1;
    const { shopCart } = this.state;
    const obj = {
      shopCartQuantity: quantity,
      shopCartPrice: Number((parseFloat((children[2].innerHTML)
        .split('$')[1])).toFixed(2)),
      shopCartId: children[0].innerHTML,
      shopCartTitle: children[1].innerHTML,
    };
    const idElement = this.filterShopCard(obj.shopCartId);
    if (idElement === false) {
      this.setState((prevState) => ({
        shopCart: [].concat(...prevState.shopCart, obj),
      }), this.handleUpdateLocalStorage);
    } else {
      shopCart[idElement].shopCartQuantity += 1;
      this.setState({
        shopCart,
      }, this.handleUpdateLocalStorage);
    }
  };

  filterShopCard = (id) => {
    const { shopCart } = this.state;
    const newShopCart = [...shopCart];
    const findId = newShopCart
      .find((product) => product.shopCartId === id);
    const index = newShopCart.findIndex((productIndex) => productIndex.shopCartId === id);
    if (findId === undefined) {
      return false;
    }
    return index;
  };

  render() {
    const { categorys, buttonDisable, filterAPI, test } = this.state;
    return (
      <div>
        <div data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </div>
        <div>
          {categorys.map((category) => (
            <button
              key={ category.id }
              type="button"
              data-testid="category"
              name={ category.name }
              onClick={ this.callAPI }
            >
              {category.name}

            </button>
          ))}
        </div>
        <input
          type="text"
          data-testid="query-input"
          name="productInput"
          onChange={ this.onInputChange }
        />
        <button
          type="button"
          data-testid="query-button"
          disabled={ buttonDisable }
          onClick={ this.callAPI }
        >
          Buscar
        </button>
        <Link data-testid="shopping-cart-button" to="/cart">Carrinho</Link>
        {
          test
            ? <span>Nenhum produto foi encontrado</span>
            : (
              <ul>
                {filterAPI.map((product) => (
                  <div key={ `${product.id}` }>
                    <p>{product.id}</p>
                    <li data-testid="product">
                      {product.title}
                    </li>
                    <p>{`R$${product.price}`}</p>
                    <button
                      type="button"
                      id={ product.id }
                      data-testid="product-add-to-cart"
                      onClick={ this.addShopCart }
                    >
                      Adicionar ao carrinho
                    </button>
                  </div>
                ))}
              </ul>
            )
        }
      </div>
    );
  }
}

export default Home;
