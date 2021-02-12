import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

const SignIn = React.lazy(() => import('./pages/Login'));
const Home = React.lazy(() => import('./pages/Home'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

export const routes = [
    {
        component: Home,
        exact: true,
        path: "/"
    },
    {
        component: SignIn,
        exact: true,
        path: "/login"
    },
    {
        component: NotFound,
        exact: false,
        path: "*"
    }
]

const Routes = withRouter(({ location }) => {
    return (
    <Switch>
    {
        routes.map(route => {
            return (
                <Route 
                    key={route.path} 
                    exact={route.hasOwnProperty('exact') ? route.exact : false}
                    path={route.path} 
                    component={route.component}
                />
            )
        })
    }
    </Switch>
    )
})

export default Routes;