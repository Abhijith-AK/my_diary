import React, { createContext, useEffect, useState } from 'react';
import { BsCalendar3 } from 'react-icons/bs';
import { CiLogout } from 'react-icons/ci';
import { FaBars, FaPenNib, FaUser } from 'react-icons/fa';
import { GiWhiteBook } from 'react-icons/gi';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export const DateContext = createContext(null);

const Sidebar = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const user = JSON.parse(sessionStorage.getItem('user'));
    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleLogout = () => setOpenLogoutModal(true);
    const handleConfirmLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/auth');
    };
    const handleCancelLogout = () => setOpenLogoutModal(false);

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            <div className='flex flex-col md:flex-row h-screen w-full'>
                {/* Navbar for smaller screens */}
                <div className="md:hidden bg-gray-800 text-white p-4 flex justify-around items-center">
                    <h1 className="text-2xl font-bold italic flex gap-1"><GiWhiteBook /> My Diary</h1>
                    <button onClick={() => setIsNavbarOpen(!isNavbarOpen)} className='text-xl text-white'><FaBars size={30} /></button>
                </div>
                {isNavbarOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col text-white p-6 space-y-6">
                        <button onClick={() => setIsNavbarOpen(false)} className="self-end text-3xl me-5">&times;</button>
                        <NavLink onClick={() => setIsNavbarOpen(false)} to="/calendar" className="hover:bg-gray-700 px-4 py-2 rounded-md flex gap-2">
                            <BsCalendar3 size={24} /> Calendar
                        </NavLink>
                        <NavLink onClick={() => setIsNavbarOpen(false)} to={`/notepad/${selectedDate.toLocaleDateString('en-CA')}`} className="hover:bg-gray-700 px-4 py-2 rounded-md flex gap-2">
                            <FaPenNib size={24} /> Notepad
                        </NavLink>
                        <div className="flex items-center gap-2">
                            <FaUser /> {user?.name}
                        </div>
                        <div className="hover:bg-red-400 px-4 py-2 rounded-md flex gap-2 cursor-pointer" onClick={handleLogout}>
                            <CiLogout /> LogOut
                        </div>
                    </div>
                )}
    
                {/* Sidebar for larger screens */}
                <div className="hidden md:flex bg-gray-800 text-white w-64 p-6 flex-col justify-between">
                    <div className='space-y-6'>
                        <h1 className="text-3xl font-bold italic flex gap-1"><GiWhiteBook /> My Diary</h1>
                        <nav className="flex flex-col text-2xl pt-8 space-y-8">
                            <NavLink to="/calendar" className="hover:bg-gray-700 px-4 py-2 rounded-md flex gap-2">
                                <BsCalendar3 size={24} /> Calendar
                            </NavLink>
                            <NavLink to={`/notepad/${selectedDate.toLocaleDateString('en-CA')}`} className="hover:bg-gray-700 px-4 py-2 rounded-md flex gap-2">
                                <FaPenNib size={24} /> Notepad
                            </NavLink>
                        </nav>
                    </div>
                    <div className='flex flex-col space-y-8'>
                        <div className="text-2xl px-4 py-2 flex items-center gap-2">
                            <FaUser /> {user?.name}
                        </div>
                        <div className="text-3xl hover:bg-red-400 px-4 py-2 rounded-md flex gap-2 cursor-pointer" onClick={handleLogout}>
                            <CiLogout /> LogOut
                        </div>
                    </div>
                </div>
    
                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <Dialog open={openLogoutModal} onClose={handleCancelLogout}>
                <DialogTitle>Logout</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to logout?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="success" variant="contained">Cancel</Button>
                    <Button onClick={handleConfirmLogout} color="error" variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>
        </DateContext.Provider>
    );
};

export default Sidebar;
