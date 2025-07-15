import Plot from 'react-plotly.js'
import useThermoData from '../hooks/useThermoData'
import { getIsothermColor } from '../utils/colorScale'

function buildPHTraces(data) {
  const traces = []
  const Tmin = Math.min(...data.isotherms.map(i => i.T))
  const Tmax = Math.max(...data.isotherms.map(i => i.T))

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

  data.qualities.forEach(line => {
    traces.push({
      x: line.h,
      y: line.p,
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dash' },
      name: `Q=${line.Q}`
    })
  })

  traces.push({
    x: data.saturation.hL.concat(data.saturation.hV),
    y: data.saturation.p.concat([...data.saturation.p].reverse()),
    fill: 'toself',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'black' },
    fillcolor: 'rgba(173,216,230,0.2)',
    name: 'Saturation dome'
  })

  return traces
}

function buildTSTraces(data) {
  const traces = []
  const Tmin = Math.min(...data.isotherms.map(i => i.T))
  const Tmax = Math.max(...data.isotherms.map(i => i.T))

  data.isotherms.forEach(iso => {
    const color = getIsothermColor(iso.T, Tmin, Tmax)
    traces.push({
      x: iso.s,
      y: iso.T,
      mode: 'lines',
      line: { color: color, dash: 'dot' },
      hovertemplate: `T = ${iso.T} K<extra></extra>`,
      showlegend: false
    })
  })

  data.qualities.forEach(line => {
    traces.push({
      x: line.s,
      y: line.T,
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dash' },
      name: `Q=${line.Q}`
    })
  })

  traces.push({
    x: data.saturation.sL.concat(data.saturation.sV),
    y: data.saturation.T.concat([...data.saturation.T].reverse()),
    fill: 'toself',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'black' },
    fillcolor: 'rgba(173,216,230,0.2)',
    name: 'Saturation dome'
  })

  return traces
}

function ThermoPlot({ fluid, diagram }) {
  const data = useThermoData(fluid, diagram)

  if (!data) return <p style={{ color: '#666' }}>Loading...</p>

  let traces = []
  switch (diagram) {
    case 'ph':
      traces = buildPHTraces(data)
      break
    case 'ts':
      traces = buildTSTraces(data)
      break
    default:
      traces = []
  }

  const layout = {
    xaxis: {
      title: {
        text: diagram === 'ph' ? 'Enthalpy (kJ/kg)' : 'Entropy (kJ/kg·K)',
        font: { size: 16, family: 'sans-serif' }
      }
    },
    yaxis: {
      type: diagram === 'ph' ? 'log' : 'linear',
      title: {
        text: diagram === 'ph' ? 'Pressure (bar)' : 'Temperature (K)',
        font: { size: 16, family: 'sans-serif' }
      }
    },
    showlegend: false,
    height: 600,
    margin: { l: 80, r: 40, b: 70, t: 30 },
    font: { family: 'sans-serif', size: 14 }
  }

  return <Plot data={traces} layout={layout} config={{ responsive: true }} />
}

export default ThermoPlot