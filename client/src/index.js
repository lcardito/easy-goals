import React from "react";
import AppMenu from "./main/AppMenu";
import "./index.css";
import "semantic-ui/dist/semantic.min.css";
import {render} from "react-dom";
import {hashHistory, Route, Router} from "react-router";
import {Provider} from "react-redux";

import BucketsPage from "./bucket/BucketsPage";
import BucketDetail from "./bucket/BucketReport";
import BucketForm from "./bucket/BucketForm";
import GoalsPage from "./goal/GoalsPage";
import Dashboard from "./dashboard/DashboardPage";
import EnsureLoggedInContainer from "./main/EnsureLoggedInContainer";

import {createStore} from "redux";
import LoginForm from "./main/LoginForm";
import cookie from "react-cookie";

function login(state = {}, action) {
    switch (action.type) {
        case 'LOG_IN':
            return state = {user: action.user};
        case 'LOG_OUT':
            cookie.remove('goals.user');
            return state = {user: {}};
        default:
            return state;
    }
}

let store = createStore(login, {user: cookie.load('goals.user')});

render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route component={AppMenu}>
                <Route path="/login" component={LoginForm}/>
                <Route component={EnsureLoggedInContainer}>
                    <Route path="/" component={Dashboard}/>
                    <Route path="/goals" component={GoalsPage}/>
                    <Route path="/buckets" component={BucketsPage}/>
                    <Route path="/buckets/:bucketId" component={BucketForm}/>
                    <Route path="/buckets/:bucketId/report" component={BucketDetail}/>
                </Route>
            </Route>
        </Router>
    </Provider>
), document.getElementById('root'));