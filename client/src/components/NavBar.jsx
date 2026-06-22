import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

const NavBar = ({ onFilter }) => {
  const [type, setType] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFilter({ type, ageMin, ageMax })
  }

  const handleClearFilters = () => {
    setType('')
    setAgeMin('')
    setAgeMax('')
    onFilter({ type: '', ageMin: '', ageMax: '' })
  }

  return (
    <nav>
      <form onSubmit={handleFilterSubmit}>
        <input
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Age"
          value={ageMin}
          onChange={(e) => setAgeMin(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Age"
          value={ageMax}
          onChange={(e) => setAgeMax(e.target.value)}
        />

        <button type="submit">Filter</button>
        <button type="button" onClick={handleClearFilters}>Clear</button>

        <Link to="/add-pet">
          <button>Add Pet</button>
        </Link>
      </form>
    </nav>
  )
}

export default NavBar
