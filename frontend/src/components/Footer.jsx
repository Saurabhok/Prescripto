import React from 'react'
import { assets } from "../assets/assets_frontend/assets"

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* Left Section */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Simplifying healthcare with instant doctor bookings. Find the right specialist, book appointments effortlessly, and prioritize your health. Trust Perscripto for a seamless medical care experience. Stay healthy, stay connected.
                    </p>
                </div>

                {/* Middle Section */}
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* Right Section */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 12345-67890</li>
                        <li>thesaurabhsingh0k@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* Copyright Text */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center' >Copyright 2025@ Prescripto - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer