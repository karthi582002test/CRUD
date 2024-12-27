import React from 'react'
import { FaEdit, FaEnvelope, FaMale, FaPhone, FaPhoneAlt, FaPhoneSlash, FaTrash, FaWhatsapp } from 'react-icons/fa'

const Cards = ({users,handleEdit,handleDelete}) => {

  return (
    <div className=' lg:w-auto flex flex-col gap-5'>
      {
        users?.map(user =>(
          <div className='h-25  w-auto bg-gray-300 p-3 px-5 rounded-lg flex justify-center relative items-center ' key={user.id}>
          {/* <span 
              className='bg-green-500 w-25 h-5 flex items-center justify-center px-3 py-1 gap-3 top-3 left-30 text-white font-bold absolute rounded'
          > <span className='w-2 h-2  bg-red-600 rounded-full wave' />
              Active
          </span> */}
          <img 
            src={user.imagePath}
            className='h-24 w-24 rounded-full'
            alt={user.name}
          />
          <div className=' w-auto pl-5 relative'>
                <h1
                className='font-bold text-xl'
                >{user.name}</h1>
                <p className='flex justify-center items-center gap-2'><FaEnvelope /><a className='font-bold' href = {`mailto:${user.email}`}>{user.email}</a></p>
                <p>Gender : <span className='font-bold'>Male</span></p>
                <p className='flex  items-center gap-2'><FaPhoneAlt /><a className='font-bold' href = {`tel:${user.phone}`}>{user.phone}</a></p>
                
          </div>
          <div className=' w-full pl-8 flex justify-end items-center'>
                <button
                    onClick={() => handleEdit(user)}
                    className='bg-yellow-500 flex justify-center items-center w-12 h-12 text-white px-2 py-2 rounded hover:bg-yellow-600 transition duration-300'
                >
                    <FaEdit
                        className='w-7 h-7'
                    />
                </button>
                <button
                    onClick={() => handleDelete(user.id)}
                    className='bg-red-500 flex justify-center items-center w-12 h-12 text-white px-2 py-2 rounded hover:bg-red-600 transition duration-300 ml-2'
                >
                    <FaTrash 
                        className='w-6 h-6'
                    />
                </button>
          </div>

    </div>
        ))
      }
    
    
    </div>

  )
}

export default Cards


