import * as React from 'react'
import { connect } from 'react-redux'
import intersect from '@turf/intersect'
import buffer from '@turf/buffer'
import { featureCollection } from '@turf/helpers'

import GeoJSONOverlay from 'app/interface/common/GeoJSONOverlay'

// const colors = [["0|0","#ffffff"],["0|1","#a7e6ec"],["0|2","#85c3c9"],["1|0","#edd6da"],["1|1","#b9b9b9"],["1|2","#779ea2"],["2|0","#e1aab4"],["2|1","#cb8391"],["2|2","#777777"]]
// const colors = [
//   ['0|0', '#f0f9e8'],
//   ['1|1', '#bae4bc'],
//   ['2|2', '#7bccc4'],
//   ['3|3', '#2b8cbe']
// ]

const colors = [
  [0, '#f0f9e8'],
  [1, '#bae4bc'],
  [2, '#7bccc4'],
  [3, '#2b8cbe']
]

const colorsFill = [
  [0, '#787c74'],
  [1, '#5e725f'],
  [2, '#3d6661'],
  [3, '#164860']
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
        stops: colorsFill
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

const closeFeature = (feature) => {
  if (feature.geometry.type === 'MultiPolygon') {
    feature.geometry.coordinates = feature.geometry.coordinates
      .map((polygon) =>
        polygon
          .filter((d) => d.length > 3)
          .map((lineRing) =>
            lineRing[0].join() !== lineRing[lineRing.length - 1].join()
              ? [ ...lineRing, lineRing[0] ]
              : lineRing
          )
      )
      .filter((d) => d.length)
  }
  else if (feature.geometry.type === 'Polygon') {
    feature.geometry.coordinates = feature.geometry.coordinates
      .filter((d) => d.length > 3)
      .map((lineRing) =>
        lineRing[0].join() !== lineRing[lineRing.length - 1].join()
          ? [ ...lineRing, lineRing[0] ]
          : lineRing
      )
      .filter((d) => d.length)
  }
  return feature.geometry.coordinates.length ? feature : null
}

const getIntersections = (data) => {
  console.time('intersection')
  const d = [15, 30, 45, 60]
    .map((index) => data.map((features) => features.features[index]))
  const matrix = d
    .map((d, index) =>
      d.reduce((a, b) => a ? intersect(closeFeature(a), b, { properties: { index } }) : null)
    )
    .filter((d) => d)
    .map(closeFeature)
    .map((d) => buffer(d, 0))
    .reverse()

  console.timeEnd('intersection')
  return featureCollection(matrix)
}

// colourful and with biases
// const getIntersections = (data) => {
//   const a = [
//     data[0].features[15],
//     data[0].features[30],
//     data[0].features[45]
//   ]
//   const b = [
//     data[1].features[15],
//     data[1].features[30],
//     data[1].features[45]
//   ]
//
//   let matrix = []
//   for (let i = a.length; i--;) {
//     for (let j = b.length; j--;) {
//       const _a = a[i]
//       const _b = b[j]
//       const intersection = intersect(_a, _b)
//       if (intersection) intersection.properties = { index: [i, j].join('|'), indices: [i, j], score: i + j }
//       matrix.push(intersection)
//     }
//   }
//
//   matrix = matrix
//     .filter((d) => d)
//     .filter((feature) => feature.properties.indices[0] === feature.properties.indices[1])
//
//   return featureCollection(matrix)
// }

const mapStoreToProps = (store, props) => ({
  data: getIntersections(props.data),
  configs
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(MultiPointOverlay)
