function FluidSelector({ fluid, setFluid, options }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <label htmlFor="fluid-select" style={{ marginRight: '1rem', fontWeight: '500' }}>
        Choose fluid:
      </label>
      <select
        id="fluid-select"
        value={fluid}
        onChange={e => setFluid(e.target.value)}
        style={{
          padding: '0.4rem 0.8rem',
          fontSize: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      >
        {options.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  )
}

export default FluidSelector