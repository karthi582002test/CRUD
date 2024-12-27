import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser , updateUser  } from '../api'; 
import { toast } from 'react-toastify';

const UserData = () => {
    const [users, setUsers] = useState([]); 
    const [editingUser , setEditingUser ] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', gender: '' });

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

    const handleDelete = async (id) => {
        try {
            await deleteUser (id); 
            setUsers(users.filter(user => user.id !== id));
            // alert("Deleted User");
            toast.success("User Deleted")
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser (user);
        setFormData({ name: user.name, email: user.email, phone: user.phone, gender: user.gender });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedUser  = { ...editingUser , ...formData };
            await updateUser (updatedUser .id, updatedUser );
            setUsers(users.map(user => (user.id === updatedUser .id ? updatedUser  : user)));
            setEditingUser (null);
            setFormData({ name: '', email: '', phone: '', gender: '' });
            toast.success("User updated successfully");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='text-center my-2 flex justify-center align-middle flex-col '>
            <h1 className='text-xl cursor-pointer underline mb-2'
             onClick={()=>{fetchData()}}
            >User  Data</h1>
            {editingUser  && (
                <form onSubmit={handleUpdate} className='mb-5'>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Name"
                        className='border p-2 m-1'
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Email"
                        className='border p-2 m-1'
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="Phone"
                        className='border p-2 m-1'
                    />
                    <input
                        type="text"
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        placeholder="Gender"
                        className='border p-2 m-1'
                    />
                    <button type="submit" className='bg-blue-500 text-white px-2 py-1 rounded'>
                        Update User
                    </button>
                    <button type="button" onClick={() => setEditingUser (null)} className='bg-gray-500 text-white px-2 py-1 rounded ml-2'>
                        Cancel
                    </button>
                </form>
            )}
            <div>
{        users.length <=  0 ? (
                        <div className='flex justify-center items-center flex-col'>
                          <p>
                            No Data Please add Some Datas......
                          </p>
                          <img
                          className='h-52'
                            src='no-data.jpg'
                          />
                        </div>
                      ):(
                        <table className='min-w-full border-collapse border border-gray-900'>
                              <thead>
                                    <tr className='bg-gray-900'>
                                      <th className='border border-gray-300 p-2'>Id</th>
                                      <th className='border border-gray-300 p-2'>Name</th>
                                      <th className='border border-gray-300 p-2'>Email</th>
                                      <th className='border border-gray-300 p-2'>Phone</th>
                                      <th className='border border-gray-300 p-2'>Gender</th>
                                      <th className='border border-gray-300 p-2'>DOJ</th>
                                      <th className='border border-gray-300 p-2'>Actions</th>
                                    </tr>
                              </thead>
                                    <tbody>
                      {
                        users.map(user => (
                                    <tr key={user.id} className='hover:bg-gray-100 '>
                                        <td className='border border-gray-300 p-2'>{user.id}</td>
                                        <td className='border border-gray-300 p-2'>{user.name }</td>
                                        <td className='border border-gray-300 p-2'>{user.email}</td>
                                        <td className='border border-gray-300 p-2'>{user.phone}</td>
                                        <td className='border border-gray-300 p-2'>{user.gender}</td>
                                        <td className='border border-gray-300 p-2'>{user.DOJ}</td>
                                        <td className='border border-gray-300 p-2'>
                                            <button 
                                                onClick={() => handleEdit(user)} 
                                                className='bg-yellow-500 text-white px-2 py-1 rounded mr-2'
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className='bg-red-500 text-white px-2 py-1 rounded'
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                              }
                                </tbody>
                            </table>
                                
                      )
                      }
            </div>
        </div>
    );
};

export default UserData;