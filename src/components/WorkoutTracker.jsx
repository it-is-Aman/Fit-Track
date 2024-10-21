import { useState, useEffect } from 'react'
import { useFirebase } from '../Context/firebaseContext'

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([])
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  const firebase = useFirebase()

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = () => {
    const user = firebase.auth.currentUser
    if (user) {
      try {
        firebase.fetchWorkouts(user.uid,"desc").then(workout => setWorkouts(workout.docs))

      } catch (error) {
        console.error("Error fetching workouts: ", error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = firebase.auth.currentUser
    if (user) {
      const workoutData = {
        userId: user.uid,
        exercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        date: new Date().toISOString().split('T')[0]
      }
      await firebase.setWorkoutData(workoutData)
      setExercise('')
      setSets('')
      setReps('')
      setWeight('')
      fetchWorkouts() // Fetch workouts again after adding a new one
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout Tracker</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Exercise"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Sets"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Reps"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Weight (kgs)"
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Log Workout
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Workout History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Exercise</th>
                <th className="px-4 py-2 border">Sets</th>
                <th className="px-4 py-2 border">Reps</th>
                <th className="px-4 py-2 border">Weight (kgs)</th> {/* Changed from lbs to kgs */}
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => {
                const data = workout.data()
                return (
                  <tr key={workout.id}>
                    <td className="px-4 py-2 border">{data.date}</td>
                    <td className="px-4 py-2 border">{data.exercise}</td>
                    <td className="px-4 py-2 border">{data.sets}</td>
                    <td className="px-4 py-2 border">{data.reps}</td>
                    <td className="px-4 py-2 border">{data.weight}</td>
                  </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}