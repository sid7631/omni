// src/redux/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers'; // Assume reducers index file aggregates all reducers

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk)
);

export default store;


