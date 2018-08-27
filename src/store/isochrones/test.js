import 'babel-register'
import test from 'ava'
import { addLayerReducer, actions } from './index.ts'

test('addLayerReducer', (t) => {
  const state = {
    layers: []
  }
  const expected = {
    layers: [{
      name: '',
      coordinates: null
    }]
  }
  const value = {}
})
