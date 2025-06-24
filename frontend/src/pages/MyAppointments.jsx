import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import PaymentModal from './PaymentModal'

const MyAppointments = () => {

    const { backendUrl, token, getDoctorsData } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const [paymentModal, setPaymentModal] = useState({ isOpen: false, appointment: null })
    const [loading, setLoading] = useState(true)
    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
                getDoctorsData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const openPaymentModal = (appointment) => {
        setPaymentModal({ isOpen: true, appointment })
    }

    const closePaymentModal = () => {
        setPaymentModal({ isOpen: false, appointment: null })
    }

    const handlePaymentSuccess = () => {
        getUserAppointments()
    }

    const getStatusBadge = (item) => {
        if (item.cancelled) {
            return (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                    Cancelled
                </span>
            )
        }
        if (item.isCompleted) {
            return (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                    Completed
                </span>
            )
        }
        if (item.payment) {
            return (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Paid
                </span>
            )
        }
        return (
            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                Pending Payment
            </span>
        )
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    if (loading) {
        return (
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='animate-pulse space-y-6'>
                    <div className='h-8 bg-gray-200 rounded w-1/4'></div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className='bg-white rounded-xl border p-6'>
                            <div className='flex gap-6'>
                                <div className='w-24 h-24 bg-gray-200 rounded-lg'></div>
                                <div className='flex-1 space-y-3'>
                                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-6xl mx-auto px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-900 mb-2'>My Appointments</h1>
                <p className='text-gray-600'>Manage your upcoming and past appointments</p>
            </div>

            {appointments.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                        <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6z' />
                        </svg>
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>No appointments found</h3>
                    <p className='text-gray-500'>You haven't booked any appointments yet.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {appointments.map((item, index) => (
                        <div key={index} className='bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200'>
                            <div className='flex flex-col lg:flex-row gap-6'>
                                {/* Doctor Image */}
                                <div className='flex-shrink-0'>
                                    <div className='w-24 h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50'>
                                        <img
                                            className='w-full h-full object-cover'
                                            src={item.docData.image}
                                            alt={item.docData.name}
                                            onError={(e) => {
                                                e.target.src = '/api/placeholder/120/120'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className='flex-1 min-w-0'>
                                    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                                                {item.docData.name}
                                            </h3>
                                            <p className='text-indigo-600 font-medium mb-2'>
                                                {item.docData.speciality}
                                            </p>
                                        </div>
                                        <div className='flex-shrink-0'>
                                            {getStatusBadge(item)}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600'>
                                        <div>
                                            <p className='font-medium text-gray-700 mb-1'>Address:</p>
                                            <p>{item.docData.address.line1}</p>
                                            <p>{item.docData.address.line2}</p>
                                        </div>

                                        <div>
                                            <p className='font-medium text-gray-700 mb-1'>Appointment:</p>
                                            <p className='flex items-center gap-2'>
                                                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6z' />
                                                </svg>
                                                {slotDateFormat(item.slotDate)} at {item.slotTime}
                                            </p>
                                            <p className='flex items-center gap-2 mt-1'>
                                                <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                                                </svg>
                                                ₹{item.amount}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex-shrink-0'>
                                    <div className='flex flex-col gap-2 min-w-0 sm:min-w-[160px]'>
                                        {!item.cancelled && !item.payment && !item.isCompleted && (
                                            <>
                                                <button
                                                    onClick={() => openPaymentModal(item)}
                                                    className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200'
                                                >
                                                    Pay Now
                                                </button>
                                                <button
                                                    onClick={() => cancelAppointment(item._id)}
                                                    className='px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors duration-200'
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                        {!item.cancelled && item.payment && !item.isCompleted && (
                                            <button className='px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg cursor-default'>
                                                ✓ Payment Completed
                                            </button>
                                        )}

                                        {item.cancelled && (
                                            <button className='px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-lg cursor-default'>
                                                Appointment Cancelled
                                            </button>
                                        )}

                                        {item.isCompleted && (
                                            <button className='px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-lg cursor-default'>
                                                ✓ Completed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <PaymentModal
                isOpen={paymentModal.isOpen}
                onClose={closePaymentModal}
                appointment={paymentModal.appointment}
                backendUrl={backendUrl}
                token={token}
                onPaymentSuccess={handlePaymentSuccess}
            />
        </div>
    )
}

export default MyAppointments