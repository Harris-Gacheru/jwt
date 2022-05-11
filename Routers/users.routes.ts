import express from 'express'
import { createUser, getUser, getUsers, login, token } from '../Controllers/users.controller'
const auth_router = express.Router()

auth_router.post('/register', createUser)
auth_router.post('/login', login)
auth_router.get('/users', getUsers)
auth_router.get('/user/:email', getUser)
auth_router.post('/refreshtoken', token)

export default auth_router