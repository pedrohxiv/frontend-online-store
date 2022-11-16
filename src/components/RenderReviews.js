import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RenderReviews extends Component {
  render() {
    const { email, text, rating } = this.props;
    return (
      <div>
        <p data-testid="review-card-email">{ email }</p>
        <div data-testid="review-card-rating">
          <input type="radio" name={ `${email}-stars` } value={ rating } />
          <input type="radio" name={ `${email}-stars` } value={ rating } />
          <input type="radio" name={ `${email}-stars` } value={ rating } />
          <input type="radio" name={ `${email}-stars` } value={ rating } />
          <input type="radio" name={ `${email}-stars` } value={ rating } />
        </div>
        <p data-testid="review-card-evaluation">{ text }</p>
      </div>
    );
  }
}

RenderReviews.propTypes = {
  email: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
};
