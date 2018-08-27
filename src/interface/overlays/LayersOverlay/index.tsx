import * as React from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { selectors } from 'app/store'
import * as turf from '@turf/helpers'

import GeoJSONOverlay from 'app/interface/common/GeoJSONOverlay'

const config = {
  id: 'layers',
  type: 'circle',
  layout: {},
  paint: {
    'circle-color': '#f0f9e8',
    'circle-stroke-width': 0.75,
    'circle-stroke-color': '#1a1a1a'
  }
}

const LayersOverlay = ({ config, features, ...props }) =>
  <GeoJSONOverlay
    {...props}
    {...config}
    data={features}
  />

const getFeatures = createSelector(
  [selectors.isochrones.getLayers],
  (layers) =>
    turf.featureCollection(
      layers
        .filter(({ coordinates }) => coordinates !== null)
        .map(({ id, coordinates, name }) => turf.point(coordinates, { id, name }))
    )
)

const mapStoreToProps = (store) => ({
  config,
  features: getFeatures(store)
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(LayersOverlay)
