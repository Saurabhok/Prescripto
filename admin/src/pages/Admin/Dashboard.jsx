import React, { useContext, useEffect } from 'react';
import { assets } from '../../assets/assets_admin/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
    const { adminToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
    const { slotDateFormat } = useContext(AppContext);

    useEffect(() => {
        if (adminToken) {
            getDashData();
        }
    }, [adminToken, getDashData]);

    const getStatusBadge = (appointment) => {
        if (appointment.cancelled) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancelled
                </span>
            );
        } else if (appointment.isCompleted) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Pending
                </span>
            );
        }
    };

    const displayDashData = dashData || { doctors: 0, appointments: 0, patients: 0, latestAppointments: [] };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, Admin! Here's your clinic overview</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Doctors */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-blue-700">{displayDashData.doctors}</p>
                                <p className="text-blue-600 font-medium">Total Doctors</p>
                            </div>
                        </div>
                    </div>

                    {/* Appointments */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-700">{displayDashData.appointments}</p>
                                <p className="text-green-600 font-medium">Total Appointments</p>
                            </div>
                        </div>
                    </div>

                    {/* Patients */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-purple-700">{displayDashData.patients}</p>
                                <p className="text-purple-600 font-medium">Total Patients</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Latest Appointments */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900">Latest Bookings</h2>
                            <span className="ml-auto bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {displayDashData.latestAppointments?.length || 0} Recent
                            </span>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {displayDashData.latestAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium text-gray-900">No recent bookings</h3>
                                <p className="text-gray-500">Your latest appointments will appear here.</p>
                            </div>
                        ) : (
                            displayDashData.latestAppointments.slice(0, 5).map((item, index) => (
                                <div key={item._id || index} className="px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-all duration-200">
                                    <div className="flex items-start space-x-4">
                                        <img className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" src={item.docData?.image || 'https://placehold.co/100x100'} alt="Doctor" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Dr. {item.docData?.name}</h3>
                                            <p className="text-sm text-gray-600">Patient: {item.userData?.name}</p>
                                            <p className="text-sm text-gray-600">{slotDateFormat(item.slotDate)} at {item.slotTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        {getStatusBadge(item)}
                                        {!item.cancelled && !item.isCompleted && (
                                            <button
                                                onClick={() => cancelAppointment(item._id)}
                                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                                                title="Cancel"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;