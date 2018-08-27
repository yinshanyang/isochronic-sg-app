import * as React from 'react'
import Map from 'app/interface/Map'
import Layers from 'app/interface/Layers'

const styles = {
  wrapper: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr',
    alignItem: 'stretch',
    justifyItems: 'stretch'
  },
  map: {}
}

const Module = () => (
  <div className='w-100 h-100' style={styles.wrapper}>
    <div style={styles.map}>
      <Map />
      <Layers />
    </div>
  </div>
)

export default Module
