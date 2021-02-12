import React from 'react';
import { connect }  from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import { setUserParam } from './redux/';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import Routes from './Routes';

function App() {
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loader />}>
        <Router basename={process.env.REACT_APP_BASENAME}>
          <Routes />
        </Router>
      </React.Suspense>
    </ErrorBoundary>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUserUpdate: (data) => {
      dispatch(setUserParam(data));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);