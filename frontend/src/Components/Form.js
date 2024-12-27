import React, { useEffect, useState } from 'react';
import { uid } from 'uid';
import { toast } from 'react-toastify';
import { createUser, deleteUser, getUsers, updateUser } from '../api';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import Cards from './Cards';

const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('male');
    const [users, setUsers] = useState([]);
    const [editingUser , setEditingUser ] = useState(null);
    const [toggle, setToggle] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false) 
    const handleFileChange = (event) => { 
        setSelectedFile(event.target.files[0]);
     };

    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    const fetchData = async () => {
            try {
                const response = await getUsers();
                setUsers(response); 
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };
        useEffect(() => {
            fetchData();
        }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        if (!toggle) {
            toast.error("Accept the terms and conditions");
            setLoading(false)
            return;
        }

        if (!nameRegex.test(name) || !emailRegex.test(email) || !phoneRegex.test(phone) || !gender) {
            toast.error("Please fill in all fields correctly.");
            setLoading(false)
            return;
        }

        
        if (editingUser) {
            // Update existing user
            const user = { id:editingUser.id , name, email, phone, gender };
            const resp = await updateUser(editingUser.id,user,selectedFile)
            console.log(resp)
            user.imagePath = resp;
            setUsers(users.map(u => (u.id === editingUser .id ? user : u)));
            console.log(user)
            toast.success("User  updated successfully");
            setLoading(false)
            resetForm()
        } else {
            // Add new user
            const user = { id:uid(16) , name, email, phone, gender };
            const response = await createUser(user,selectedFile)
            user.imagePath = response;
            setUsers([...users, user]);
            if(response){
                toast.success("User created successfully");
                setLoading(false)
            }else{
                toast.error("Failed to Update user");
                setLoading(false)

            }
            // toast.success("User  created successfully");
        }

        resetForm();
        setLoading(false)
    };

    const handleEdit = (user) => {
        setEditingUser (user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
        setGender(user.gender);
    };

    const handleDelete = async (id) => {
        setUsers(users.filter(user => user.id !== id));
        await deleteUser(id)
        toast.success("User  deleted successfully");
    };


    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setGender('male');
        setEditingUser (null);
        setToggle(false);
    };

    return (
        <>
    <div className='max-h-70vh  mt-4 mx-auto p-5 flex justify-center align-middle gap-5 lg:flex-row flex-col'>
        <div className='bg-white shadow-lg rounded-lg p-6 w-[100%] lg:w-[50%]'>
            <h2 className='text-2xl font-semibold text-center mb-4'>User  Form</h2>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col mb-4'>
                    <label className='text-md font-medium'>Name</label>
                    <input
                        type='text'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter Your Name'
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='text-md font-medium'>Email</label>
                    <input
                        type='email'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter Your Email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='text-md font-medium'>Phone</label>
                    <input
                        type='text'
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Enter Your Phone Number'
                        required
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='text-md font-medium'>Gender</label>
                    <select
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        required
                        onChange={(e) => setGender(e.target.value)}
                        value={gender}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className='mb-2'>
                    <input 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    type='file' 
                    name='file' 
                    onChange={handleFileChange}
                    accept='.jpg, .jpeg'
                    />
                    {/* {selectedFile && <p>Selected file: {selectedFile.name}</p>} */}
                </div>
                <div className='flex items-center mb-4'>
                    <input
                        type='checkbox'
                        className='w-5 h-5 mr-2'
                        onChange={() => setToggle(!toggle)}
                        checked={toggle}
                    />
                    <label className='text-md font-normal text-gray-800'>Accept Terms & Conditions</label>
                </div>
                <div className='flex justify-center'>
                    <button
                        type='submit'
                        className={`bg-blue-600 hover:bg-blue-700
                        ${editingUser ? 'bg-orange-500 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700' }
                         text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out
                        ${loading ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : 'cursor-pointer' }
                         `}
                         disabled = {loading}
                    >
                        {
                            loading ? 'Loading...' : 
                            editingUser  ? "Update User" : "Add User"
                        }
                    </button>
                </div>
            </form>
        </div>


    {/* User table */}
    <div className='text-center my-4'>
        <div>
            {users.length <= 0 ? (
                <></>
            ) : (
                // <table className='min-w-full border-collapse border border-gray-300'>
                //     {/* <h1 className='text-2xl font-semibold mb-4'>User  Data</h1> */}
                //     <thead>
                //         <tr className='bg-gray-800 text-white'>
                //             {/* <th className='border border-gray-300 p-2'>Id</th> */}
                //             <th className='border border-gray-300 p-2'>Name</th>
                //             <th className='border border-gray-300 p-2'>Email</th>
                //             <th className='border border-gray-300 p-2'>Phone</th>
                //             <th className='border border-gray-300 p-2'>Gender</th>
                //             <th className='border border-gray-300 p-2'>Actions</th>
                //         </tr>
                //     </thead>
                //     <tbody>
                //         {users.map(user => (
                //             <tr key={user.id} className='hover:bg-gray-100'>
                //                 {/* <td className='border border-gray-300 p-2'>{user.id}</td> */}
                //                 <td className='border border-gray-300 p-2 '>{user.name}</td>
                //                 <td className='border border-gray-300 p-2'>{user.email}</td>
                //                 <td className='border border-gray-300 p-2'>{user.phone}</td>
                //                 <td className='border border-gray-300 p-2'>{user.gender}</td>
                //                 <td className='border border-gray-300 p-2'>
                //             <div className='flex md:justify-center '>
                //                 <button
                //                     onClick={() => handleEdit(user)}
                //                     className='bg-yellow-500 text-white px-2 py-2 rounded hover:bg-yellow-600 transition duration-300'
                //                 >
                //                     <FaEdit
                //                         className='w-5 h-5'
                //                     />
                //                 </button>
                //                 <button
                //                     onClick={() => handleDelete(user.id)}
                //                     className='bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600 transition duration-300 ml-2'
                //                 >
                //                     <FaTrash 
                //                         className='w-5 h-5'
                //                     />
                //                 </button>
                //             </div>

                //                 </td>
                //             </tr>
                //         ))}
                //     </tbody>
                // </table>
                <></>
            )}
        </div>
    </div>
            <Cards 
                users = {users}
                handleEdit = {handleEdit}
                handleDelete = {handleDelete}
            />
</div>
</>
    );
};

export default Form;