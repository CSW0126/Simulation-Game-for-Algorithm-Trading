import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from 'react-auth-kit'
import { Client as Styletron } from 'styletron-engine-atomic';
import { BaseProvider, LightTheme } from 'baseui';
import { Provider as StyletronProvider } from 'styletron-react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
const engine = new Styletron();

ReactDom.render(
    <React.StrictMode>
        <ContextProvider>
            <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                    <AuthProvider authType = {'cookie'}
                            authName={'_auth'}
                            cookieDomain={window.location.hostname}
                            cookieSecure={false}>
                        <App/>
                    </AuthProvider>
                </BaseProvider>
            </StyletronProvider>
        </ContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
)