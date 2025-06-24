import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets_admin/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General Physician');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const { backendUrl, adminToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) {
                return toast.error('Image not selected!');
            }

            const formData = new FormData();
            formData.append('image', docImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('experience', experience);
            formData.append('fees', Number(fees));
            formData.append('about', about);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-doctor',
                formData,
                { headers: { adminToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName('');
                setPassword('');
                setEmail('');
                setAddress1('');
                setAddress2('');
                setAbout('');
                setDegree('');
                setFees('');
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* ✅ Full-width container */}
            <div className="w-full px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Add Doctor</h1>
                    <p className="text-gray-600 mt-1">Add a new doctor to your healthcare system</p>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <form onSubmit={onSubmitHandler}>
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Doctor Information</h2>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-8">
                            {/* Profile Upload */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                                <div className="flex items-center gap-6">
                                    <label htmlFor="doc-img" className="cursor-pointer group">
                                        <div className="relative">
                                            <img
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                                                alt="Doctor"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                        </div>
                                    </label>
                                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
                                    <div>
                                        <p className="text-gray-900 font-medium">Upload Doctor Picture</p>
                                        <p className="text-gray-600 text-sm mt-1">Choose a professional photo for the doctor profile</p>
                                    </div>
                                </div>
                            </div>

                            {/* Grid Form Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Basic Info */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                                        <div className="space-y-4">
                                            <input
                                                onChange={(e) => setName(e.target.value)}
                                                value={name}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                                type="text"
                                                placeholder="Doctor Name"
                                                required
                                            />
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                                type="email"
                                                placeholder="Email"
                                                required
                                            />
                                            <input
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                                type="password"
                                                placeholder="Password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Professional Details */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
                                        <select
                                            onChange={(e) => setExperience(e.target.value)}
                                            value={experience}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={`${i + 1} Year`}>{i + 1} Year</option>
                                            ))}
                                            <option value="10 Year">10+ Year</option>
                                        </select>
                                        <input
                                            onChange={(e) => setFees(e.target.value)}
                                            value={fees}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                            type="number"
                                            placeholder="Consultation Fees"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Specialization */}
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialization</h3>
                                        <select
                                            onChange={(e) => setSpeciality(e.target.value)}
                                            value={speciality}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                        >
                                            <option>General Physician</option>
                                            <option>Gynecologist</option>
                                            <option>Dermatologist</option>
                                            <option>Pediatricians</option>
                                            <option>Neurologist</option>
                                            <option>Gastroenterologist</option>
                                        </select>
                                        <input
                                            onChange={(e) => setDegree(e.target.value)}
                                            value={degree}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                            type="text"
                                            placeholder="Degree (e.g. MBBS)"
                                            required
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                                        <input
                                            onChange={(e) => setAddress1(e.target.value)}
                                            value={address1}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                                            type="text"
                                            placeholder="Address Line 1"
                                            required
                                        />
                                        <input
                                            onChange={(e) => setAddress2(e.target.value)}
                                            value={address2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl mt-4"
                                            type="text"
                                            placeholder="Address Line 2"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Doctor</h3>
                                <textarea
                                    onChange={(e) => setAbout(e.target.value)}
                                    value={about}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
                                    rows={4}
                                    placeholder="Write about the doctor..."
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 shadow-lg transition-all duration-300"
                                >
                                    Add Doctor to System
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDoctor;