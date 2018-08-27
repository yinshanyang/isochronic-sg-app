import * as React from 'react'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import Config from 'app/config'

import MapGL from 'app/interface/common/MapGL'
import LayersOverlay from 'app/interface/overlays/LayersOverlay'
import IsochronesOverlay from 'app/interface/overlays/IsochronesOverlay'

export type Props = {
  config: any
}

class Map extends PureComponent<Props> {
  render () {
    const { config } = this.props
    return (
      <MapGL {...config}>
        <LayersOverlay />
        <IsochronesOverlay />
      </MapGL>
    )
  }
}

const mapStoreToProps = (store) => ({
  config: Config.map
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(Map)
