import React from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProductByQuery } from '../services/api';

class Home extends React.Component {
  state = {
    categorys: [],
    productInput: '',
    buttonDisable: true,
    filterAPI: [],
    test: true,
    shopCart: {
      shopCartId: [],
      shopCartTitle: [],
      shopCartPrice: [],
      shopCartQuantity: [],
    },
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
    // Caso clique nos botões de categoria, filtra a lista em relação ao botão clicado
    if (target.type === 'button') {
      const API = await getProductByQuery(nameCategory);
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
      this.setState({
        shopCart: {
          shopCartQuantity: shopCartLS.shopCartQuantity,
          shopCartId: shopCartLS.shopCartId,
          shopCartTitle: shopCartLS.shopCartTitle,
          shopCartPrice: shopCartLS.shopCartPrice,
        },
      });
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
    const { shopCart: {
      shopCartQuantity, shopCartPrice, shopCartId, shopCartTitle,
    } } = this.state;
    const productId = children[0].innerHTML;
    const productTitle = children[1].innerHTML;
    const productPrice = Number((parseFloat((children[2].innerHTML)
      .split('$')[1])).toFixed(2));
    const matchId = this.filterShopCard(productId);
    if (matchId !== false) {
      shopCartQuantity[matchId] += 1;
      shopCartPrice[matchId] += productPrice;
      this.setState({
        shopCart: {
          shopCartQuantity,
          shopCartId,
          shopCartTitle,
          shopCartPrice,
        },
      }, this.handleUpdateLocalStorage);
    } else {
      this.setState(
        (prevState) => ({
          shopCart: {
            shopCartQuantity: [...prevState.shopCart.shopCartQuantity, 1],
            shopCartId: [...prevState.shopCart.shopCartId, productId],
            shopCartTitle: [...prevState.shopCart.shopCartTitle, productTitle],
            shopCartPrice: [...prevState.shopCart.shopCartPrice, productPrice],
          },
        }),
        this.handleUpdateLocalStorage,
      );
    }
  };

  filterShopCard = (id) => {
    const { shopCart: { shopCartId } } = this.state;
    const existsId = shopCartId.includes(id);
    let indexId = false;
    if (existsId) {
      indexId = shopCartId.findIndex((element) => (element === id));
    } else {
      return indexId;
    }
    return indexId;
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
