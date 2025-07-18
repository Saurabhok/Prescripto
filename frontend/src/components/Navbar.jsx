import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)

    const { token, setToken, userData } = useContext(AppContext)

    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }

    const [showProfileMenu, setShowProfileMenu] = useState(false)

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 relative'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/'>
                    <li className='py-1'>HOME</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/doctors'>
                    <li className='py-1'>ALL DOCTORS</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/about'>
                    <li className='py-1'>ABOUT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to='/contact'>
                    <li className='py-1'>CONTACT</li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token && userData
                        ? (
                            <div className='flex items-center gap-2 cursor-pointer relative'>
                                <div
                                    className='flex items-center gap-2'
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <img className='w-8 rounded-full' src={userData.image} />
                                    <img className='w-2.5' src={assets.dropdown_icon} />
                                </div>
                                {showProfileMenu && (
                                    <div className='absolute top-full right-0 mt-2 text-base font-medium text-gray-600 z-30'>
                                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                                            <p onClick={() => { navigate('/my-profile'); setShowProfileMenu(false); }} className='hover:text-black cursor-pointer'>My Profile</p>
                                            <p onClick={() => { navigate('/my-appointments'); setShowProfileMenu(false); }} className='hover:text-black cursor-pointer'>My Appointments</p>
                                            <p onClick={() => { logout(), setShowProfileMenu(false); }} className='hover:text-black cursor-pointer'>Logout</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer'>Create Account</button>
                        )
                }
                <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} />
            </div>

            {/* Mobile Menu */}
            <div className={`${showMenu ? 'fixed inset-0' : 'hidden'} md:hidden bg-white z-20 overflow-hidden`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} />
                    <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                </ul>

                {!token && (
                    <div className='mt-8 flex justify-center'>
                        <button
                            onClick={() => { navigate('/login'); setShowMenu(false); }}
                            className='bg-primary text-white px-8 py-3 rounded-full font-light'
                        >
                            Create Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar