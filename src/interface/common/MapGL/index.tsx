import * as React from 'react'
import { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
const mapboxgl = require('mapbox-gl')

export type Props = {
  className: string,
  apiKey: string,
  center: Array<number>,
  zoom: number,
  minZoom: number,
  maxZoom: number,
  mapStyle: string,
  fit: Array<Array<number>>,
  bbox: Array<Array<number>>
}

class MapGL extends PureComponent<Props> {
  mapElement = null

  constructor (props) {
    super(props)
    this.map = React.createRef()
  }

  componentDidMount () {
    const { apiKey, mapStyle, bbox, center, fit, zoom, minZoom, maxZoom } = this.props
    mapboxgl.accessToken = apiKey

    this.mapElement = new mapboxgl.Map({
      container: this.map.current,
      style: mapStyle,
      maxBounds: bbox,
      center,
      zoom,
      minZoom,
      maxZoom,
      attributionControl: false
    })

    this.mapElement.dragRotate.disable()
    this.mapElement.touchZoomRotate.disableRotation()

    if (fit) this.mapElement.fitBounds(fit, {padding: 10})

    this.forceUpdate()
    setTimeout(() => {
      this.mapElement.resize()
    }, 0)
  }

  componentWillUpdate (nextProps) {
    if (this.props.mapStyle !== nextProps.mapStyle) {
      this.mapElement.setStyle(nextProps.mapStyle)
    }
    if (nextProps.fit && JSON.stringify(this.props.fit) !== JSON.stringify(nextProps.fit)) {
      this.mapElement.fitBounds(nextProps.fit)
    }
  }

  componentWillUnmount () {
    this.mapElement && this.mapElement.remove()
  }

  render () {
    const { className } = this.props
    const map = this.mapElement
    const children = map
      ? React.Children.map(this.props.children, (child) => (
        child ? React.cloneElement(child, { map, layerContainer: map }) : null
      ))
      : null

    return (
      <div ref={this.map} className={[
        'h-100 w-100',
        className
      ].join(' ')}>
        {children}
      </div>
    )
  }
}

MapGL.defaultProps = {
  className: '',
  apiKey: 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2l6NHIxcWNnMDQ1aTJxcXdjdW1qOTYyNCJ9.326OLFxa-CJwreUPXpjMaA', // thank you uber.
  center: [0, 0],
  zoom: 5,
  minZoom: 1,
  maxZoom: 20,
  bbox: [[-180, -90], [180, 90]],
  mapStyle: 'mapbox://styles/mapbox/light-v9'
}

MapGL.displayName = 'MapGL'

export default MapGL
export { MapGL }
