const config = {
  data:
    process.env.NODE_ENV === 'production'
      ? '/data/isochrone'
      : 'http://0.0.0.0:5000',
  map: {
    apiKey: 'pk.eyJ1IjoieWluc2hhbnlhbmciLCJhIjoiNDM4MDVlOWFjNDkwNzQwZTlmYTIzNDlmZGUzMzRlMTkifQ.9TdM9ymU2sqMKrRLYCvllQ',
    center: [103.834534, 1.316688],
    fit: [[103.596954345, 1.23312012479], [104.049453735, 1.47887018872]],
    zoom: 13,
    minZoom: 11,
    maxZoom: 16,
    bbox: [[103.460999, 1.0834620335045826], [104.208069, 1.6024216765509463]],
    mapStyle: 'mapbox://styles/mapbox/dark-v9'
  }
}

export default config
