import { useState, useEffect } from 'react'
import { useFirebase } from '../Context/firebaseContext'

export default function CalorieTracker() {
  const [meals, setMeals] = useState([])
  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const firebase = useFirebase()

  useEffect(() => {
    fetchMeals()
  }, [])
  const fetchMeals = () => {
    const user = firebase.auth.currentUser
    if (user) {
      try {
        firebase.fetchMeals(user.uid, "desc").then(meal => setMeals(meal.docs))

      } catch (error) {
        console.error("Error fetching meals: ", error)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const user = firebase.auth.currentUser
    if (user) {
      const mealData = {
        userId: user.uid,
        name: mealName,
        calories: parseInt(calories),
        protein: parseInt(protein),
        carbs: parseInt(carbs),
        fat: parseInt(fat),
        date: new Date().toISOString().split('T')[0]
      }
      firebase.setMeal(mealData)
      setMealName('')
      setCalories('')
      setProtein('')
      setCarbs('')
      setFat('')
      fetchMeals()
    }
  }

  const currDate = new Date().toISOString().split('T')[0]
  const todaysMeals = meals.filter((meal) => meal.data().date === currDate)

  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.data().calories, 0)
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.data().protein, 0)
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.data().carbs, 0)
  const totalFat = todaysMeals.reduce((sum, meal) => sum + meal.data().fat, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Calorie Tracker</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Goal</h2>
        <div className="flex items-center">
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
            className="border rounded px-3 py-2 w-24 mr-4"
          />
          <span>calories</span>
        </div>
        <div className="mt-4 bg-gray-200 h-4 rounded-full">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }} //Math.min is used to keep the progress bar's width within the bounds of 0% to 100%
          ></div>
        </div>
        <div className="mt-2 text-sm">
          {totalCalories} / {calorieGoal} calories consumed
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="Meal Name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="Calories"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            placeholder="Protein (g)"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
            placeholder="Carbs (g)"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            placeholder="Fat (g)"
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Log Meal
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Meal History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Meal</th>
                <th className="px-4 py-2 border">Calories</th>
                <th className="px-4 py-2 border">Protein (g)</th>
                <th className="px-4 py-2 border">Carbs (g)</th>
                <th className="px-4 py-2 border">Fat (g)</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => {
                const data = meal.data()
                return (
                  <tr key={meal.id}>
                    <td className="px-4 py-2 border">{data.date}</td>
                    <td className="px-4 py-2 border">{data.name}</td>
                    <td className="px-4 py-2 border">{data.calories}</td>
                    <td className="px-4 py-2 border">{data.protein}</td>
                    <td className="px-4 py-2 border">{data.carbs}</td>
                    <td className="px-4 py-2 border">{data.fat}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Macronutrient Totals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Protein</h3>
            <p>{totalProtein}g</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold">Carbs</h3>
            <p>{totalCarbs}g</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <h3 className="font-semibold">Fat</h3>
            <p>{totalFat}g</p>
          </div>
        </div>
      </div>
    </div>
  )
}