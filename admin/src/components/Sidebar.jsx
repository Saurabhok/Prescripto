import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';

const Sidebar = () => {
    const { adminToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const commonLinkClass = ({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-4 lg:px-6 w-full text-sm font-medium transition-all duration-200 rounded-xl
        ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-gray-100 text-gray-600'}
        `;

    const navItemsAdmin = [
        { to: '/admin-dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { to: '/all-appointments', icon: assets.appointment_icon, label: 'Appointments' },
        { to: '/add-doctor', icon: assets.add_icon, label: 'Add Doctor' },
        { to: '/doctor-list', icon: assets.people_icon, label: 'Doctors List' },
    ];

    const navItemsDoctor = [
        { to: '/doctor-dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { to: '/doctor-appointments', icon: assets.appointment_icon, label: 'Appointments' },
        { to: '/doctor-profile', icon: assets.people_icon, label: 'Profile' },
    ];

    return (
        <aside className={`bg-white border-r shadow-sm min-h-screen flex flex-col ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            {/* Toggle button for small screens */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 lg:hidden">
                <button onClick={toggleSidebar} className="text-gray-600 focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <p className="font-semibold text-gray-800">{isOpen ? 'Menu' : ''}</p>
            </div>

            {/* Links */}
            <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
                {(adminToken ? navItemsAdmin : dToken ? navItemsDoctor : []).map((item) => (
                    <NavLink key={item.to} to={item.to} className={commonLinkClass}>
                        <img src={item.icon} alt={item.label} className="w-5 h-5" />
                        {isOpen && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;