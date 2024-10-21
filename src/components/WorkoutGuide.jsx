import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkoutGuide() {
  const apiKey = import.meta.env.VITE_API_NINJA_KEY
  const [exercise, setExercise] = useState('')
  const [guide, setGuide] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchExerciseGuide = async () => {
    setLoading(true)
    setError('')
    setGuide(null)

    try {
      const response = await fetch(`https://api.api-ninjas.com/v1/exercises?name=${exercise}`, {
        headers: {
          'X-Api-Key': apiKey
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch exercise guide')
      }

      const data = await response.json()

      if (data) {
        setGuide(data)
      } else {
        setError('No exercise guide found for the given name')
      }
    } catch (err) {
      setError('An error occurred while fetching the exercise guide')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout Guide</h1>
      <div className="mb-4 flex gap-4">
        <Input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Enter exercise name"
          className="flex-grow"
        />
        <Button onClick={fetchExerciseGuide} disabled={loading}>
          {loading ? 'Loading...' : 'Get Guide'}
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {Array.isArray(guide) && guide.map((g, index) => (
        <div key={index} className='mb-4'>
          <Card>
            <CardHeader>
              <CardTitle>{g.name}</CardTitle>
              <CardDescription>
                Type: {g.type} | Muscle: {g.muscle} | Difficulty: {g.difficulty}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Equipment needed:</h3>
              <p className="mb-4">{g.equipment}</p>
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <p>{g.instructions}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}