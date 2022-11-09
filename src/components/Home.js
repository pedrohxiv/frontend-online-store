import React from 'react';
import { getCategories } from '../services/api';

class Home extends React.Component {
  state = {
    productInput: '',
    buttonDisable: true,
    filterAPI: [],
    readyClick: 0,
  };

  callAPI = async () => {
    const { productInput, filterAPI, readyClick } = this.state;
    const API = await getCategories();
    this.setState({
      filterAPI: API.filter((product) => productInput.includes(product.name)),
      readyClick: readyClick + 1,
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
    const { buttonDisable, filterAPI, readyClick } = this.state;
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
        {
          filterAPI.length === 0 && readyClick !== 0
            ? <span>Nenhum produto foi encontrado</span>
            : (
              <ul>
                {filterAPI.map((product) => {
                  <li>{product.id}</li>;
                })}
              </ul>
            )
        }
      </div>
    );
  }
}

export default Home;

