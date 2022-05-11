import express from 'express'
import posts_router from './Routers/posts.router'
const app = express()

app.use(express.json())
app.use('/posts', posts_router)

const PORT = 4000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)
})