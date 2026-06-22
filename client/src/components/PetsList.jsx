import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PetCard from './PetCard'
import '../styles/Pets.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const PetsList = ({ filters }) => {
  const [pets, setPets] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const params = new URLSearchParams()

        if (filters.type) params.set('type', filters.type)
        if (filters.ageMin) params.set('age_min', filters.ageMin)
        if (filters.ageMax) params.set('age_max', filters.ageMax)

        const query = params.toString()
        const url = `${API_BASE_URL}/pets${query ? `?${query}` : ''}`
        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to retrieve pets')
        }

        setPets(data.pets || [])
        setError('')
      } catch (err) {
        setError(err.message)
        setPets([])
      }
    }

    fetchPets()
  }, [filters])

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        let errorMessage = 'Failed to delete pet'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // No JSON body for some responses.
        }
        throw new Error(errorMessage)
      }

      setPets((prevPets) => prevPets.filter((pet) => pet.id !== id))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = (id) => {
    navigate(`/update-pet/${id}`)
  }

  if (error) return <div>Error: {error}</div>
  if (!pets.length) return <div>🐶 No pets found! 🐱</div>

  return (
    <div className="pets-container">
      {pets.map(pet => (
        <PetCard 
          key={pet.id}
          pet={pet}
          onUpdate={() => handleUpdate(pet.id)}
          onDelete={() => handleDelete(pet.id)}
        />
      ))}
    </div>
  )
}

export default PetsList
