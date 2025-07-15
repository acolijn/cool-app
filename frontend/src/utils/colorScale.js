import { interpolatePlasma } from 'd3-scale-chromatic'

export function getIsothermColor(T, Tmin, Tmax) {
  const normT = (T - Tmin) / (Tmax - Tmin)
  return interpolatePlasma(normT)
}
