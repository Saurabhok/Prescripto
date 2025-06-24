import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRoutes from './routes/admin.route.js'
import doctorRouter from './routes/doctor.route.js'
import userRouter from './routes/user.route.js'

const app = express()
const port = process.env.PORT || 3000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// API Endpoints
app.use('/api/admin', adminRoutes)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('This is Home route')
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})