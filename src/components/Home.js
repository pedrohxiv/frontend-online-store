import React from 'react';
import { getCategories } from '../services/api';

class Home extends React.Component {
  state = { categorys: [] };

  async componentDidMount() {
    const valores = await getCategories();
    this.setState({ categorys: valores });
  }

  render() {
    const { categorys } = this.state;
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
            >
              {category.name}

            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
