import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateUserProfileData = async () => {
        try {
            setLoading(true)
            const formData = new FormData()

            formData.append('userId', userData._id)
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            if (image) {
                formData.append('image', image)
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/update-profile',
                formData,
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('Update profile error:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!userData) {
        return (
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className='animate-pulse'>
                    <div className='bg-white rounded-2xl border border-gray-200 p-8'>
                        <div className='flex flex-col lg:flex-row gap-8'>
                            <div className='w-48 h-48 bg-gray-200 rounded-2xl'></div>
                            <div className='flex-1 space-y-4'>
                                <div className='h-8 bg-gray-200 rounded w-1/3'></div>
                                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                                <div className='space-y-3'>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className='h-4 bg-gray-200 rounded w-full'></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold text-gray-900 mb-2'>My Profile</h1>
                <p className='text-gray-600'>Manage your personal information and preferences</p>
            </div>

            <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
                {/* Header Section */}
                <div className='bg-gradient-to-r from-indigo-50 to-blue-50 p-8'>
                    <div className='flex flex-col lg:flex-row items-center lg:items-start gap-8'>
                        {/* Profile Image */}
                        <div className='relative flex-shrink-0'>
                            {isEdit ? (
                                <label htmlFor='image' className='cursor-pointer group'>
                                    <div className='relative w-48 h-48 rounded-2xl overflow-hidden bg-white shadow-lg'>
                                        <img
                                            className='w-full h-full object-cover transition-opacity group-hover:opacity-75'
                                            src={image ? URL.createObjectURL(image) : userData.image}
                                            alt={userData.name}
                                            onError={(e) => {
                                                e.target.src = '/api/placeholder/200/200'
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                            <div className='text-white text-center'>
                                                <svg className='w-8 h-8 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                                                </svg>
                                                <p className='text-sm font-medium'>Change Photo</p>
                                            </div>
                                        </div>
                                    </div>
                                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden accept='image/*' />
                                </label>
                            ) : (
                                <div className='w-48 h-48 rounded-2xl overflow-hidden bg-white shadow-lg'>
                                    <img
                                        className='w-full h-full object-cover'
                                        src={userData.image}
                                        alt={userData.name}
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/200/200'
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Name and Basic Info */}
                        <div className='flex-1 text-center lg:text-left'>
                            {isEdit ? (
                                <input
                                    className='text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-indigo-300 focus:border-indigo-500 outline-none pb-2 mb-4 w-full max-w-md'
                                    type='text'
                                    value={userData.name}
                                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            ) : (
                                <h2 className='text-3xl font-bold text-gray-900 mb-4'>{userData.name}</h2>
                            )}

                            <div className='flex flex-wrap justify-center lg:justify-start gap-4 mb-6'>
                                <div className='flex items-center gap-2 text-gray-600'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                    </svg>
                                    <span className='text-sm font-medium'>{userData.gender}</span>
                                </div>
                                <div className='flex items-center gap-2 text-gray-600'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm-6 4a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6z' />
                                    </svg>
                                    <span className='text-sm font-medium'>{userData.dob}</span>
                                </div>
                            </div>

                            <div className='flex justify-center lg:justify-start'>
                                {isEdit ? (
                                    <div className='flex gap-3'>
                                        <button
                                            onClick={updateUserProfileData}
                                            disabled={loading}
                                            className='px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                                        >
                                            {loading && (
                                                <svg className='animate-spin w-4 h-4' fill='none' viewBox='0 0 24 24'>
                                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                </svg>
                                            )}
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEdit(false)
                                                setImage(false)
                                                loadUserProfileData()
                                            }}
                                            className='px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEdit(true)}
                                        className='px-6 py-2 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-colors duration-200'
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information Sections */}
                <div className='p-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Contact Information */}
                        <div className='bg-gray-50 rounded-xl p-6'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900'>Contact Information</h3>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>Email Address</label>
                                    <p className='text-indigo-600 font-medium'>{userData.email}</p>
                                </div>

                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>Phone Number</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                                            type='tel'
                                            value={userData.phone}
                                            onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder='Enter phone number'
                                        />
                                    ) : (
                                        <p className='text-gray-900 font-medium'>{userData.phone || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>Address</label>
                                    {isEdit ? (
                                        <div className='space-y-2'>
                                            <input
                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                                value={userData.address.line1}
                                                type='text'
                                                placeholder='Address line 1'
                                            />
                                            <input
                                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                                value={userData.address.line2}
                                                type='text'
                                                placeholder='Address line 2'
                                            />
                                        </div>
                                    ) : (
                                        <div className='text-gray-900'>
                                            <p>{userData.address.line1}</p>
                                            <p>{userData.address.line2}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className='bg-gray-50 rounded-xl p-6'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                    </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>Gender</label>
                                    {isEdit ? (
                                        <select
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                            value={userData.gender}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className='text-gray-900 font-medium'>{userData.gender || 'Not specified'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='text-sm font-medium text-gray-600 block mb-1'>Date of Birth</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
                                            type='date'
                                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                            value={userData.dob}
                                        />
                                    ) : (
                                        <p className='text-gray-900 font-medium'>{userData.dob || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile