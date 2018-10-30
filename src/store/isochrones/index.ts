import { Layer, Layers, Points, Isochrones } from 'app/types'
import { Action, RootState } from 'app/store'
import { Epic } from 'redux-observable'

import { concat } from 'rxjs/observable/concat'
import { ajax } from 'rxjs/ajax'
import { filter, map, switchMap, reduce, takeUntil } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { featureCollection } from '@turf/helpers'
const uuid = require('uuid/v1')
import {
  validatePointsRequest,
  composePointsRequest,
  parsePointsResponse,
  validateIsochronesRequest,
  composeIsochronesRequest,
  getOrFetchIsochronesRequest
} from './utils'

const mountPoint = 'isochrones'

const SET_LAYERS = `@@isochronic/${mountPoint}/SET_LAYERS`
const SET_LAYER = `@@isochronic/${mountPoint}/SET_LAYER`
const ADD_LAYER = `@@isochronic/${mountPoint}/ADD_LAYER`
const REMOVE_LAYER = `@@isochronic/${mountPoint}/REMOVE_LAYER`
const CLEAR_LAYER = `@@isochronic/${mountPoint}/CLEAR_LAYER`
const SET_POINTS = `@@isochronic/${mountPoint}/SET_POINTS`
const SET_ISOCHRONES = `@@isochronic/${mountPoint}/SET_ISOCHRONES`
const FETCH_POINTS = `@@isochronic/${mountPoint}/FETCH_POINTS`
const FETCH_ISOCHRONES = `@@isochronic/${mountPoint}/FETCH_ISOCHRONES`

const MINUTE_IN_MILLISECONDS = 60 * 1000

export type State = {
  layers: Layers,
  points: Points,
  isochrones: Isochrones
}

export const initialState: State = {
  layers: [],
  points: featureCollection([]),
  isochrones: []
}

// reducers
const setLayersReducer = (state: State, action: Action): State => ({
  ...state,
  layers: action.payload
})

const setLayerReducer = (state: State, action: Action): State => ({
  ...state,
  layers: state.layers.map((d, index) => index === action.params.index ? { ...d, ...action.payload } : d)
})

const addLayerReducer = (state: State, action: Action): State => ({
  ...state,
  layers: [
    ...state.layers,
    {
      id: uuid(),
      name: '',
      coordinates: null
    }
  ]
})

const removeLayerReducer = (state: State, action: Action): State => ({
  ...state,
  layers: state.layers.filter((_, index) => index !== action.params.index)
})

const clearLayerReducer = (state: State, action: Action): State => ({
  ...state,
  layers: state.layers.map((d, index) =>
  index === action.params.index
    ? { ...d, name: '', coordinates: null }
    : d
  )
})

const setPointsReducer = (state: State, action: Action): State => ({
  ...state,
  points: action.payload
})

const setIsochronesReducer = (state: State, action: Action): State => ({
  ...state,
  isochrones: action.payload
})

const reducer = (
  state: State = initialState,
  action: Action
): State => {
  switch (action.type) {
    case SET_LAYERS: return setLayersReducer(state, action)
    case SET_LAYER: return setLayerReducer(state, action)
    case ADD_LAYER: return addLayerReducer(state, action)
    case REMOVE_LAYER: return removeLayerReducer(state, action)
    case CLEAR_LAYER: return clearLayerReducer(state, action)
    case SET_POINTS: return setPointsReducer(state, action)
    case SET_ISOCHRONES: return setIsochronesReducer(state, action)
    default: return state
  }
}

// actions
const setLayers = (layers: Layers): Action => ({ type: SET_LAYERS, payload: layers })
const setLayer = (layer: Layer, index: number): Action => ({ type: SET_LAYER, payload: layer, params: { index } })
const addLayer = (): Action => ({ type: ADD_LAYER })
const removeLayer = (index: number): Action => ({ type: REMOVE_LAYER, params: { index } })
const clearLayer = (index: number): Action => ({ type: CLEAR_LAYER, params: { index } })
const setPoints = (points: Points): Action => ({ type: SET_POINTS, payload: points })
const setIsochrones = (isochrones: Isochrones): Action => ({ type: SET_ISOCHRONES, payload: isochrones })
const fetchPoints = (): Action => ({ type: FETCH_POINTS })
const fetchIsochrones = (): Action => ({ type: FETCH_ISOCHRONES })

// epics
const setLayersEpic: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    filter(({ type }) => [SET_LAYERS, SET_LAYER, SET_POINTS].includes(type)),
    map(() => store$.value),
    map(fetchIsochrones)
  )

const fetchPointsEpic: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    ofType(FETCH_POINTS),
    map(() => store$.value),
    filter(validatePointsRequest),
    map(composePointsRequest),
    switchMap((request) =>
      ajax({
        ...request,
        timeout: MINUTE_IN_MILLISECONDS
      }).pipe(
        takeUntil(action$.pipe(ofType(FETCH_POINTS))),
        map(({ response }) => response),
        map(parsePointsResponse),
        map(setPoints)
      )
    )
  )

const fetchIsochronesEpic: Epic<Action, Action, RootState> = (action$, store$) =>
  action$.pipe(
    ofType(FETCH_ISOCHRONES),
    map(() => store$.value),
    map((state) => ({
      layers: getLayers(state),
      points: getPoints(state)
    })),
    filter(validateIsochronesRequest),
    map(composeIsochronesRequest),
    switchMap((requests) =>
      concat(
        ...requests.map(getOrFetchIsochronesRequest)
      ).pipe(
        reduce((memo, d) => [ ...memo, d ], []),
        map(setIsochrones)
      )
    )
  )

// selectors
const getLayers = (store: RootState): Layers => store[mountPoint].layers
const getPoints = (store: RootState): Points => store[mountPoint].points
const getIsochrones = (store: RootState): Isochrones => store[mountPoint].isochrones

// exposed
export { mountPoint }

export const constants = {
  SET_LAYERS,
  SET_LAYER,
  ADD_LAYER,
  REMOVE_LAYER,
  CLEAR_LAYER,
  SET_POINTS,
  SET_ISOCHRONES,
  FETCH_POINTS,
  FETCH_ISOCHRONES
}

export const actions = {
  setLayers,
  setLayer,
  addLayer,
  removeLayer,
  clearLayer,
  setPoints,
  setIsochrones,
  fetchPoints,
  fetchIsochrones
}

export const epics = [
  setLayersEpic,
  fetchPointsEpic,
  fetchIsochronesEpic
]

export const selectors = {
  getLayers,
  getPoints,
  getIsochrones
}

export { reducer }

export const reducers = {
  setLayersReducer,
  setPointsReducer,
  setIsochronesReducer
}
