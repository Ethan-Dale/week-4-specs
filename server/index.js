require('dotenv').config()

const express = require('express')
const cors = require('cors')

const {SERVER_PORT} = process.env
const {getAllPosts, getCurrentUserPosts, addPost, editPost, deletePost} = require('./controller/posts')
const {register, login} = require('./controller/auth')
const {isAuthenticated} = require('./middleware/isAuthenticated')
const {sequelize} = require('./util/database')
const {User} = require('./models/user')
const {Post} = require('./models/post')

const app = express()

User.hasMany(Post)
Post.belongsTo(User)

app.use(express.json())
app.use(cors())

//AUTH
app.post('/register', register)
app.post('/login', login)

// GET POSTS - no auth
app.get('/posts', getAllPosts)

// CRUD POSTS - auth required
app.get('/userposts/:userId', getCurrentUserPosts)
app.post('/posts', isAuthenticated, addPost)
app.put('/posts/:id', isAuthenticated, editPost)
app.delete('/posts/:id', isAuthenticated, deletePost)



sequelize.sync()
.then(() => {
    app.listen(SERVER_PORT, () => console.log(`db sync successful & server running on port ${SERVER_PORT}`))
})
.catch(err => console.log(err))