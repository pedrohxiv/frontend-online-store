import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProductReview from './ProductReview';
import { getProductById } from '../services/api';

class ProductDetails extends React.Component {
  state = {
    product: [],
  };

  async componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    const details = await getProductById(id);
    this.setState({ product: details });
  }

  render() {
    const { product } = this.state;
    return (
      <>
        <p data-testid="product-detail-name">{product.title}</p>
        <p data-testid="product-detail-price">{product.price}</p>
        <img
          src={ product.thumbnail }
          alt={ product.title }
          data-testid="product-detail-image"
        />
        <Link to="/shoppingCart">
          <button
            type="button"
            data-testid="shopping-cart-button"
          >
            Ir ao carrinho!!
          </button>
        </Link>
        <ProductReview productId={ product.id } />
      </>

    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default ProductDetails;
