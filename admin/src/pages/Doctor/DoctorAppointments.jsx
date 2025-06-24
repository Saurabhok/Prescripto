import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointments = () => {

    const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
    const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getAppointments()
        }
    }, [dToken])

    const getStatusBadge = (appointment) => {
        if (appointment.cancelled) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancelled
                </span>
            )
        } else if (appointment.isCompleted) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                </span>
            )
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Pending
                </span>
            )
        }
    }

    const getPaymentBadge = (payment) => {
        return payment ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Online
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Cash
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                            <p className="text-gray-600 mt-1">Manage your patient appointments</p>
                        </div>
                        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border">
                            <span className="text-sm text-gray-600">Total: </span>
                            <span className="text-lg font-semibold text-primary">{appointments.length}</span>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</div>
                        <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</div>
                        <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</div>
                        <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Age</div>
                        <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</div>
                        <div className="col-span-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</div>
                        <div className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status/Actions</div>
                    </div>

                    {/* Appointments List */}
                    <div className="max-h-[70vh] overflow-y-auto">
                        {appointments.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments</h3>
                                <p className="mt-1 text-gray-500">You don't have any appointments scheduled yet.</p>
                            </div>
                        ) : (
                            appointments.reverse().map((item, index) => (
                                <div key={index}>
                                    {/* Desktop Layout */}
                                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-all duration-200 border-b border-gray-100">
                                        <div className="col-span-1">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                                                {index + 1}
                                            </span>
                                        </div>

                                        <div className="col-span-3 flex items-center space-x-3">
                                            <img
                                                src={item.userData.image}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                alt={item.userData.name}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{item.userData.name}</p>
                                                <p className="text-sm text-gray-500">Patient ID: #{item.userData._id?.slice(-6)}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-1">
                                            {getPaymentBadge(item.payment)}
                                        </div>

                                        <div className="col-span-1">
                                            <span className="text-sm text-gray-900 font-medium">{calculateAge(item.userData.dob)} yrs</span>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">{slotDateFormat(item.slotDate)}</p>
                                                <p className="text-xs text-gray-500">{item.slotTime}</p>
                                            </div>
                                        </div>

                                        <div className="col-span-1">
                                            <span className="text-lg font-semibold text-green-600">{currency}{item.amount}</span>
                                        </div>

                                        <div className="col-span-2">
                                            {item.cancelled || item.isCompleted ? (
                                                getStatusBadge(item)
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => completeAppointment(item._id)}
                                                        className="inline-flex items-center p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                                        title="Mark as Complete"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="inline-flex items-center p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                                                        title="Cancel Appointment"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Mobile Layout */}
                                    <div className="lg:hidden p-6 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={item.userData.image}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                    alt={item.userData.name}
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{item.userData.name}</h3>
                                                    <p className="text-sm text-gray-500">{calculateAge(item.userData.dob)} years old</p>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Date & Time</p>
                                                <p className="text-sm font-medium text-gray-900">{slotDateFormat(item.slotDate)}</p>
                                                <p className="text-xs text-gray-600">{item.slotTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Fee</p>
                                                <p className="text-lg font-semibold text-green-600">{currency}{item.amount}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                {getPaymentBadge(item.payment)}
                                                {getStatusBadge(item)}
                                            </div>

                                            {!item.cancelled && !item.isCompleted && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => completeAppointment(item._id)}
                                                        className="inline-flex items-center p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                                        title="Complete"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="inline-flex items-center p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
                                                        title="Cancel"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorAppointments