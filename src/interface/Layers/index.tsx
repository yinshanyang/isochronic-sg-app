import * as React from 'react'
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { actions, selectors } from 'app/store'
const GoogleMapsLoader = require('google-maps')

import GeoCoder from 'react-geosuggest'
import Add from 'app/interface/common/icons/Add'
import Clear from 'app/interface/common/icons/Clear'
import Remove from 'app/interface/common/icons/Remove'

let googleMaps = null
GoogleMapsLoader.KEY = 'AIzaSyBG0SybP0EKWH3Jvwki7IR5AMyO_cUeeQc'
GoogleMapsLoader.LIBRARIES = ['places']

GoogleMapsLoader.load((google) => {
  googleMaps = google.maps
})

const classNames = {
  container: 'relative w-100 br2 bg-background-100',
  input: 'bn w-100 h2 outline-0 pa3 pr5 bg-background-100 sans-serif br2',
  suggests: 'w-100 list pa0 ma0 bg-background-100 bt b--background-90 text-normal-40 shadow-2 overflow-hidden br2 br--bottom',
  suggestsHidden: 'dn',
  suggestItem: 'pv2 ph3 bb b--background-90 pointer underline-hover truncate',
  suggestItemActive: 'bg-background-90 text-normal-100'
}

class Layer extends PureComponent {
  constructor (props) {
    super(props)
    this.geocoder = React.createRef()
  }

  getSuggestLabel = ({ description }) => description.replace(/, Singapore$/, '')

  render () {
    const { layer, disableRemove, googleMaps } = this.props
    return (
      <div className='relative mb1 br2 shadow-2 bg-background-100'>
        <GeoCoder
          ref={this.geocoder}
          placeholder='Search…'
          initialValue={layer.name}
          country='sg'
          types={['establishment', 'geocode']}
          googleMaps={googleMaps}
          getSuggestLabel={this.getSuggestLabel}
          className={classNames.container}
          inputClassName={classNames.input}
          suggestsClassName={classNames.suggests}
          suggestsHiddenClassName={classNames.suggestsHidden}
          suggestItemClassName={classNames.suggestItem}
          suggestItemActiveClassName={classNames.suggestItemActive}
          autoActivateFirstSuggest={true}
          onSuggestSelect={this.handleChange}
        />
        <div className='absolute h2 top-0 right-0 f6 flex flex-row items-center justify-center z-1'>
          {
            layer.name && (
              <a
                className='db ph3 h-100 pointer flex flex-row items-center justify-center'
                onClick={this.handleClear}
              >
                <Clear />
              </a>
            )
          }
          {
            !disableRemove && (
              <a
                className='db bg-background-60 br2 br--right ph3 h-100 pointer flex flex-row items-center justify-center'
                onClick={this.handleRemove}
              >
                <Remove />
              </a>
            )
          }
        </div>
      </div>
    )
  }

  handleChange = (selection) => {
    if (selection) {
      const { index, onChange } = this.props
      const { label, location } = selection
      this.geocoder.current.blur()
      return onChange({ name: label, coordinates: [location.lng, location.lat] })
    }
    else {
      this.handleClear()
    }
  }

  handleRemove = () => this.props.onRemove()

  handleClear = () => this.props.onClear()
}

class Layers extends PureComponent {
  render () {
    const { layers, googleMaps } = this.props
    return googleMaps && (
      <div
        className='absolute top-1 left-1 right-1 sans-serif f7 lh-solid'
        style={{ maxWidth: 320 }}
      >
        {
          layers.map((layer, index) => (
            <Layer
              key={index}
              layer={layer}
              googleMaps={googleMaps}
              disableRemove={index === 0}
              onChange={this.handleChange(index)}
              onRemove={this.handleRemove(index)}
              onClear={this.handleClear(index)}
            />
          ))
        }
        {
          layers.length < 3 && (
            <a
              className='db center mt2 w2 h2 f4 bg-primary-100 fill-background-100 br-100 flex flex-row items-center justify-center shadow-2 pointer'
              onClick={this.handleAdd}
            >
              <Add />
            </a>
          )
        }
      </div>
    )
  }

  handleChange = (index: number) => (layer) => this.props.onChange(layer, index)

  handleAdd = () => this.props.onAdd()

  handleRemove = (index: number) => () => this.props.onRemove(index)

  handleClear = (index: number) => () => this.props.onClear(index)
}

const mapStoreToProps = (store) => ({
  layers: selectors.isochrones.getLayers(store),
  googleMaps
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (layer, index) => dispatch(actions.isochrones.setLayer(layer, index)),
  onAdd: () => dispatch(actions.isochrones.addLayer()),
  onRemove: (index) => dispatch(actions.isochrones.removeLayer(index)),
  onClear: (index) => dispatch(actions.isochrones.clearLayer(index))
})

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(Layers)
