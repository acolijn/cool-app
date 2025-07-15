import { useEffect, useState } from 'react'

function useThermoData(fluid, diagram = 'ph') {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)
    const route = diagram === 'ts' ? 'ts-data' : 'ph-data'

    fetch(`http://localhost:5050/thermo/${route}?fluid=${fluid}&t_step=25`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch thermo data')
        return res.json()
      })
      .then(json => {
        const isValid = json?.saturation && (
          diagram === 'ph'
            ? json.saturation.hL && json.saturation.hV
            : json.saturation.sL && json.saturation.sV
        )
        if (!isValid) {
          console.warn(`Missing saturation data for diagram: ${diagram}`)
          return
        }
        setData(json)
      })
      .catch(err => console.error('Error loading thermo data:', err))
  }, [fluid, diagram])

  return data
}

export default useThermoData