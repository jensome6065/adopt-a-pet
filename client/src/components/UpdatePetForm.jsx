import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import '../styles/Forms.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const UpdatePetForm = ({ onPetUpdated }) => {
  const { petId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    age: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pets/${petId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to retrieve pet')
        }

        setFormData({
          name: data.pet.name ?? '',
          type: data.pet.type ?? '',
          age: data.pet.age?.toString() ?? '',
          description: data.pet.description ?? '',
        })
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPet()
  }, [petId])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        age: Number(formData.age),
        description: formData.description,
      }

      const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update pet')
      }

      setError('')
      if (onPetUpdated) {
        onPetUpdated(data.pet)
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (isLoading) return <div>🐱 No pet found! 🐶</div>
  if (error) return <div>Error: {error}</div>

  return (
    <form className="pet-form" onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>

      <label>
        Type:
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>

      <div className="form-buttons">
        <button type="submit">Update</button>

        <Link to="/">
          <button>Cancel</button>
        </Link>
      </div>

    </form>
  )
}

export default UpdatePetForm
