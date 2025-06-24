import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const navigate = useNavigate()

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [showSummary, setShowSummary] = useState(false)

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSlots = async () => {
        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {
            // getting date with index
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting Hours
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {
                    // add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => ([...prev, timeSlots]))
        }
    }

    const handleProceedToSummary = () => {
        if (!slotTime) {
            toast.error('Please select a time slot')
            return
        }
        setShowSummary(true)
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment')
            return navigate('/login')
        }

        // Check if userData exists and has _id
        if (!userData || !userData._id) {
            toast.error('User data not found. Please login again.')
            return navigate('/login')
        }

        try {
            const date = docSlots[slotIndex][0].datetime

            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const slotDate = day + "_" + month + "_" + year

            // Include userId in the request body
            const requestData = {
                userId: userData._id,
                docId,
                slotDate,
                slotTime
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/book-appointment',
                requestData,
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message || 'Booking failed')
        }
    }

    const getSelectedDate = () => {
        if (docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex][0]) {
            const date = docSlots[slotIndex][0].datetime
            return date.toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
        return ''
    }

    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        getAvailableSlots()
    }, [docInfo])

    if (showSummary) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Appointment Summary</h2>
                        <p className="opacity-90">Please review your appointment details</p>
                    </div>

                    {/* Summary Content */}
                    <div className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Doctor Info */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={docInfo.image}
                                        alt={docInfo.name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{docInfo.name}</h3>
                                        <p className="text-gray-600">{docInfo.speciality}</p>
                                        <p className="text-sm text-gray-500">{docInfo.degree}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">About Doctor</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{docInfo.about}</p>
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="space-y-6">
                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Appointment Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span className="font-medium text-gray-900">{getSelectedDate()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-medium text-gray-900">{slotTime}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="font-medium text-gray-900">30 minutes</span>
                                        </div>
                                        <div className="border-t pt-3 mt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Consultation Fee:</span>
                                                <span className="font-bold text-xl text-blue-600">{currencySymbol}{docInfo.fees}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                    <div className="flex items-start space-x-2">
                                        <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center mt-0.5">
                                            <span className="text-white text-xs font-bold">!</span>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-yellow-800">Important Note</h5>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Please arrive 10 minutes before your scheduled appointment time.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-8 pt-6 border-t">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Back to Slots
                            </button>
                            <button
                                onClick={bookAppointment}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                            >
                                Confirm Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return docInfo && (
        <div className="max-w-6xl mx-auto p-6">
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                <div className="md:flex">
                    {/* Doctor Image */}
                    <div className="md:w-1/3 relative">
                        <img
                            className="w-full h-full object-cover min-h-[300px]"
                            src={docInfo.image}
                            alt={docInfo.name}
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Available
                            </span>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="md:w-2/3 p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    {docInfo.name}
                                    <img className="w-6 h-6" src={assets.verified_icon} alt="verified" />
                                </h1>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-gray-600">{docInfo.degree} - {docInfo.speciality}</span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {docInfo.experience}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mb-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                <img src={assets.info_icon} alt="info" className="w-5 h-5" />
                                About Doctor
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{docInfo.about}</p>
                        </div>

                        {/* Fee and Status */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Consultation Fee</h4>
                                <p className="text-2xl font-bold text-blue-600">{currencySymbol}{docInfo.fees}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                                <p className="text-lg font-semibold text-green-600 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Currently Available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Appointment</h2>

                {/* Date Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {docSlots.length > 0 && docSlots.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSlotIndex(index)}
                                className={`min-w-[80px] text-center py-4 px-3 rounded-xl cursor-pointer transition-all ${slotIndex === index
                                    ? 'bg-gradient-to-b from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <p className="text-xs font-medium opacity-80">
                                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                                </p>
                                <p className="text-lg font-bold mt-1">
                                    {item[0] && item[0].datetime.getDate()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setSlotTime(item.time)}
                                className={`py-3 px-4 rounded-lg font-medium transition-all ${item.time === slotTime
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {item.time.toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-6 border-t">
                    <button
                        onClick={handleProceedToSummary}
                        disabled={!slotTime}
                        className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all ${slotTime
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {slotTime ? 'Proceed to Summary' : 'Select a Time Slot'}
                    </button>
                </div>
            </div>

            {/* Related Doctors */}
            <div className="mt-12">
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
        </div>
    )
}

export default Appointment