import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { useFirebase } from '../Context/firebaseContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [workoutData, setWorkoutData] = useState([])
  const [calorieData, setCalorieData] = useState([])
  const firebase = useFirebase()


  // Aggregate weights by date
  const aggregateWeightsByDate = workoutData.reduce((acc, workout) => {
    const date = workout.data().date
    const weight = workout.data().weight

    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += weight
    return acc

  }, {})

  // Aggregate calories by date
  const aggregateCaloriesByDate = calorieData.reduce((acc, calorie) => {
    const date = calorie.data().date
    const calories = calorie.data().calories

    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += calories
    return acc

  }, {})



  useEffect(() => {
    const fetchData = async () => {
      const user = firebase.auth.currentUser
      if (user) {
        try {
          const [workoutResponse, mealResponse] = await Promise.all([
            firebase.fetchWorkouts(user.uid,"asc"),
            firebase.fetchMeals(user.uid,"asc")
          ]);
          setWorkoutData(workoutResponse.docs);
          setCalorieData(mealResponse.docs);
        } catch (error) {
          console.error("Error in dashboard", error)
        }
      }
    }
    fetchData();
  }, [firebase])

  const workoutChartData = {
    labels: Object.keys(aggregateWeightsByDate),
    datasets: [
      {
        label: 'Total Weight Lifted (kgs)',
        data: Object.values(aggregateWeightsByDate),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const calorieChartData = {
    labels: Object.keys(aggregateCaloriesByDate),
    datasets: [
      {
        label: 'Calories Consumed',
        data: Object.values(aggregateCaloriesByDate),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Workout Progress</h2>
          <Line data={workoutChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Calorie Intake</h2>
          <Line data={calorieChartData} />
        </div>
      </div>
    </div>
  )
}