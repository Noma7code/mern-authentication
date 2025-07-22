import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()
  return (
    <div className='w-full flex justify-between items-center p-4 absolute top-0 sm:p-6'>
        <img src={assets.logo} alt='logo'className='w-20 h-20 sm:w-32' />
        <button onClick={()=>navigate('/login')}
         className=' flex border border-t-blue-500 
             border-r-red-500 
             border-b-green-500 
             border-l-yellow-500 p-4 rounded-full items-center px-6 py-2 gap-2 hover:bg-white transition-all' >
            Login<img src={assets.arrow_icon} alt='forward arrow' />
        </button> 

      
        
    </div>
  )
}
