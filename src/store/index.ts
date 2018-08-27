import { combineReducers } from 'redux'
import { ofType, combineEpics } from 'redux-observable'
import { map, mapTo } from 'rxjs/operators'
import { tap, ignoreElements } from 'rxjs/operators'

import * as core from './core'
import * as isochrones from './isochrones'

import { Epic } from 'redux-observable'

export interface Action {
  type: string
  payload?: any
  params?: any
}

export type RootState = {
  core: core.State
  isochrones: isochrones.State
}

// logger epic
const logger: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    tap((action) => console.log(action, store$.value)),
    ignoreElements()
  )

// connected epics
const listenSetInitialStateToSetDefaultLayer: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    ofType(core.constants.SET_INITIAL_STATE),
    mapTo(isochrones.actions.setLayers([
      {
        id: 'default',
        coordinates: [103.851523, 1.284127],
        name: 'Raffles Place'
      }
    ]))
  )

const listenSetInitialStateToFetchPoints: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    ofType(core.constants.SET_INITIAL_STATE),
    map(isochrones.actions.fetchPoints)
  )

const epics = combineEpics<Action, Action, RootState>(
  ...[...core.epics, ...isochrones.epics],
  logger,
  listenSetInitialStateToSetDefaultLayer,
  listenSetInitialStateToFetchPoints
)

const reducer = combineReducers({
  [core.mountPoint]: core.reducer,
  [isochrones.mountPoint]: isochrones.reducer
})

const actions = {
  [core.mountPoint]: core.actions,
  [isochrones.mountPoint]: isochrones.actions
}

const selectors = {
  [core.mountPoint]: core.selectors,
  [isochrones.mountPoint]: isochrones.selectors
}

export { actions, selectors, epics, reducer }
