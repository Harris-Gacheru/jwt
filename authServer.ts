import express from 'express'
import auth_router from './Routers/users.routes'
const app = express()

app.use(express.json())
app.use('/posts', auth_router)

const PORT = 5000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})