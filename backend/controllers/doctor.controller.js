import Doctor from "../models/doctor.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Appointment from "../models/appointment.model.js"

// API to change the Doctor's Availability
export const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const docData = await Doctor.findById(docId)
        await Doctor.findByIdAndUpdate(docId, { available: !docData.available })

        res.json({
            success: true,
            message: 'Availablity changed!'
        })
    } catch (err) {
        console.log(err)
        res.json({
            success: false,
            message: err.message
        })
    }
}

// API to get Doctor Lists
export const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })
    } catch (err) {
        console.log(err)
        res.json({ success: false, message: err.message })
    }
}

// API for doctor Login 
export const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await Doctor.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
export const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await Appointment.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark appointment completed for doctor panel
export const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment for doctor panel
export const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await Appointment.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await Appointment.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for doctor panel
export const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await Appointment.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
export const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await Doctor.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
export const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await Doctor.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
