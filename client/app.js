import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import lightBlue from '@material-ui/core/colors/lightBlue'
import pink from '@material-ui/core/colors/pink'

import App from './views/App'
import { AppState, TopicStore } from './store/store'

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: lightBlue,
  },
})

const initialState = window.__INITIAL__STATE__ || {} //eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main
}

const appState = new AppState(initialState.topicStore)
const topicStore = new TopicStore(initialState.topicStore)

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <Provider appState={appState} topicStore={topicStore}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <Component />
        </MuiThemeProvider>
      </BrowserRouter>
    </Provider>,
    root,
  )
}
render(createApp(App))
render(App)
if (module.hot) {
  module.hot.accept(App, () => {
    const NextApp = App.default
    render(createApp(NextApp))
  });
}
