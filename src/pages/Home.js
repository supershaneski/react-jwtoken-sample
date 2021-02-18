import React from 'react';
import { connect }  from 'react-redux';
import { withRouter, Redirect } from "react-router-dom";
import { setUserParam } from '../redux/';
import { getData } from '../server/';
import classes from './Home.module.css';


const getUniqueChar = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const index = Math.floor(chars.length * Math.random());
    return 'abcdefghijklmnopqrstuvwxyz'.charAt(index)
}

const getUniqueInt = () => {
    const tmp = Math.floor(100 * Math.random());
    return tmp < 10 ? '0' + tmp : tmp;
}


class Page extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: 0,
            items: [],
            redirect: false,
            error: false,
            errorMessage: "",
        }

        this.getList = this.getList.bind(this);
        this.reloadApp = this.reloadApp.bind(this);

    }

    componentDidMount() {

        console.log("mounted...")

        const { token } = this.props.user;
        if(token.length === 0) {

            console.log("no token. redirecting...")

            this.setState({
                loading: 1,
                redirect: true,
            })

            return;

        }

        this.getList();

    }

    getList() {

        /*
        var d1 = [];
        for(var k = 0; k < 3; k++) {
            var ch = '';
            for(var i = 0; i < 3; i++) {
                ch += getUniqueChar();
            }
            var suffix = getUniqueInt();
            d1.push(ch + suffix);
        }

        console.log("keys...", d1.join('-'));
        */

        getData({ token: this.props.user.token }).then(data => {
            
            const status = typeof data.status !== "undefined" ? parseInt(data.status) : 0;
            if(status === 200) {

                console.log("data received...")

                this.setState({
                    items: data.items,
                    loading: 1,
                    error: false,
                })

            } else if(status == 401){ // token expired

                console.log("token expired...");

                this.setState({
                    loading: 1,
                    error: true,
                    errorMessage: "Token expired. Please reload the page.",
                    //redirect: true,
                })

            } else {

                console.log("error occurred...");

                this.setState({
                    error: true,
                    errorMessage: "Unexpected error. Please re-try again.",
                    loading: 1,
                })
            }

        }).catch(error => {

            console.log(error);

            this.setState({
                error: true,
                errorMessage: "Unexpected error. Server problem.",
                loading: 1,
            })
        })

    }

    reloadApp() {
        
        this.setState({
            items: [],
            loading: 2,
        })

        setTimeout(() => {
            this.getList();
        }, 1200);

    }

    render() {

        if(this.state.loading === 0) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <div className={classes.container}>
                <div onClick={this.reloadApp} className={classes.reload}><span>&#8635;</span></div>
                {
                    this.state.loading === 2 &&
                    <div className={classes.loader}>
                        <div className={classes.cycle}><span>&#10561;</span></div>
                    </div>
                }
                {
                    (this.state.loading === 1 && this.state.error) &&
                    <div className={classes.error}>
                        <span>{ this.state.errorMessage }</span>
                    </div>
                }
                {
                    (this.state.loading === 1 && !this.state.error && this.state.items.length === 0)&&
                    <div className={classes.empty}>
                        <span>Data not found.</span>
                    </div>
                }
                {
                    (this.state.loading === 1 && !this.state.error && this.state.items.length > 0)&&
                    <div className={classes.list}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.items.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index}</td>
                                            <td>{item.value}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                }
                {
                    this.state.redirect &&
                    <Redirect to="/login" />
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