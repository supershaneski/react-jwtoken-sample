import React from 'react';

export default class ErrorBoundary extends React.Component {

    constructor(props) {

      super(props);

      this.state = { hasError: false };
      
      this.handleReload = this.handleReload.bind(this);

    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo);
    }

    handleReload() {
        window.location.reload(true);
    }
  
    render() {
      if(this.state.hasError) {
        return (
            <div>
                <span>Something went wrong</span>
                <button onClick={this.handleReload}>Reload</button>
            </div>
        )
      }
  
      return this.props.children;
    }
  
  }