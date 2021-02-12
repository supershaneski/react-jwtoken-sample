import React from 'react';
import { connect }  from 'react-redux';
import { withRouter, Redirect } from "react-router-dom";
import { setUserParam } from '../redux/';
import classes from './Login.module.css';
import { submitLogin } from '../server/';

class Page extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            login: "",
            password: "",
            error: false,
            errorMessage: "",
            redirect: false,
        }

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);

    }

    componentDidMount() {
        
        // check the local storage
        const loginData = localStorage.getItem('login-data');
        
        if(loginData) {

            const objData = JSON.parse(loginData);
            const { login, password } = objData;

            this.setState({
                login: login,
                password: password,
            })

        }

        // if user comes to login page, destroy session
        this.props.onUserUpdate({ login: '', password: '', token: '' })

    }

    handleChangeLogin(e) {

        this.setState({
            login: e.target.value,
            error: false,
            errorMessage: '',
        })

    }

    handleChangePassword(e) {

        this.setState({
            password: e.target.value,
            error: false,
            errorMessage: '',
        })

    }

    handleSignIn() {

        const login = this.state.login.trim();
        const password = this.state.password.trim();

        if(login.length === 0) {
            this.setState({
                error: true,
                errorMessage: 'Please enter your login id.',
            })
            return;
        } else if(login.length > 0 && login.length < 5) {
            this.setState({
                error: true,
                errorMessage: 'Invalid login id.',
            })
            return;
        }

        if(password.length === 0) {
            this.setState({
                error: true,
                errorMessage: 'Please enter your password.',
            })
            return;
        }

        submitLogin({  login: login, password: password }).then(data => {
            
            const status = typeof data.status !== "undefined" ? parseInt(data.status) : 0;
            if (status === 200) {

                const token = typeof data.token !== "undefined" ? data.token.trim() : '';
                const login = this.state.login.trim();
                const password = this.state.password.trim();

                const user = {
                    login: login,
                    password: password,
                    token: token,
                }

                localStorage.setItem('login-data', JSON.stringify(user));

                this.props.onUserUpdate(user);

                this.setState({
                    error: false,
                    redirect: true,
                })

            } else if(status === 301) {

                this.setState({
                    error: true,
                    errorMessage: 'Account not found.',
                })

            } else if(status === 302) {

                this.setState({
                    error: true,
                    errorMessage: 'Wrong password.',
                })

            } else {

                this.setState({
                    error: true,
                    errorMessage: 'Unexpected error. Please try again.',
                })

            }

        }).catch(error => {
            console.log(error);

            this.setState({
                error: true,
                errorMessage: 'Server error. Please try again.',
            })

        })

    }

    render() {

        return (
            <div className={classes.container}>
                <div className={classes.login}>
                    <div className={classes.panel}>
                        <div className={classes.labelDiv}><label className={classes.label}>Login Id</label></div>
                        <input className={classes.input} type="email" value={this.state.login} onChange={this.handleChangeLogin} />
                        <div className={classes.labelDiv}><label className={classes.label}>Password</label></div>
                        <input className={classes.input} type="password" value={this.state.password} onChange={this.handleChangePassword} />
                        {
                            this.state.error &&
                            <div className={classes.error}>
                                <span>{ this.state.errorMessage }</span>
                            </div>
                        }
                        <div className={classes.action}>
                            <button className={classes.submit} onClick={this.handleSignIn}>Sign In</button>
                        </div>
                    </div>
                </div>
                {
                    this.state.redirect &&
                    <Redirect to="/" />
                }
            </div>
        )

    }
    
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
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Page));