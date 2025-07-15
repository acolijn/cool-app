import Plot from 'react-plotly.js'
import useThermoData from '../hooks/useThermoData'
import { getIsothermColor } from '../utils/colorScale'

function ThermoPlot({ fluid, diagram }) {
  const data = useThermoData(fluid, diagram)

  if (!data) return <p style={{ color: '#666' }}>Loading...</p>

  const Tmin = Math.min(...data.isotherms.map(i => i.T))
  const Tmax = Math.max(...data.isotherms.map(i => i.T))

  const traces = []
  const xKey = diagram === 'ph' ? 'h' : 's'
  const yKey = diagram === 'ph' ? 'p' : 'T'

  data.isotherms.forEach(iso => {
    const color = getIsothermColor(iso.T, Tmin, Tmax)
    traces.push({
      x: iso[xKey],
      y: iso[yKey],
      mode: 'lines',
      line: { color: color, dash: 'dot' },
      hovertemplate: `T = ${iso.T} K<extra></extra>`,
      showlegend: false
    })
  })

  data.qualities.forEach(line => {
    traces.push({
      x: line[xKey],
      y: line[yKey],
      type: 'scatter',
      mode: 'lines',
      line: { color: 'red', dash: 'dash' },
      name: `Q=${line.Q}`
    })
  })

  traces.push({
    x: data.saturation[diagram === 'ph' ? 'hL' : 'sL'].concat(
       data.saturation[diagram === 'ph' ? 'hV' : 'sV']
    ),
    y: data.saturation[yKey].concat([...data.saturation[yKey]].reverse()),
    fill: 'toself',
    type: 'scatter',
    mode: 'lines',
    line: { color: 'black' },
    fillcolor: 'rgba(173,216,230,0.2)',
    name: 'Saturation dome'
  })

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