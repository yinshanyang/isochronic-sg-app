import * as React from 'react'

export type Props = {
  className: string
  path: string
}

const createIcon = (path) => ({ className = '', ...props }: Props) => (
  <svg
    className={['dib', className].join(' ')}
    style={{ width: '1em', height: '1em' }}
    viewBox='0 0 24 24'
    {...props}
  >
    {path}
  </svg>
)

export default createIcon
