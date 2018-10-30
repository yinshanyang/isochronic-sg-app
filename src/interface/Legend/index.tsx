import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { selectors } from 'app/store'

const colors = ['#f0f9e8', '#bae4bc', '#7bccc4', '#2b8cbe']

const Legend = ({ layers }) =>
  layers.length && (
    <div
      className='absolute bottom-1 left-1 right-1 br2 bg-background-100 pv2 ph3 f7 lh-copy'
      style={{ maxWidth: 384 }}
    >
      <div>
        {'Areas accessible from '}
        {
          layers.map(({ name }, index) => (
            <React.Fragment>
              {
                (layers.length > 1 && index !== 0) && (
                  index === layers.length - 1
                    ? ' and '
                    : ', '
                )
              }
              <span className='fw6'>{name}</span>
            </React.Fragment>
          ))
        }
        {' within:'}
      </div>
      <div className='w-100 mt1 flex'>
        <div className='ph1 w-100 br b--background-100 f8 ttu flex-auto' style={{background: colors[0]}}>15</div>
        <div className='ph1 w-100 br b--background-100 f8 ttu flex-auto' style={{background: colors[1]}}>30</div>
        <div className='ph1 w-100 br b--background-100 f8 ttu flex-auto' style={{background: colors[2]}}>45</div>
        <div className='ph1 w-100 f8 ttu flex-auto' style={{background: colors[3]}}>
          {'60 '}
          <span className='dn di-ns'>minutes</span>
          <span className='di dn-ns'>min</span>
        </div>
      </div>
    </div>
  )

const getLayers = createSelector(
  [selectors.isochrones.getLayers],
  (layers) => layers.filter(({ coordinates }) => coordinates !== null)
)

const mapStoreToProps = (store) => ({
  layers: getLayers(store)
})

const mapDispatchToProps = {}

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(Legend)
