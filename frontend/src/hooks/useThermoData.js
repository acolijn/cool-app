import { useEffect, useState } from 'react'

function useThermoData(fluid, diagram = 'ph', t_step = 15) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!fluid || !diagram) return
    setData(null)

    const routeMap = {
      ph: 'ph-data',
      ts: 'ts-data'
    }

    const route = routeMap[diagram]
    if (!route) {
      console.error(`useThermoData: Unknown diagram type "${diagram}"`)
      return
    }

    const queryParams = new URLSearchParams({ fluid })

    if (diagram === 'ph') {
      queryParams.append('t_step', t_step || 15)
    } else if (diagram === 'ts') {
      queryParams.append('p_step', 15)
    }

    const fullUrl = `/thermo/${route}?${queryParams.toString()}`
    console.log(`useThermoData: Fetching from ${fullUrl}`)

    fetch(fullUrl, {
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        return res.json()
      })
      .then(json => {
        console.log('useThermoData: Received data:', json)
        setData(json)
      })
      .catch(err => {
        console.error('useThermoData: Failed to load data:', err)
      })

  }, [fluid, diagram, t_step])

  return data
}

export default useThermoData