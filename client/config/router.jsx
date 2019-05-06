import React from 'react'
import {
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={
        (props) => (
          isLogin
            ? <Component {...props} />
            : <Redirect
              to={{
                pathname: '/user/login',
                search: `?from=${rest.path}`, // eslint-disable-line
              }}
            />
        )
      }
    />
  )
}

const InjectedPrivateRoute = withRouter(inject(({ appState }) => {
  return {
    isLogin: appState.user.isLogin,
  }
})(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  component: PropTypes.element.isRequired,
  isLogin: PropTypes.bool,
}

PrivateRoute.defaultProps = {
  isLogin: false,
}

export default () => [
  <Route path="/" exact render={() => <Redirect to="/index" />} key="/" />,
  <Route path="/index" component={TopicList} exact key="index" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact key="user-login" component={UserLogin} />,
  <InjectedPrivateRoute path="/user/info" component={UserInfo} key="user-info" />,
]
