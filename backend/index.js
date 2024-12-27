const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); 
const { upload } = require('./cloudinary');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
// const { User } = require('./Models/Model');

dotenv.config();


app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true }));

mongoose.connect(process.env.MONGO_BD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    id : {type:String , required:true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone : {type:String , required:true},
    gender : {type : String, require:true},
    imageLink : {type:String, require : true}
});

const  User = mongoose.model('users-data', userSchema);


// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const user = JSON.parse(req.body.user);
        cb(null, `${user?.id}.jpg`);
    },
});

// const upload = multer({ storage });

const data = [
    {
        "id": "74f432ac41bdb306",
        "name": "karthikeyan M",
        "email": "karthi582002@gmail.com",
        "phone": "9874563210",
        "gender": "female",
        "imagePath": "https://res.cloudinary.com/dnyll0wjf/image/upload/v1735291126/keqqvc2zknj3nu20e4aq.jpg"
    }
];

// Centralized endpoint for user management
app.route('/users')
    .get((req, res) => {
        // Get all users
        res.contentType('application/json');
        res.status(200).json(data);
    })
 .post(async (req, res) => { 
     try {
         const user = JSON.parse(req.body.user);
          // Validate user data and file 
          if (user && user.id && user.name && req.files && req.files.image) {
             const cloudFile = await upload(req.files.image.tempFilePath);
              // Upload to Cloudinary
               user.imagePath = cloudFile.secure_url;
            //    const newUser = User(user)
            //    await newUser.save()
                // Save Cloudinary URL 
                data.push(user); 
                res.status(201).json({ message: "Success", link : cloudFile.secure_url }); 
            } else {
                 res.status(400).json({ message: "Invalid user data or missing image" }); 
                } 
            } catch (error) {
                 console.error(error); res.status(500).json({ message: "Internal Server Error" }); 
                }
            });

// Handle user operations by ID
app.route('/users/:id')
    .delete((req, res) => {
        // Delete a user by ID
        const id = req.params.id;
        const index = data.findIndex(user => user.id === id);
        if (index !== -1) {
            data.splice(index, 1);
            res.status(200).json({ message: "Success" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    })
    .put(async (req, res) => {
        // Update a user by ID
            try {
                const user = JSON.parse(req.body.user);
                const { id } = req.params;
                const existingUserIndex = data.findIndex(u => u.id === id);
                if (existingUserIndex !== -1) {
                    if (req.files && req.files.image) {
                        const cloudFile = await upload(req.files.image.tempFilePath); 
                        user.imagePath = cloudFile.secure_url;
                    }
                    data[existingUserIndex] = {
                        ...data[existingUserIndex], ...user
                    };
                    console.log(user.imagePath)
                    res.status(200).json({ message: "User updated successfully", link : user.imagePath });
                } else {
                    res.status(400).json({ message: "Invalid user data or missing image" });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        

// Start the server
app.listen(3001, () => {
    console.log("Running on Port 3001");
});
