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

  };

  async componentDidMount() {
    const valores = await getCategories();
    this.setState({ categorys: valores });
    // console.log(valores);
  }

  callAPI = async ({ target }) => {
    const { productInput } = this.state;
    const nameCategory = target.name;
    // console.log(target);
    if (target.type === 'button') {
      // console.log('entrou no if');
      const API = await getProductByQuery(nameCategory);
      this.setState({
        filterAPI: API.results.map((product) => product),
        test: false,
      });
    } else {
      // console.log('entrou no else');
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
              {console.log(category) }
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
                  <div data-testid="product" key={ index }>
                    <Link
                      to={ `/products-details/${product.id}` }
                      data-testid="product-detail-link"
                    >
                      <img src={ product.thumbnail } alt={ product.title } />
                      <li
                        key={ `${index} ${product}` }
                      >
                        {product.name}
                        {product.title}
                      </li>
                    </Link>
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
