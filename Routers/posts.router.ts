import express from 'express'
import { createPost, getPosts } from '../Controllers/posts.controller'
import { verifyToken } from '../Middleware/verifyToken'
const posts_router = express.Router()

posts_router.post('/create_post', verifyToken, createPost)
posts_router.get('/posts', verifyToken, getPosts)

export default posts_router