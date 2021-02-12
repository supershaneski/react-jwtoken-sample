import React from 'react';
import { connect }  from 'react-redux';
import { withRouter, Redirect } from "react-router-dom";
import { setUserParam } from '../redux/';
import { getData } from '../server/';
import classes from './Home.module.css';

class Page extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            loading: 0,
            items: [],
            redirect: false,
            error: false,
        }

        this.getList = this.getList.bind(this);

    }

    componentDidMount() {

        const { token } = this.props.user;
        if(token.length === 0) {

            this.setState({
                loading: 1,
                redirect: true,
            })
            return;

        }

        this.getList();

    }

    getList() {

        getData({ token: this.props.user.token }).then(data => {
            
            const status = typeof data.status !== "undefined" ? parseInt(data.status) : 0;
            if(status === 200) {

                this.setState({
                    items: data.items,
                    loading: 1,
                    error: false,
                })

            } else if(status == 401){ // token expired

                this.setState({
                    loading: 1,
                    redirect: true,
                })
                return;

            } else {
                this.setState({
                    error: true,
                    loading: 1,
                })
            }

        }).catch(error => {
            console.log(error);

            this.setState({
                error: true,
                loading: 1,
            })
        })

    }

    render() {

        if(this.state.loading === 0) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <div className={classes.container}>
                {
                    this.state.error &&
                    <div className={classes.error}>
                        <span>Unexpected error. Cannot get data from the server.</span>
                    </div>
                }
                {
                    (!this.state.error && this.state.items.length === 0)&&
                    <div className={classes.empty}>
                        <span>Data not found.</span>
                    </div>
                }
                {
                    (!this.state.error && this.state.items.length > 0)&&
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