import * as React from 'react'
import { PureComponent } from 'react'

const uid: Function = (): string => Math.random().toString(32).slice(2)

export type Props = {
  map: Object,
  id: string,
  data: string | Object,
  type: string,
  layout: Object,
  paint: Object,
  before: string,
  onFeatureClick: Function,
  onFeatureHover: Function
}

class GeoJSONOverlay extends PureComponent<Props> {
  id = null
  attached = false
  layer = {}

  _previous = null

  componentDidMount () {
    const { id } = this.props
    this.id = id || uid()
    this.forceUpdate()
  }

  componentDidUpdate () {
    this.waitForLoaded()
  }

  componentWillUnmount () {
    const { map } = this.props
    const { ids } = this.layer
    if (!map || !map.style) return
    if (map.getSource(ids.source)) map.removeSource(ids.source)
    if (map.getLayer(ids.layer)) map.removeLayer(ids.layer)
  }

  render () {
    return null
  }

  waitForLoaded = () => {
    const { map } = this.props
    if (!map.loaded()) return setTimeout(this.waitForLoaded, 300)
    if (!this.attached) {
      this.attached = true
      this.attach()
    }
    this.redraw()
  }

  redraw = (msg) => {
    const { map, data, type, layout, paint, before } = this.props

    this.layer = {
      data,
      ids: {
        source: `${this.id}-data`,
        layer: this.id
      }
    }

    if (!map.getSource(this.layer.ids.source)) {
      map
        .addSource(this.layer.ids.source, {
          type: 'geojson',
          data: this.layer.data
        })
        .addLayer({
          source: this.layer.ids.source,
          id: this.layer.ids.layer,
          type,
          paint,
          layout
        }, before)
    } else {
      map
        .getSource(this.layer.ids.source)
        .setData(this.layer.data)
        // FIXME: it’s brutal, but it’s better than individually setting layer properties
      map
        .removeLayer(this.layer.ids.layer)
        .addLayer({
          source: this.layer.ids.source,
          id: this.layer.ids.layer,
          type,
          paint,
          layout
        }, before)
    }
  }

  attach = () => {
    const { map, onFeatureClick, onFeatureHover } = this.props
    if (onFeatureClick) map.on('click', this.handleClick)
    if (onFeatureHover) map.on('mousemove', this.handleHover)
  }

  handleClick = (evt) => {
    if (!this.id) return
    const { map, onFeatureClick } = this.props
    const [ feature ] = map.queryRenderedFeatures(evt.point, {layers: [this.id]})
    if (feature) return onFeatureClick(feature.properties)
  }

  handleHover = (evt) => {
    if (!this.id) return
    const { map, onFeatureHover } = this.props
    const previous = this._previous
    const [ feature = {properties: null} ] = map.queryRenderedFeatures(evt.point, {layers: [this.id]})
    const { properties } = feature
    const stringified = JSON.stringify(properties)
    this._previous = stringified
    return previous === stringified
      ? null
      : onFeatureHover(feature.properties)
  }
}

GeoJSONOverlay.defaultProps = {
  data: {},
  type: 'circle',
  layout: {},
  paint: {},
  onFeatureClick: null,
  onFeatureHover: null
}

GeoJSONOverlay.displayName = 'GeoJSONOverlay'

export default GeoJSONOverlay
export { GeoJSONOverlay }
