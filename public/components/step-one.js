import React from 'react';
import CopySnippet from './copy-snippet';

class StepOne extends React.Component {

  constructor() {
    super();

    this.start = this.start.bind(this);
    this.update = this.update.bind(this);
    this.returnFromAuth = this.returnFromAuth.bind(this);

    let savedState = localStorage.getItem('app-state') || '{}'
    savedState = JSON.parse(savedState)

    this.state = savedState
    this.state.stepState = 'initial'
    this.state.isActiveStep = (this.state.currentStep === 1)
  }

  update(){
    this.forceUpdate();
  }

  start() {
    this.setState({
      stepState: 'wait'
    });

    window.location = this.completeURL
  }

  returnFromAuth() {
    let c = this;

    c.setState({
      stepState: 'wait',
      isActiveStep: c.props.isActive
    });

    setTimeout(function() {
      c.setState({
        stepState: 'initial',
        isActiveStep: false
      });

      c.props.scrollAnimated(900, 600);
    }, 1000);
  }

  componentDidMount() {
    var c = this;

    window.addEventListener('returnFromAuth', function() {
      c.returnFromAuth()
    });

    window.addEventListener('startOver', function() {
      c.setState({
        isActiveStep: true
      });
    });
  }

  render() {
    this.completeURL = this.props.authEndpoint + '?client_id=' + this.props.clientID + '&redirect_uri=' + this.props.redirectURI +'&scope=' + encodeURI(this.props.scopes) + '&response_type=code&state=' + this.props.stateToken

    return (
      <div className={`playground-step ${this.state.isActiveStep ? 'active' : '' }`}>
        <span className="step-number">1</span>
        <div className="step-content">
          <h2 className="step-title">Redirect to OpenID Connector Server</h2>
          <div className="code-box">
            <h3 className="code-box-title">
              Request
              { this.state.showResponse === 'response' ? ' / Response' : null }
            </h3>
            <div className="code-box-content">
              <div className="code-block">
                <a onClick={this.props.openModal} href="#"> { this.props.authEndpoint || "Enter an authorization endpoint in the setting dialog!"}? </a>
                <div className="code-block-url-params">
                  client_id=
                  <a onClick={this.props.openModal} href="#">{this.props.clientID}</a>
                  <br />
                  &amp;redirect_uri=
                  <a onClick={this.props.openModal} href="#">https://openidconnect.net/callback </a>
                  <br />
                  &amp;scope=
                  <a onClick={this.props.openModal} href="#">{this.props.scopes}</a>
                  <br/>
                  <span>&amp;response_type=code</span>
                  <br />
                  <span>&amp;state={this.props.stateToken}</span>
                </div>
              </div>
              <hr />
              { this.state.stepState === 'wait' ?
                <div className="theme-dark step-spinner-container">
                  <div className="spinner spinner-md step-spinner">
                    <div className="circle"></div>
                  </div>
                </div>
                : null }
              { this.state.stepState === 'response' ?
                <div className="code-block">
                  https://openidconnect.net/callback?code=#4/SXjuF3gzD04Oouq
                </div>
                : null
              }
              { this.state.stepState !== 'wait' ?
                <button onClick={this.start} className="code-box-btn">Start</button>
              : null }
            </div>
          </div>
          <br />
        </div>
        <button onClick={this.props.skipTutorial} className="skip-tutorial btn-link">Skip this tutorial. Show me the complete flow.</button>
      </div>
    );
  }
}

export default StepOne;
