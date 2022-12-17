import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from 'react-auth-kit'
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';

const engine = new Styletron();

ReactDom.render(
    <React.StrictMode>
        <ContextProvider>
            <StyletronProvider value={engine}>
                <AuthProvider authType = {'cookie'}
                            authName={'_auth'}
                            cookieDomain={window.location.hostname}
                            cookieSecure={false}>
                        <App/>
                    </AuthProvider>
            </StyletronProvider>
        </ContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
)