import { ofType } from 'redux-observable'
import { mapTo } from 'rxjs/operators'

import { Action, RootState } from 'app/store'
import { Epic } from 'redux-observable'

const mountPoint = 'core'

const REQUEST_INITIAL_STATE = `@@isochronic/${mountPoint}/REQUEST_INITIAL_STATE`
const SET_INITIAL_STATE = `@@isochronic/${mountPoint}/SET_INITIAL_STATE`

export interface State {}

export const initialState: State = {}

// reducers
const setInitialStateReducer = (state: State, action: Action): State => ({
  ...state,
  ...action.payload
})

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_INITIAL_STATE: return setInitialStateReducer(state, action)
    default: return state
  }
}

// actions
const requestInitialState = () => ({ type: REQUEST_INITIAL_STATE })

// epics
const fetchInitialState: Epic<Action, Action, RootState> = (action$) =>
  action$.pipe(
    ofType(REQUEST_INITIAL_STATE),
    mapTo({ type: SET_INITIAL_STATE, payload: {} })
  )

// selectors

// exposed
export { mountPoint }

export const constants = {
  REQUEST_INITIAL_STATE,
  SET_INITIAL_STATE
}

export const actions = {
  requestInitialState
}

export const epics = [
  fetchInitialState
]

export const selectors = {}

export { reducer }
