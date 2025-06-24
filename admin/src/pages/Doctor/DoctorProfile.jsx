import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Main Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/20 p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            {/* Doctor Image */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <img
                                        className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-2xl border-4 border-white shadow-lg mx-auto lg:mx-0"
                                        src={profileData.image}
                                        alt={profileData.name}
                                    />
                                    {/* Availability Badge */}
                                    <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${profileData.available
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-400 text-white'
                                        }`}>
                                        {profileData.available ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1 text-center lg:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                                    {profileData.name}
                                </h1>

                                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mb-4">
                                    <span className="text-lg text-gray-600 font-medium">
                                        {profileData.degree} - {profileData.speciality}
                                    </span>
                                    <span className="px-4 py-2 bg-primary/20 text-primary font-semibold rounded-full text-sm">
                                        {profileData.experience}
                                    </span>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                        <div className="text-2xl font-bold text-primary">
                                            {currency} {profileData.fees}
                                        </div>
                                        <div className="text-sm text-gray-600">Consultation Fee</div>
                                    </div>
                                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                                        <div className="text-2xl font-bold text-primary">
                                            {profileData.available ? '✓' : '✗'}
                                        </div>
                                        <div className="text-sm text-gray-600">Currently Available</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* About Section */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        About Doctor
                                    </h3>
                                    <div className="text-gray-700 leading-relaxed">
                                        {isEdit ? (
                                            <textarea
                                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200"
                                                rows={6}
                                                value={profileData.about}
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="whitespace-pre-line">{profileData.about}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Details Sidebar */}
                            <div className="space-y-6">
                                {/* Consultation Fee */}
                                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                                        </svg>
                                        Consultation Fee
                                    </h3>
                                    <div className="text-2xl font-bold text-primary">
                                        {currency} {isEdit ? (
                                            <input
                                                type="number"
                                                onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                                                value={profileData.fees}
                                                className="w-24 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        ) : profileData.fees}
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Clinic Address
                                    </h3>
                                    <div className="space-y-2 text-gray-700">
                                        {isEdit ? (
                                            <>
                                                <input
                                                    type="text"
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                                    value={profileData.address.line1}
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Address Line 1"
                                                />
                                                <input
                                                    type="text"
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                                    value={profileData.address.line2}
                                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                    placeholder="Address Line 2"
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium">{profileData.address.line1}</p>
                                                <p className="text-sm text-gray-600">{profileData.address.line2}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Toggle */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Availability Status</h3>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                                                checked={profileData.available}
                                                disabled={!isEdit}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center ${profileData.available ? 'bg-green-500' : 'bg-gray-300'
                                                }`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${profileData.available ? 'translate-x-6' : 'translate-x-1'
                                                    }`}></div>
                                            </div>
                                        </div>
                                        <span className={`font-medium ${profileData.available ? 'text-green-600' : 'text-gray-500'}`}>
                                            {profileData.available ? 'Available for appointments' : 'Currently unavailable'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center mt-8">
                            {isEdit ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={updateProfile}
                                        className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 focus:ring-4 focus:ring-primary/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEdit(false)}
                                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white focus:ring-4 focus:ring-primary/30 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile