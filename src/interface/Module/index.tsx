import * as React from 'react'

import Map from 'app/interface/Map'
import Layers from 'app/interface/Layers'
import Legend from 'app/interface/Legend'
import MadeBy from 'app/interface/MadeBy'

const Module = () => (
  <div className='w-100 h-100'>
    <Map />
    <Layers />
    <Legend />
    <MadeBy />
  </div>
)

export default Module
