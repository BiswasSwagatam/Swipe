import React, { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignUpForm from '../components/SignUpForm'

const AuthPage = () => {

  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-t from-indigo-400 via-purple-500 to-pink-500'>
        <div className='w-full max-w-md'>
            <h2 className='text-center text-3xl font-extrabold text-white mb-8 drop-shadow-lg'>
                {isLogin ? 'Sign in to Swipe' : 'Create a Swipe account'}
            </h2>
            <div className='bg-white rounded-lg shadow-xl p-8'>
                {isLogin ? <LoginForm /> : <SignUpForm />}
                <div className='mt-8 text-center'>
					<p className='text-sm text-gray-600'>
						{isLogin ? "New to Swipe?" : "Already have an account?"}
					</p>
					<button
						onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
						className='mt-2 text-pink-600 hover:text-pink-800 font-medium transition-colors duration-300'
					>
						{isLogin ? "Create a new account" : "Sign in to your account"}
					</button>
				</div>
            </div>
        </div>
    </div>
  )
}

export default AuthPage