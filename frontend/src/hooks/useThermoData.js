import { useEffect, useState } from 'react'

//function useThermoData(fluid, diagram = 'ph') {
function useThermoData(fluid, diagram = 'ph') {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    setData(null)

    let route = ''
    let stepParam = ''
    console.log('useThermoData: Fetching thermo data for fluid:', fluid, 'diagram:', diagram)
    
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
        console.error('useThermoData: Unknown diagram type:', diagram)
        return
    }
    const baseUrl = `http://localhost:5050/thermo/${route}?fluid=${fluid}`

    const queryParams = new URLSearchParams()

    if (diagram === 'ph') {
      queryParams.append('t_step', 15)
    } else if (diagram === 'ts') {
      queryParams.append('p_step', 15)
    }

    const fullUrl = `${baseUrl}&${queryParams.toString()}`

    console.log('useThermoData: Fetching', fullUrl)

    fetch(fullUrl)
      .then(res => {
        if (!res.ok) throw new Error('useThermoData: Failed to fetch thermo data')
        return res.json()
      })
      .then(setData)
      .catch(err => console.error('useThermoData: Error loading thermo data:', err))

  }, [fluid, diagram])

  return data
}

export default useThermoData