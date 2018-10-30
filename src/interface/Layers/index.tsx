import * as React from 'react'
const { useRef } = require('react')
import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { actions, selectors } from 'app/store'
const GoogleMapsLoader = require('google-maps')

const GeoCoder = require('react-geosuggest').default
import Add from 'app/interface/common/icons/Add'
import Clear from 'app/interface/common/icons/Clear'
import Remove from 'app/interface/common/icons/Remove'

let googleMaps = null
GoogleMapsLoader.KEY = 'AIzaSyBG0SybP0EKWH3Jvwki7IR5AMyO_cUeeQc'
GoogleMapsLoader.LIBRARIES = ['places']
GoogleMapsLoader.load((google) => { googleMaps = google.maps })

const classNames = {
  className: 'relative w-100 br2 bg-background-100',
  inputClassName: 'bn w-100 h2 outline-0 pa3 pr5 bg-background-100 sans-serif br2',
  suggestsClassName: 'w-100 list pa0 ma0 bg-background-100 bt b--background-90 text-normal-40 shadow-2 overflow-hidden br2 br--bottom',
  suggestsHiddenClassName: 'dn',
  suggestItemClassName: 'pv2 ph3 bb b--background-90 pointer underline-hover truncate',
  suggestItemActiveClassName: 'bg-background-90 text-normal-100'
}

const Layer = ({ index, layer, disableRemove, googleMaps, onChange, onRemove, onClear }) => {
  const ref = useRef()

  function getSuggestLabel ({ description }) {
    return description.replace(/, Singapore$/, '')
  }

  console.log(ref)

  function handleChange (selection) {
    if (selection) {
      const { label, location } = selection
      ref.current.blur()
      return onChange({ name: label, coordinates: [location.lng, location.lat] })
    }
    else {
      handleClear()
    }
  }

  function handleRemove () { return onRemove() }

  function handleClear () { return onClear() }

  return (
    <div className='relative mb1 br2 shadow-2 bg-background-100'>
      <GeoCoder
        ref={ref}
        {...classNames}
        placeholder='Search…'
        initialValue={layer.name}
        country='sg'
        types={['establishment', 'geocode']}
        googleMaps={googleMaps}
        getSuggestLabel={getSuggestLabel}
        autoActivateFirstSuggest={true}
        onSuggestSelect={handleChange}
      />
      <div className='absolute h2 top-0 right-0 f6 flex flex-row items-center justify-center z-1'>
        {
          layer.name && (
            <a
              className='db ph3 h-100 pointer flex flex-row items-center justify-center'
              onClick={handleClear}
            >
              <Clear />
            </a>
          )
        }
        {
          !disableRemove && (
            <a
              className='db bg-background-60 br2 br--right ph3 h-100 pointer flex flex-row items-center justify-center'
              onClick={handleRemove}
            >
              <Remove />
            </a>
          )
        }
      </div>
    </div>
  )
}

const Layers = ({ layers, googleMaps, onChange, onAdd, onRemove, onClear }) => {
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
            onChange={() => onChange(index)}
            onRemove={() => onRemove(index)}
            onClear={() => onClear(index)}
          />
        ))
      }
      <a
        className='db center mt2 w2 h2 f4 bg-primary-100 fill-background-100 br-100 flex flex-row items-center justify-center shadow-2 pointer'
        onClick={onAdd}
      >
        <Add />
      </a>
    </div>
  )
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
