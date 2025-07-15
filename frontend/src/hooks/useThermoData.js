import { useEffect, useState } from 'react'

function useThermoData(fluid, diagram = 'ph') {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)

    let route = ''
    let stepParam = ''

    switch (diagram) {
      case 'ph':
        route = 'ph-data'
        stepParam = 't_step=15'
        break
      case 'ts':
        route = 'ts-data'
        stepParam = 'p_step=15'
        break
      default:
        console.error('Unknown diagram type:', diagram)
        return
    }

    const url = `http://localhost:5050/thermo/${route}?fluid=${fluid}&${stepParam}`
    console.log('Fetching', url)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch thermo data')
        return res.json()
      })
      .then(setData)
      .catch(err => console.error('Error loading thermo data:', err))

  }, [fluid, diagram])

  return data
}

export default useThermoData