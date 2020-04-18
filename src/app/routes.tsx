import { App } from "@containers";
import { makeStyles } from '@material-ui/core/styles';
import { Home, Settings } from "@views";
import * as React from "react";
import { Route, Switch } from "react-router-dom";

class Routes extends React.Component<any, any>{
    constructor(props) {
        super(props);
    }
    render() {
        return <React.Fragment>
            <App>
                <Route render={(location) => {
                    return <Switch location={location.location}>
                        <Route path="/settings" component={Settings} />
                        <Route path="/"  component={Home} />
                    </Switch>
                }} />

            </App>
        </React.Fragment>
    }
}

const style = makeStyles({
    transitionGroup: {
        position: "relative",
        '& .fade-enter': {
            transition: "all 0.5s",
            left: "calc(100vh)",
            opacity: 0,
            overflow: "hidden",
            zIndex: 999
        }
    }
});
// export default Routes;
export default Routes;