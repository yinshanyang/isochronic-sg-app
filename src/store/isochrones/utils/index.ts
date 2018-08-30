import Config from 'app/config'
import { Layers, Points, Isochrones } from 'app/types'
import { Request } from 'app/types'
import { of } from 'rxjs/observable/of'
import { ajax } from 'rxjs/ajax'
import { map } from 'rxjs/operators'
import { tap } from 'rxjs/operators'
import * as d3 from 'd3-dsv'
import { featureCollection, point } from '@turf/helpers'
import nearestPoint from '@turf/nearest-point'

type Requests = Request[]

let cache = {}

export const validatePointsRequest = (): boolean => true

export const composePointsRequest = (): Request => ({
  method: 'get',
  url: `${Config.data}/points/points.csv`,
  crossDomain: true,
  responseType: 'text'
})

export const parsePointsResponse = (data: string): Points =>
  featureCollection(
    data
      ? d3.csvParse(data)
        .filter(({ data }: any) => data === 'true')
        .map(({ index, lat, lon }: any) => point([+lon, +lat], { id: index }))
      : []
  )

export const validateIsochronesRequest = ({ layers, points }: { layers: Layers, points: Points }): boolean => layers.length && points.features.length

export const composeIsochronesRequest = ({ layers, points }: { layers: Layers, points: Points }): Requests =>
  layers
    .filter(({ coordinates }) => coordinates !== null)
    .map(({ id, coordinates }) => ({
      id,
      nearest: nearestPoint(coordinates, points)
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

export const getOrFetchIsochronesRequest = (request: Request) =>
  cache[request.url]
    ? of({ ...cache[request.url], properties: { id: request.id } })
    : ajax({
      ...request,
      timeout: 60 * 1000
    }).pipe(
      map(({ response }) => response),
      map(parseIsochronesResponse),
      tap((data) => { cache[request.url] = data }),
      map((features) => ({ ...features, properties: { id: request.id } }))
    )


export const parseIsochronesResponse = (isochrones: Isochrones) => isochrones
