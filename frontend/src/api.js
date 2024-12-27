import axios from 'axios'; 

const API_URL = "http://localhost:3001/users"; // Updated to point to the /users endpoint

export const getUsers = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; 
    } catch (err) {
        console.error(err); 
        throw err; 
    }
};

export const createUser = async (user, imageFile) => { 
    try { 
        const formData = new FormData();
        formData.append('user', JSON.stringify(user));
        formData.append('image', imageFile);
        const response = await axios.post(API_URL, formData, { 
            headers: { 'Content-Type': 'multipart/form-data', }, 
        });
        return response.data.link;
    }
     catch (error) {
         console.error(error); throw error; 
        } 
    };

export const deleteUser  = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`); // DELETE to /users/:id
        return response.data;
    } catch (error) {
        console.error(error);
        throw error; 
    }
};

export const updateUser  = async (id, user,imageFile) => {
    try {
        const formData = new FormData();
        formData.append('user', JSON.stringify(user)); // Append user data as JSON string
        formData.append('image', imageFile); // Append image file

        const response = await axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // console.log(response.data.link)
        return response.data.link;
    } catch (error) {
        console.error(error);
        // throw error; 
    }
};