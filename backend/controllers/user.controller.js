import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import Doctor from '../models/doctor.model.js'
import Appointment from '../models/appointment.model.js'
import razorpay from 'razorpay'

const razorpayInstance = new razorpay({
    key_id: 'dummyid',
    key_secret: 'dummysecret'
})

// API to register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details!" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }

        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new User(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

// API for login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist!" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials!" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
export const getProfile = async (req, res) => {
    try {
        // Use req.userId instead of req.body.userId (set by middleware)
        const { userId } = req

        // Find user in database
        const userData = await User.findById(userId).select('-password')

        if (!userData) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
export const updateProfile = async (req, res) => {
    try {
        // Get userId from middleware (authUser sets req.userId)
        const userId = req.userId
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        // Validation
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data missing!" })
        }

        // Parse address if it's a string
        let parsedAddress = address
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address)
            } catch (e) {
                return res.json({ success: false, message: "Invalid address format" })
            }
        }

        // Update user profile
        await User.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender
        })

        // Handle image upload if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await User.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile updated!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment
export const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body

        // Add validation for required fields
        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({
                success: false,
                message: "All fields are required (userId, docId, slotDate, slotTime)"
            })
        }

        const docData = await Doctor.findById(docId).select('-password')
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found!" })
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available!" })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await User.findById(userId).select('-password')
        if (!userData) {
            return res.json({ success: false, message: "User not found!" })
        }

        // Create a complete docData object INCLUDING image and address
        const cleanDocData = {
            _id: docData._id,
            name: docData.name,
            email: docData.email,
            speciality: docData.speciality,
            fees: docData.fees,
            address: docData.address,  // This was missing the proper save
            image: docData.image,      // This was completely missing!
            degree: docData.degree,
            experience: docData.experience,
            about: docData.about
        }

        const appointmentData = {
            userId,
            docId,
            userData: userData.toObject(), // Convert to plain object
            docData: cleanDocData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new Appointment(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await Doctor.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Booked" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointment for frontend my-appointments page
export const listAppointment = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" })
        }

        const appointments = await Appointment.find({ userId })
            .populate('docId', 'name speciality image address fees degree experience')
            .populate('userId', 'name email phone address image')

        res.json({ success: true, appointments })
    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment
export const cancelAppointment = async (req, res) => {
    try {
        // Get userId from auth middleware instead of req.body
        const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Convert both to strings for comparison (in case one is ObjectId)
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await Doctor.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await Doctor.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export const processPayment = async (req, res) => {
    try {
        const userId = req.userId
        const { appointmentId, upiId, paymentMethod, amount } = req.body

        // Find the appointment
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Verify the appointment belongs to the user
        if (appointment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        // Check if appointment is already paid
        if (appointment.payment) {
            return res.json({ success: false, message: 'Payment already completed' })
        }

        // Check if appointment is cancelled
        if (appointment.cancelled) {
            return res.json({ success: false, message: 'Cannot pay for cancelled appointment' })
        }

        // Simulate payment processing (90% success rate for demo)
        const paymentSuccess = Math.random() > 0.1 // 90% success rate

        if (paymentSuccess) {
            // Generate dummy payment/transaction ID
            const paymentId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000)

            // Update appointment with payment status
            await Appointment.findByIdAndUpdate(appointmentId, {
                payment: true,
                // You can add more payment details here if needed
                // paymentId: paymentId,
                // paymentDate: new Date(),
                // paymentMethod: upiId || paymentMethod
            })

            res.json({
                success: true,
                message: 'Payment successful!',
                paymentId: paymentId
            })
        } else {
            // Simulate payment failure
            res.json({
                success: false,
                message: 'Payment failed. Please try again.'
            })
        }

    } catch (error) {
        console.error(error)
        res.json({ success: false, message: error.message })
    }
}