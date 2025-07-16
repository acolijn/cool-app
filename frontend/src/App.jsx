import { useState } from 'react'
import FluidSelector from './components/FluidSelector'
import DiagramTypeSelector from './components/DiagramTypeSelector'
import ThermoPlot from './components/ThermoPlot'

const fluidOptions = ['Xenon', 'NitrousOxide', 'Water', 'R134a', 'CO2', 'Helium']
const diagramOptions = ['ph', 'ts']

function App() {
  const [fluid, setFluid] = useState('Xenon')
  const [diagram, setDiagram] = useState('ph')  // 'ph' or 'ts'
  const [zoomParams, setZoomParams] = useState(null)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {diagram.toUpperCase()} Diagram for {fluid}
      </h2>

      <FluidSelector fluid={fluid} setFluid={setFluid} options={fluidOptions} />
      <DiagramTypeSelector diagram={diagram} setDiagram={setDiagram} options={diagramOptions} />
      <ThermoPlot fluid={fluid} diagram={diagram} zoomParams={zoomParams} setZoomParams={setZoomParams}/>
    </div>
  )
}

export default App