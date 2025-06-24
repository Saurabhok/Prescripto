import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

    const { speciality } = useParams()
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
        } else {
            setFilterDoc(doctors)
        }
    }

    useEffect(() => {
        applyFilter()
    }, [doctors, speciality])

    const specialties = [
        'General physician',
        'Gynecologist',
        'Dermatologist',
        'Pediatricians',
        'Neurologist',
        'Gastroenterologist'
    ]

    return (
        <div className='max-w-7xl mx-auto px-4 py-6'>
            <p className='text-gray-600 text-lg mb-6'>Browse through the doctors specialist.</p>

            <div className='flex flex-col lg:flex-row gap-8'>
                {/* Filter Section */}
                <div className='lg:w-64 flex-shrink-0'>
                    <button
                        className={`w-full py-2 px-4 border rounded-lg text-sm font-medium transition-all lg:hidden mb-4 ${showFilter ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        onClick={() => setShowFilter(prev => !prev)}
                    >
                        {showFilter ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    <div className={`space-y-2 ${showFilter ? 'block' : 'hidden lg:block'}`}>
                        <h3 className='font-semibold text-gray-900 mb-3'>Specialties</h3>
                        {specialties.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
                                className={`w-full text-left px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 ${speciality === spec
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className='flex-1'>
                    {filterDoc.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500 text-lg'>No doctors found for this specialty.</p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 auto-rows-fr'>
                            {filterDoc.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/appointment/${item._id}`)}
                                    className='bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full'
                                >
                                    <div className='aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden'>
                                        <img
                                            className='w-full h-full object-cover'
                                            src={item.image}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.src = '/api/placeholder/300/300'
                                            }}
                                        />
                                    </div>

                                    <div className='p-4 flex-grow flex flex-col justify-between'>
                                        <div>
                                            <div className={`flex items-center gap-2 text-sm mb-2 ${item.available ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>
                                                <span className='font-medium'>
                                                    {item.available ? 'Available' : 'Not Available'}
                                                </span>
                                            </div>

                                            <h3 className='text-gray-900 text-lg font-semibold mb-1 line-clamp-2'>
                                                {item.name}
                                            </h3>

                                            <p className='text-gray-600 text-sm font-medium'>
                                                {item.speciality}
                                            </p>
                                        </div>

                                        <div className='mt-3 pt-3 border-t border-gray-100'>
                                            <button className='text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors'>
                                                Book Appointment →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Doctors