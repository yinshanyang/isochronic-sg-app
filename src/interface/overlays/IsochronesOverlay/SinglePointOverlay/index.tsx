import * as React from 'react'
import { connect } from 'react-redux'

import GeoJSONOverlay from 'app/interface/common/GeoJSONOverlay'

// works well with light
// opacity should be 1/0.25
// const colors = ['#6b6b6b','#667e90','#7f9eb6','#afbdc8']

// other light colors
// const colors = ['#333333','#486072','#6d8fa8','#a7bed2']
// const colors = ['#333333','#49595f','#6d8077','#9aa880']
// const colors = ['#333333','#485672','#916ea3','#b699b7']
// const colors = ['#333333','#3c5b65','#96708c','#b79ab3']
// const colors = ['#333333','#445a58','#678079','#c29b81']
// const colors = ['#333333','#425a5a','#558383','#79acac']
// const colors = ['#333333','#3c4e4d','#4e8584','#70bebd']
// const colors = ['#333333','#7d2d53','#cf515d','#e59f92']
// const colors = ['#333333','#4a3f89','#6175d1','#83b4e9']
// const colors = ['#6b6b6b','#6e76d8','#82abf2','#addff6']
// const colors = ['#6b6b6b','#688397','#90aec6','#ccd9e3']
// const colors = ['#6b6b6b','#697e83','#9b9d78','#bebca8']

// dark
const colors = ['#f0f9e8', '#bae4bc', '#7bccc4', '#2b8cbe']

const config = {
  id: 'contours',
  before: 'place-neighbourhood',
  type: 'line',
  layout: {},
  paint: {
    'line-color': {
      property: 'time',
      stops: [
        [0, colors[0]],
        [899.9, colors[0]],
        [900, colors[0]],
        [900.1, colors[1]],
        [1799.9, colors[1]],
        [1800, colors[1]],
        [1800.1, colors[2]],
        [2699.9, colors[2]],
        [2700, colors[2]],
        [2700.1, colors[3]],
        [3599.9, colors[3]],
        [3600, colors[3]]
      ]
    },
    'line-opacity': {
      property: 'time',
      stops: [
        [0, 0.2],
        [899.9, 0.2],
        [900, 1],
        [900.1, 0.2],
        [1799.9, 0.2],
        [1800, 1],
        [1800.1, 0.2],
        [2699.9, 0.2],
        [2700, 1],
        [2700.1, 0.2],
        [3599.9, 0.2],
        [3600, 1]
      ]
    }
  }
}

const SinglePointOverlay = ({ config, data, ...props }) =>
  <GeoJSONOverlay
    {...props}
    {...config}
    data={data}
  />

const mapStoreToProps = (store) => ({ config })

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(SinglePointOverlay)
