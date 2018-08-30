import * as React from 'react'
import { connect } from 'react-redux'
import intersect from '@turf/intersect'
import { featureCollection } from '@turf/helpers'

import GeoJSONOverlay from 'app/interface/common/GeoJSONOverlay'

// const colors = [["0|0","#ffffff"],["0|1","#a7e6ec"],["0|2","#85c3c9"],["1|0","#edd6da"],["1|1","#b9b9b9"],["1|2","#779ea2"],["2|0","#e1aab4"],["2|1","#cb8391"],["2|2","#777777"]]
const colors = [
  ['0|0', '#f0f9e8'],
  ['1|1', '#bae4bc'],
  ['2|2', '#7bccc4'],
  ['3|3', '#2b8cbe']
]

const configs = {
  line: {
    id: 'intersections-line',
    before: 'place-neighbourhood',
    type: 'line',
    layout: {},
    paint: {
      'line-color': {
        type: 'categorical',
        property: 'index',
        stops: colors
      }
    }
  },
  fill: {
    id: 'intersections-fill',
    before: 'water',
    type: 'fill',
    layout: {},
    paint: {
      'fill-color': {
        type: 'categorical',
        property: 'index',
        stops: colors
      },
      'fill-opacity': 1
    }
  }
}

const MultiPointOverlay = ({ configs, data, ...props }) => (
  <React.Fragment>
    <GeoJSONOverlay
      {...configs.line}
      {...props}
      data={data}
    />
    <GeoJSONOverlay
      {...configs.fill}
      {...props}
      data={data}
    />
  </React.Fragment>
)

const getIntersections = (data) => {
  const a = [
    data[0].features[15],
    data[0].features[30],
    data[0].features[45]
  ]
  const b = [
    data[1].features[15],
    data[1].features[30],
    data[1].features[45]
  ]

  let matrix = []
  for (let i = a.length; i--;) {
    for (let j = b.length; j--;) {
      const _a = a[i]
      const _b = b[j]
      const intersection = intersect(_a, _b)
      if (intersection) intersection.properties = { index: [i, j].join('|'), indices: [i, j], score: i + j }
      matrix.push(intersection)
    }
  }

  matrix = matrix
    .filter((d) => d)
    .filter((feature) => feature.properties.indices[0] === feature.properties.indices[1])

  return featureCollection(matrix)
}

const mapStoreToProps = (store, props) => ({
  data: getIntersections(props.data),
  configs
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(MultiPointOverlay)
