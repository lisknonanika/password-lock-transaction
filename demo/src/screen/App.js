import React, {Suspense} from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Loader from 'react-loader-spinner'
import routes from '../routes';
import '../css/App.css';

class App extends React.Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    <div className="App-title">PLT Demo</div>
                </header>
                <main className="App-content">
                    <BrowserRouter>
                        <Suspense fallback={
                            <Loader
                                type="RevolvingDot"
                                color="#4070F4"
                                height={100}
                                width={100}
                                className="App-loading"
                            />
                        }>
                            <Switch>
                                {
                                    routes.map((route, index) => (
                                        <Route
                                            key={index}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={props => (<route.component {...props} />)}
                                        />
                                    ))
                                }
                                <Route render={() => <div>Page Not Found</div>} />
                            </Switch>
                        </Suspense>
                    </BrowserRouter>
                </main>
            </div>
        );
    }
}

export default App;
