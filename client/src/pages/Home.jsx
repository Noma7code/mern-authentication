import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
       <Navbar/>
       <Header />
    </div>
  )
}
