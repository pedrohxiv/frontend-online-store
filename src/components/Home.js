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
    shopCartTitle: [],
    shopCartPrice: [],
  };

  async componentDidMount() {
    const valores = await getCategories();
    this.setState({ categorys: valores });
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

  // Adiciona no localStorage
  handleUpdateLocalStorage = () => {
    const { shopCartTitle, shopCartPrice } = this.state;
    localStorage.setItem('Titulos', JSON.stringify(shopCartTitle));
    localStorage.setItem('Preços', JSON.stringify(shopCartPrice));
  };

  // Adiciona o item clicado no state shopCart
  addShopCart = (event) => {
    const { children } = event.target.parentNode;
    const productTitle = children[0].innerHTML;
    const productPrice = children[1].innerHTML;
    this.setState(
      (prevState) => ({
        shopCartTitle: [...prevState.shopCartTitle, productTitle],
        shopCartPrice: [...prevState.shopCartPrice, productPrice],
      }),
      this.handleUpdateLocalStorage,
    );
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
                {filterAPI.map((product, index) => (
                  <div key={ `${index} ${product}` }>
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
