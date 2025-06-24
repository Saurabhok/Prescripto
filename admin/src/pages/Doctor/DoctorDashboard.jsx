import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets_admin/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

    const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
    const { slotDateFormat, currency } = useContext(AppContext)

    useEffect(() => {
        if (dToken) {
            getDashData()
        }
    }, [dToken])

    const getStatusBadge = (appointment) => {
        if (appointment.cancelled) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancelled
                </span>
            )
        } else if (appointment.isCompleted) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                </span>
            )
        } else {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Pending
                </span>
            )
        }
    }

    return dashData && (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your practice overview</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Earnings Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-green-700">{currency} {dashData.earnings}</p>
                                    <p className="text-green-600 font-medium">Total Earnings</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointments Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-blue-700">{dashData.appointments}</p>
                                    <p className="text-blue-600 font-medium">Appointments</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patients Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-purple-700">{dashData.patients}</p>
                                    <p className="text-purple-600 font-medium">Total Patients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Bookings Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Latest Bookings</h2>
                            <span className="ml-auto bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {dashData.latestAppointments.length} Recent
                            </span>
                        </div>
                    </div>

                    {/* Appointments List */}
                    <div className="divide-y divide-gray-100">
                        {dashData.latestAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No recent bookings</h3>
                                <p className="mt-1 text-gray-500">Your latest appointments will appear here.</p>
                            </div>
                        ) : (
                            dashData.latestAppointments.slice(0, 5).map((item, index) => (
                                <div key={index}>
                                    {/* Desktop Layout */}
                                    <div className="hidden md:flex items-center px-6 py-4 hover:bg-gray-50 transition-all duration-200">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <img
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                src={item.userData.image}
                                                alt={item.userData.name}
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{item.userData.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Booking on {slotDateFormat(item.slotDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {getStatusBadge(item)}

                                            {!item.cancelled && !item.isCompleted && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => completeAppointment(item._id)}
                                                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                                        title="Mark as Complete"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => cancelAppointment(item._id)}
                                                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
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
                                    <div className="md:hidden p-6 hover:bg-gray-50 transition-all duration-200">
                                        <div className="flex items-start space-x-4">
                                            <img
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                                                src={item.userData.image}
                                                alt={item.userData.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{item.userData.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {slotDateFormat(item.slotDate)}
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    {getStatusBadge(item)}

                                                    {!item.cancelled && !item.isCompleted && (
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => completeAppointment(item._id)}
                                                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors duration-200"
                                                                title="Complete"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={() => cancelAppointment(item._id)}
                                                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
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

export default DoctorDashboard