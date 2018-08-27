import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { selectors } from 'app/store'

import SinglePointOverlay from './SinglePointOverlay'

const IsochronesOverlay = ({ isochrones, map }) =>
  isochrones.length === 0
    ? null
    : isochrones.length === 1
      ? <SinglePointOverlay data={isochrones[0]} map={map} />
      : null

const getActiveIsochrones = createSelector(
  [selectors.isochrones.getLayers, selectors.isochrones.getIsochrones],
  (layers, isochrones) =>
    isochrones
      .filter((isochrone) => {
        const layer = layers.find((layer) => layer.id === isochrone.properties.id)
        if (!layer) return false
        if (layer.coordinates === null) return false
        return true
      })
)

const mapStoreToProps = (store) => ({
  isochrones: getActiveIsochrones(store)
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(IsochronesOverlay)
