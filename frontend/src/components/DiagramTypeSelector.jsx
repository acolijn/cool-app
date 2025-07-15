function DiagramTypeSelector({ diagram, setDiagram, options }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <label htmlFor="diagram-select" style={{ marginRight: '1rem', fontWeight: '500' }}>
        Choose diagram:
      </label>
      <select
        id="diagram-select"
        value={diagram}
        onChange={e => setDiagram(e.target.value)}
        style={{
          padding: '0.4rem 0.8rem',
          fontSize: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt.toUpperCase()}</option>
        ))}
      </select>
    </div>
  )
}

export default DiagramTypeSelector