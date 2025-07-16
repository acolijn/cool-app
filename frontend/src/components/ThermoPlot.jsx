import React, { useState, useCallback, useEffect } from 'react'
import Plot from 'react-plotly.js'
import useThermoData from '../hooks/useThermoData'
import { getIsothermColor } from '../utils/colorScale'

function buildPHTraces(data) {
  console.log('Building p-H traces for', data.fluid)
  console.log('Data:', data)

  const traces = []

  // Add the saturation curve
  traces.push({
    x: data.saturation.hL.concat(data.saturation.hV),
    y: data.saturation.p.concat([...data.saturation.p].reverse()),
    fill: 'toself',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'black' },
    fillcolor: 'rgba(173,216,230,0.2)',
  })

  const Tmin = Math.min(...data.isotherms.map(i => i.T))
  const Tmax = Math.max(...data.isotherms.map(i => i.T))

  // In the p-H diagram we plot isotherms
  data.isotherms.forEach(iso => {
    const color = getIsothermColor(iso.T, Tmin, Tmax)
    traces.push({
      x: iso.h,
      y: iso.p,
      mode: 'lines',
      line: { color: color, dash: 'dot' },
      hovertemplate: `T = ${iso.T} K<extra></extra>`,
      showlegend: false
    })
  })

  // Add the quality lines
  data.qualities.forEach(line => {
    traces.push({
      x: line.h,
      y: line.p,
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dash', width: 0.8 },
      name: `Q=${line.Q}`
    })
  })

  return traces
}

function buildTSTraces(data) {
  console.log('Building TS traces for', data.fluid)
  console.log('Data:', data)
  const traces = []
  // In the TS diagram we plot isobars
  const Pmin = Math.min(...data.isobars.map(i => i.p))
  const Pmax = Math.max(...data.isobars.map(i => i.p))
  data.isobars.forEach(iso => {
    const color = getIsothermColor(iso.p, Pmin, Pmax)
    traces.push({
      x: iso.s,
      y: iso.T,
      mode: 'lines',
      line: { color: color, dash: 'dot' },
      hovertemplate: `P = ${iso.p} bar<extra></extra>`,
      showlegend: false
    })
  })

  // Add the saturation lines
  traces.push({
    x: data.saturation.sL.concat(data.saturation.sV),
    y: data.saturation.T.concat([...data.saturation.T].reverse()),
    fill: 'toself',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'black' },
    fillcolor: 'rgba(173,216,230,0.2)',
  })

  // Add the quality lines
  data.qualities.forEach(line => {
    traces.push({
      x: line.s,
      y: line.T,
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dash', width: 0.8 },
      name: `Q=${line.Q}`
    })
  })

  return traces
}

function ThermoPlot({ fluid, diagram, zoomParams, setZoomParams }) {
  //const [zoomParams, setZoomParams] = useState(null)
  console.log('Rendering ThermoPlot for', fluid, 'diagram:', diagram, 'zoomParams:', zoomParams)

  // Fetch the thermo data based on fluid, diagram type, and zoom parameters
  const data = useThermoData(fluid, diagram, zoomParams)

  const [layout, setLayout] = useState({
    xaxis: { title: { text: '' }, type: 'linear' },
    yaxis: { title: { text: '' }, type: 'linear' },
    showlegend: false,
    height: 700,
    width: 900,
    margin: { l: 80, r: 40, b: 70, t: 30 },
    font: { family: 'sans-serif', size: 16 }
  })

  useEffect(() => {
    if (!data) return
  
    setLayout(prev => {
      const updated = { ...prev }
  
      if (diagram === 'ph') {
        updated.xaxis.title.text = 'Enthalpy (kJ/kg)'
        updated.yaxis.title.text = 'Pressure (bar)'
        updated.xaxis.type = 'linear'
        updated.yaxis.type = 'log'
      } else if (diagram === 'ts') {
        updated.xaxis.title.text = 'Entropy (kJ/kg·K)'
        updated.yaxis.title.text = 'Temperature (K)'
        updated.xaxis.type = 'linear'
        updated.yaxis.type = 'linear'
      }
  
      return updated
    })
  }, [diagram, data])

  // Handle relayout events to capture zoom and pan changes
  const handleRelayout = useCallback((event) => {
    console.log('Relayout event:', event)
    //if (!data) return;

/*     switch (diagram) {
      case 'ph':
        nLines = data.isotherms.length
        break
      case 'ts':
        nLines = data.isobars.length
        break
      default:
        console.warn('Unknown diagram type:', diagram)
        return
    } */

    const xRange = event['xaxis.range[0]'] !== undefined
      ? [event['xaxis.range[0]'], event['xaxis.range[1]']]
      : null

    const yRange = event['yaxis.range[0]'] !== undefined
      ? [event['yaxis.range[0]'], event['yaxis.range[1]']]
      : null

    if (diagram === 'ph' && xRange && yRange) {
      const h_min = parseFloat(xRange[0])
      const h_max = parseFloat(xRange[1])
      const p_min = parseFloat(yRange[0])
      const p_max = parseFloat(yRange[1])
      setZoomParams({ h_min, h_max, p_min, p_max, t_step: 5, _ts: Date.now() })  
    }
  }, [fluid, diagram, setZoomParams, zoomParams]) // eslint-disable-line react-hooks/exhaustive-deps
  //}, [data, diagram, nLines])
  console.log('Zoom params:', zoomParams)

  //const data = useThermoData(fluid, diagram, zoomParams

  //const data = useThermoData(fluid, diagram)

  if (!data) return <p style={{ color: '#666' }}>Loading...</p>

  let traces = []
  
  switch (diagram) {
    case 'ph':
      if (!data.isotherms) return <p style={{ color: '#666' }}>Loading p–H data…</p>
      traces = buildPHTraces(data)
      break
    case 'ts':
      if (!data.isobars) return <p style={{ color: '#666' }}>Loading T–S data…</p>
      traces = buildTSTraces(data)
      break
    default:
      traces = []
  }

  return (<Plot
    data={traces}
    layout={layout}
    config={{ responsive: true }}
    onRelayout={handleRelayout}/>
  )
}

export default ThermoPlot