import React from 'react';
import App from './main/App';
import './index.css';
import 'semantic-ui/dist/semantic.min.css';
import {render} from 'react-dom'
import {hashHistory, Route, Router} from 'react-router';

import BucketsPage from "./bucket/BucketsPage";
import BucketDetail from "./bucket/BucketDetail";
import GoalsPage from "./goal/GoalsPage";
import GoalDetail from "./goal/GoalDetail";

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/goals" component={GoalsPage}/>
            <Route path="/goals/:goalId" component={GoalDetail}/>
            <Route path="/buckets" component={BucketsPage}/>
            <Route path="/buckets/:bucketId" component={BucketDetail}/>
        </Route>
    </Router>
), document.getElementById('root'));