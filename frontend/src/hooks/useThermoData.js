import { useEffect, useState } from 'react'

//function useThermoData(fluid, diagram = 'ph') {
function useThermoData(fluid, diagram = 'ph', zoomParams = null) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    setData(null)

    let route = ''
    let stepParam = ''
    console.log('Fetching thermo data for fluid:', fluid, 'diagram:', diagram, 'zoomParams:', zoomParams)
    
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
    const baseUrl = `http://localhost:5050/thermo/${route}?fluid=${fluid}`

    const queryParams = new URLSearchParams()

    console.log('Zoom params:', zoomParams)

    if (diagram === 'ph') {
      if (zoomParams?.h_min !== undefined) queryParams.append('h_min', zoomParams.h_min)
      if (zoomParams?.h_max !== undefined) queryParams.append('h_max', zoomParams.h_max)
      if (zoomParams?.p_min !== undefined) queryParams.append('p_min', zoomParams.p_min)
      if (zoomParams?.p_max !== undefined) queryParams.append('p_max', zoomParams.p_max)
      if (zoomParams?.t_step !== undefined) queryParams.append('t_step', zoomParams.t_step)
      else queryParams.append('t_step', 15)
    }

    if (diagram === 'ts') {
      if (zoomParams?.T_min !== undefined) queryParams.append('T_min', zoomParams.T_min)
      if (zoomParams?.T_max !== undefined) queryParams.append('T_max', zoomParams.T_max)
      if (zoomParams?.p_steps !== undefined) queryParams.append('p_steps', zoomParams.p_steps)
      else queryParams.append('p_steps', 15)
    }

    const fullUrl = `${baseUrl}&${queryParams.toString()}`
    console.log('Fetching', fullUrl)

    fetch(fullUrl)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch thermo data')
        return res.json()
      })
      .then(setData)
      .catch(err => console.error('Error loading thermo data:', err))

  }, [fluid, diagram, zoomParams])

  return data
}

export default useThermoData