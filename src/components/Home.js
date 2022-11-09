import React from 'react';
import { getProductByQuery } from '../services/api';
import { Link } from 'react-router-dom';


class Home extends React.Component {
  state = {
    productInput: '',
    buttonDisable: true,
    filterAPI: [],
    test: true,
  };

  callAPI = async () => {
    const { productInput, filterAPI } = this.state;
    const API = await getProductByQuery(productInput);
    this.setState({
      filterAPI: API.results.map((product) => product.title),
      test: false,
    }, () => console.log(filterAPI));
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

  render() {
    const { buttonDisable, filterAPI, test } = this.state;
    return (
      <div>
        <p data-testid="home-initial-message">
          Digite algum termo de pesquisa ou escolha uma categoria.
        </p>
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
                  <li
                    data-testid="product"
                    key={ `${index} ${product}` }
                  >
                    {product}
                  </li>
                ))}
              </ul>
            )
        }
      </div>
    );
  }
}

export default Home;
