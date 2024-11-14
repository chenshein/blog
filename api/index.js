const User= require('./models/User')
const Post = require('./models/Post')
const bcrypt = require('bcryptjs'); // crypt the password
const salt = bcrypt.genSaltSync(10); //salt for the password
const jwt= require('jsonwebtoken')
const secret='jidsjksjkdsjk'
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path');



const express= require('express')
const app= express();
const cors= require('cors');
const mongoose = require("mongoose");

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json())
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect('mongodb+srv://mern-blog:vddmRgPbZAALQIdH@cluster0.ujzhw.mongodb.net/')



app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({
            username: username,
            password: bcrypt.hashSync(password,salt)
        })
       await user.save();
        res.json(user); // Send user data in the response
    } catch (error) {
        console.log(error)
        res.status(400).json(error.errmsg);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Find the user by username
    const userDoc = await User.findOne({ username });

    // Check if the user does not exist
    if (!userDoc) {
        return res.status(404).json('User not found, please register.');
    }

    // Check if the password is correct
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        // If the password is correct, log the user in and issue a JWT
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        // If the password is incorrect
        res.status(400).json('Wrong credentials');
    }
});


app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});



// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Customize file naming
    }
});
const upload = multer({ storage: storage });

app.post('/post', upload.single('file'), async (req, res) => {
    const { token } = req.cookies;

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    jwt.verify(token, secret, {}, async (error, info) => {
        if (error) return res.status(401).json({ error: 'Unauthorized' });

        // Create a new post with the uploaded image and other details
        const newPost = new Post({
            title: req.body.title,
            summary: req.body.summary,
            content: req.body.content,
            img: req.file.path, // Store the file path in the database
            author: info.id,
        });

        // Save the post to the database
        await newPost.save();

        // Respond with the file path after the post is saved
        res.json({
            message: 'File uploaded successfully',
            filePath: `/uploads/${req.file.filename}` // Path to the saved file
        });
    });
});

app.get('/post', async (req, res) => {
    try {
        // Populate 'author' and select only the 'username' field
        const posts = await Post.find().populate('author', 'username').sort({createdAt:-1}).limit(15);
        res.status(200).json(posts); // Send the response with the populated posts
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
    }
});

app.get('/post/:id', async (req, res)=>{
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'username'); // return the post info and the author info
    res.json(post)
})

app.put('/post/:id', upload.single('file'), async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, summary, content } = req.body;

        // Find the post to update
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update post fields
        post.title = title;
        post.summary = summary;
        post.content = content;

        if (req.file) {
            // If there's a new file, update the image field
            post.img = req.file.path; // Store the file path in the db
        }

        await post.save(); // Save the updated post

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/post/:id', async (req,res)=>{
    const {id} = req.params;
    try {
        // Use await to ensure the deletion is completed before continuing
        const post = await Post.findByIdAndDelete(id);

        // If no post is found, return a 404 error
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // If post is successfully deleted, send a success message
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        // Handle any errors that occur during the deletion process
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
});

app.listen(4000)

