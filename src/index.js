/* eslint react/prop-types: 0 */

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore, { history } from './store/configureStore';
import App from './components/App';
//import HomePage from './components/HomePage';
import "./styles/stylesheet.scss";
const store = configureStore();
// Create an enhanced history that syncs navigation events with the store
//const history = syncHistoryWithStore(browserHistory, store);


render(
    <AppContainer>
      <App store={store} history={history} />
    </AppContainer>,
    document.getElementById('app')
  );
  
  if (module.hot) {
    module.hot.accept('./components/Root', () => {
      const NewRoot = require('./components/Root').default;
      render(
        <AppContainer>
          <NewRoot store={store} history={history} />
        </AppContainer>,
        document.getElementById('app')
      );
    });
  }
  
/*


render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={HomePage} />
            </Route>
        </Router>
  </Provider>, document.getElementById('app')
);*/