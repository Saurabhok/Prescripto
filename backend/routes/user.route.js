import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointment, loginUser, processPayment, registerUser, updateProfile } from '../controllers/user.controller.js'
import { authUser } from '../middleware/authUser.middleware.js'
import upload from '../middleware/multer.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)

userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)

userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/process-payment', authUser, processPayment)

export default userRouter