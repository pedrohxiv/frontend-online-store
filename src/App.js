import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import ShoppingCart from './components/ShoppingCart';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Home } />
      <Route exact path="/cart" component={ ShoppingCart } />
    </Switch>
  );
}

export default App;
