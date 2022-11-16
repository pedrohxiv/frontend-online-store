import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RenderReviews from './RenderReviews';

export default class ProductReview extends Component {
  state = {
    stars: '',
    email: '',
    comment: '',
    showError: false,
    haveReviews: false,
    allReviews: [],
    haveReviewsToRender: false,
  };

  componentDidMount() {
    const path = (window.location.pathname).split('s/')[1];
    const savedReviews = JSON.parse(localStorage.getItem(path));
    this.setState({ allReviews: savedReviews });
    if (savedReviews) {
      this.setState({ haveReviewsToRender: true });
    }
  }

  renderReview = () => {
    const { productId } = this.props;
    const productReviews = JSON.parse(localStorage.getItem(productId));
    if (productReviews) {
      this.setState({ haveReviews: true });
    }
  };

  handleStars = (event) => {
    const { checked, name, value } = event.target;
    if (checked) {
      this.setState({ [name]: value, showError: false });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, showError: false });
  };

  saveOnLocalStraoge = (productId, review) => {
    let savedIds = JSON.parse(localStorage.getItem('savedIds'));
    if (savedIds) {
      if (savedIds.includes(productId)) {
        const reviewArray = JSON.parse(localStorage.getItem(`${productId}`));
        reviewArray.push(review);
        localStorage.setItem(`${productId}`, JSON.stringify(reviewArray));
      } else {
        savedIds.push(productId);
        localStorage.setItem(`${productId}`, JSON.stringify([review]));
        localStorage.setItem('savedIds', JSON.stringify(savedIds));
      }
    } else {
      localStorage.setItem(`${productId}`, JSON.stringify([review]));
      savedIds = productId;
      localStorage.setItem('savedIds', JSON.stringify([savedIds]));
    }

    this.setState({ haveReviews: true });
  };

  validateForm = () => {
    const { productId } = this.props;
    //  console.log(productId) Está passando o parâmetro productId corretamento por props ao clicar no botão de "Avaliar" - tipo:"string"
    const { stars, email, comment } = this.state;
    let productReview = {};
    // Devo salvar o ID passado como chave do localStorage e com os valores sendo a avaliação. Array de objetos.
    // Fazer um array de ID's para poder iterar sobre e mostrar os reviews na tela.
    if (!stars.length || !email) {
      this.setState({ showError: true });
    } else {
      this.setState({ showError: false });
      productReview = {
        email,
        text: comment,
        rating: stars,
      };
      this.saveOnLocalStraoge(productId, productReview);
      this.setState({ email: '', stars: '', comment: '' });
    }
    this.renderReview();
  };

  render() {
    const { showError, haveReviews, allReviews,
      haveReviewsToRender, email, comment } = this.state;
    const { productId } = this.props;
    const showSavedReviews = JSON.parse(localStorage.getItem(`${productId}`));
    const errorMessage = <div data-testid="error-msg">Campos inválidos</div>;
    return (
      <section>
        <div>
          <p>Avaliações</p>
          <form>
            <label htmlFor="email">
              <input
                data-testid="product-detail-email"
                type="text"
                id="email"
                name="email"
                value={ email }
                required
                placeholder="Email"
                onChange={ this.handleChange }
              />
            </label>
            <div className="radio-input">
              <input
                data-testid="1-rating"
                type="radio"
                id="one-star"
                name="stars"
                value="1"
                onChange={ this.handleStars }
              />
              <input
                onChange={ this.handleStars }
                data-testid="2-rating"
                type="radio"
                id="two-star"
                name="stars"
                value="2"
              />
              <input
                onChange={ this.handleStars }
                data-testid="3-rating"
                type="radio"
                id="three-star"
                name="stars"
                value="3"
              />
              <input
                onChange={ this.handleStars }
                data-testid="4-rating"
                type="radio"
                id="four-star"
                name="stars"
                value="4"
              />
              <input
                onChange={ this.handleStars }
                data-testid="5-rating"
                type="radio"
                id="five-star"
                name="stars"
                value="5"
              />
            </div>
            <label htmlFor="textarea">
              <input
                data-testid="product-detail-evaluation"
                type="textarea"
                name="comment"
                id="textarea"
                placeholder="Mensagem (opcional)"
                value={ comment }
                onChange={ this.handleChange }
              />
            </label>
            <button
              data-testid="submit-review-btn"
              type="button"
              onClick={ this.validateForm }
            >
              Avaliar
            </button>
          </form>
        </div>
        <div>
          { showError && errorMessage }
          { haveReviews ? (
            showSavedReviews.map((review, index) => (
              <RenderReviews
                key={ `${productId}-${index}` }
                email={ review.email }
                text={ review.text }
                rating={ review.rating }
              />
            ))
          ) : (
            <div>
              <p data-testid="review-card-email" />
              <div data-testid="review-card-rating" />
              <p data-testid="review-card-evaluation" />
            </div>
          )}
          { haveReviewsToRender ? (
            allReviews.map((review, index) => (
              <RenderReviews
                key={ `${productId}-${index}LS` }
                email={ review.email }
                text={ review.text }
                rating={ review.rating }
              />
            ))
          ) : (
            <div>
              <p data-testid="review-card-email" />
              <div data-testid="review-card-rating" />
              <p data-testid="review-card-evaluation" />
            </div>
          )}
        </div>
      </section>
    );
  }
}

ProductReview.propTypes = {
  productId: PropTypes.string.isRequired,
};
