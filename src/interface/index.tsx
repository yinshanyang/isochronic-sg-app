import * as React from 'react'
import { PureComponent } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { actions, epics, reducer } from 'app/store'

import { Action, RootState } from 'app/store'
import { Store } from 'redux'

import _Module from './Module'

export type Props = {}
type State = {}

const middleware = createEpicMiddleware<Action, Action, RootState>()
const store: Store<RootState, Action> = createStore(
  reducer,
  applyMiddleware(middleware)
)
middleware.run(epics)

class Module extends PureComponent<Props, State> {
  store: Store<RootState, Action>

  constructor(props: Props) {
    super(props)
    this.store = store
  }

  componentDidMount() {
    this.store.dispatch(actions.core.requestInitialState())
  }

  render() {
    return (
      <Provider store={this.store}>
        <_Module />
      </Provider>
    )
  }
}

export default Module
