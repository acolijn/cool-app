import React, { useState, useCallback } from 'react'
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

//import React, { useState } from 'react'

function ThermoPlot({ fluid, diagram }) {
  //const [zoomParams, setZoomParams] = useState(null)
  console.log('Rendering ThermoPlot for', fluid, 'diagram:', diagram)

  // t_step state for isotherm spacing (default 15)
  const [tStep, setTStep] = useState(15)
  const [tStepInput, setTStepInput] = useState(15)

  // Fetch the thermo data based on fluid, diagram type, and tStep
  const data = useThermoData(fluid, diagram, tStep)

  // UI for t_step input (only for PH diagram)
  const tStepSelector = diagram === 'ph' && (
    <div style={{ marginBottom: 12 }}>
      <label htmlFor="tStepInput">ΔT between isotherms (°C): </label>
      <input
        id="tStepInput"
        type="number"
        min={1}
        max={100}
        value={tStepInput}
        onChange={e => setTStepInput(Number(e.target.value))}
        onBlur={() => {
          if (tStepInput !== tStep) setTStep(tStepInput)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter' && tStepInput !== tStep) setTStep(tStepInput)
        }}
        style={{ width: 60, marginLeft: 4 }}
      />
    </div>
  )

  if (!data) return <p style={{ color: '#666' }}>Loading...</p>

  let traces = []
  let layout = {
    xaxis: { title: { text: '' } },
    yaxis: { title: { text: '' } },
  }   
  switch (diagram) {
    case 'ph':
      if (!data.isotherms) return <p style={{ color: '#666' }}>Loading p–H data…</p>
      traces = buildPHTraces(data)
      layout.xaxis.type = 'linear'
      layout.yaxis.type = 'log'
      layout.xaxis.title.text = 'Enthalpy (kJ/kg)'
      layout.yaxis.title.text = 'Pressure (bar)'

      break
    case 'ts':
      if (!data.isobars) return <p style={{ color: '#666' }}>Loading T–S data…</p>

      traces = buildTSTraces(data)
      layout.xaxis.type = 'linear'
      layout.yaxis.type = 'linear'
      layout.xaxis.title.text = 'Entropy (kJ/kg·K)'
      layout.yaxis.title.text = 'Temperature (K)'
      break
    default:
      traces = []
  }
  layout.showlegend = false
  layout.height = 700
  layout.width = 900
  layout.margin = { l: 80, r: 40, b: 70, t: 30 }
  layout.font = { family: 'sans-serif', size: 16 }

  return (
    <div>
      {tStepSelector}
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true }}
      />
    </div>
  )
}

export default ThermoPlot