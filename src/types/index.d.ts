import { FeatureCollection, Point } from 'geojson'

export type Layer = {
  id: string,
  coordinates: [number, number] | null,
  name: string
}
export type Layers = Layer[]

export type Points = FeatureCollection<Point>

export type Isochrone = FeatureCollection
export type Isochrones = Isochrone[]

export type Request = {
  method: 'get' | 'post'
  url: string
  crossDomain: boolean
  responseType: 'json' | 'text'
}
