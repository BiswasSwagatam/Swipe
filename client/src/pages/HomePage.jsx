import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const HomePage = () => {

  const {logout} = useAuthStore()

  return (
    <div>
        <h1>HomePage</h1>
        <button onClick={logout}>Logout</button>
    </div>
  )
}

export default HomePage