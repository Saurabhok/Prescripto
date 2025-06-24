import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import Doctor from "../models/doctor.model.js"
import jwt from "jsonwebtoken"
import Appointment from '../models/appointment.model.js'
import User from '../models/user.model.js'

// API for adding doctor
export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({
                success: false,
                message: "Details are missing!"
            })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Email is not in valid Format!"
            })
        }

        // check if password is strong or not
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Password length is less than 8 character!"
            })
        }

        // Hashing the Doctor's password
        const salt = await bcrypt.genSalt(8)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Uploading Doctor's profile image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageURL = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new Doctor(doctorData)
        await newDoctor.save()

        res.json({
            success: true,
            message: "New Doctor successfully added!"
        })
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: err.message
        })
    }
}

// API for admin Login
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)

            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: "Invalid Credentials!"
            })
        }
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: err.message
        })
    }
}

// API to get all doctors list for admin panel
export const allDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-password')
        res.json({
            success: true,
            doctors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// API to get all appointments list
export const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await Appointment.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
export const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
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

// API to get dashboard data for admin panel
export const adminDashboard = async (req, res) => {
    try {

        const doctors = await Doctor.find({})
        const users = await User.find({})
        const appointments = await Appointment.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}