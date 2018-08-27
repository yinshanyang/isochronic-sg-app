import Config from 'app/config'
import { Layers, Points, Isochrones } from 'app/types'
import { Request } from 'app/types'
import * as d3 from 'd3-dsv'
import * as turf from '@turf/turf'

type Requests = Request[]

export const validatePointsRequest = (): boolean => true

export const composePointsRequest = (): Request => ({
  method: 'get',
  url: `${Config.data}/points/points.csv`,
  crossDomain: true,
  responseType: 'text'
})

export const parsePointsResponse = (data: string): Points =>
  turf.featureCollection(
    data
      ? d3.csvParse(data)
        .filter(({ data }: any) => data === 'true')
        .map(({ index, lat, lon }: any) => turf.point([+lon, +lat], { id: index }))
      : []
  )

export const validateIsochronesRequest = ({ layers, points }: { layers: Layers, points: Points }): boolean => layers.length && points.features.length

export const composeIsochronesRequest = ({ layers, points }: { layers: Layers, points: Points }): Requests =>
  layers
    .filter(({ coordinates }) => coordinates !== null)
    .map(({ id, coordinates }) => ({
      id,
      nearest: turf.nearestPoint(coordinates, points)
    }))
    .map(({ id, nearest }): Request =>
      ({
        method: 'get',
        url: `${Config.data}/isochrones/${nearest.properties.id}.geo.json`,
        crossDomain: true,
        responseType: 'json',
        id
      })
    )


export const parseIsochronesResponse = (isochrones: Isochrones) => isochrones
