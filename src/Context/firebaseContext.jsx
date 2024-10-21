import React, { createContext, useContext } from "react";
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore'


const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext)

export const FirebaseProvider = ({ children }) => {

    // signup
    const signup = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password)
    }

    //signin
    const signin = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    // signout
    const signout = async () => {
        await auth.signOut()
    }

    // set workout in collection
    const setWorkoutData = async (data) => {
        await addDoc(collection(db, 'workouts'), data)
    }

    // fetch workout data
    const fetchWorkouts = async (id,order) => {
        const q = query(collection(db, "workouts"), where("userId", "==", id), orderBy("date",order));
        return await getDocs(q);
    }

    // set meal in collection
    const setMeal = async (data) => {
        await addDoc(collection(db, 'meals'), data)
    }

    //fetch meal data
    const fetchMeals = async (id,order) => {
        const q = query(collection(db, "meals"), where("userId", "==", id), orderBy("date",order));
        return await getDocs(q);
    }

    return (
        <FirebaseContext.Provider value={{
            signup,
            signin,
            signout,
            auth,
            setWorkoutData,
            fetchWorkouts,
            setMeal,
            fetchMeals
        }}>
            {children}
        </FirebaseContext.Provider>
    )
}