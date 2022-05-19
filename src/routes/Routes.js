import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import _ from "underscore";
import auth from "./auth";
import fv from "./fv";
import vt from "./vt";
import st from "./st";
import cm from "./cm";
import cp from "./cp";
import bs from "./bs";
import rh from "./rh";
import Test from "../pages/Test";
import TestComponent from "../pages/test/TestCabecera";
function Routes() {
    const route = _.union(auth, fv, vt, st, bs, cm, cp, rh);
    return (
        <HashRouter>
            {route.map((item) => (
                <Route exact 
                    key={item.path}
                    path={item.path} 
                    component={item.component}/>
            ))}
            <Route exact path={"/test"} component={Test} />
            <Route exact path={"/test_component"} component={TestComponent} />
        </HashRouter>
    );
}
export default Routes;