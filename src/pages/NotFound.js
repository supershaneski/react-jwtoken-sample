import React from 'react';
import { connect }  from 'react-redux';
import { withRouter } from "react-router-dom";
import { setUserParam } from '../redux/';

function Page() {
    return (
        <div>
            <span>Home</span>
        </div>
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
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Page));