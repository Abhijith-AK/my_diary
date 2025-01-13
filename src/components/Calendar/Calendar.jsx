import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateContext } from '../Sidebar';
import { getEntryAPI } from '../../services/allAPI';
import { FaBook } from 'react-icons/fa';
import { GiBookmarklet } from 'react-icons/gi';
import { SnackbarContext } from '../../App';

const Calendar = ({ dob }) => {
    const navigate = useNavigate();
    const { selectedDate, setSelectedDate } = useContext(DateContext);
    const [diaryDates, setDiaryDates] = useState([])
    const { setSnackBarProps } = useContext(SnackbarContext);

    const dobDate = new Date(dob);
    const today = new Date();
    const user = JSON.parse(sessionStorage.getItem("user"))

    const getDates = async () => {
        console.log(user)
        const response = await getEntryAPI();
        if (response.data) {
            const dates = []
            response.data.map(e => {if(e.userId == user.id) dates.push(e.date) })
            console.log(dates)
            setDiaryDates(dates)
        }
    }

    useEffect(() => {
        if (!selectedDate) {
            setSelectedDate(new Date()); // Default to today's date if selectedDate is undefined
        }
        getDates()
    }, [selectedDate, setSelectedDate]);

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handleDateClick = (date) => {
        const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date);
        selected.setHours(0, 0, 0, 0); // Normalize the date to avoid time issues

        // Manually format the date as YYYY-MM-DD
        const formattedDate = selected.toLocaleDateString('en-CA'); // 'en-CA' format is YYYY-MM-DD

        if (selected > today || selected < dobDate) {
            alert('You can only select dates between your DOB and today.');
            return;
        }

        setSelectedDate(selected);
        navigate(`/notepad/${formattedDate}`);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
        const firstDayOfMonth = getFirstDayOfMonth(selectedDate.getFullYear(), selectedDate.getMonth());
        const daysArray = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) =>
            i < firstDayOfMonth ? null : i - firstDayOfMonth + 1
        );
        return daysArray;
    };

    const handlePrevMonth = () => {
        const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1);
        if (prevMonth < dobDate) {
            alert('You cannot go before your date of birth.');
            return;
        }
        setSelectedDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
        if (nextMonth > today) {
            setSnackBarProps({
                snackBarVarient: 'warning',
                snackBarMessage: 'You cannot select future dates.',
                openSnackBar: true,
            });
            return;
        }
        setSelectedDate(nextMonth);
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="calendar w-full md:max-w-5xl md:mx-auto bg-white shadow-lg p-2 md:p-8 rounded-lg">
            {/* Calendar Header */}
            <div className="calendar-header flex justify-between items-center mb-6">
                <button
                    onClick={handlePrevMonth}
                    className="text-2xl font-bold text-gray-700 hover:text-blue-500"
                >
                    {'<'}
                </button>
                <h2 className="text-xl md:text-3xl font-semibold text-gray-800">
                    {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
                </h2>
                <button
                    onClick={handleNextMonth}
                    className="text-2xl font-bold text-gray-700 hover:text-blue-500"
                >
                    {'>'}
                </button>
            </div>

            {/* Days of the Week */}
            <div className="grid grid-cols-7 md:gap-4 text-center font-semibold text-gray-700 mb-4">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="uppercase">{day}</div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 md:gap-4 text-center">
                {renderCalendar().map((date, index) => {
                    const isPast = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date) < dobDate;
                    const isFuture = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date) > today;
                    const isSelected = date && new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date).toLocaleDateString('en-CA') === selectedDate.toLocaleDateString('en-CA');
                    const hasEntry = diaryDates?.includes(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), date).toLocaleDateString('en-CA'));
                    return (
                        <div
                            key={index}
                            className={`p-5 md:px-4 md:py-8 relative border rounded-lg text-lg font-medium cursor-pointer 
                            ${isSelected ? 'bg-[#1b2937] text-white' : 'bg-gray-100'}
                            ${ isPast || isFuture ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#1b293785]'}
                            ${!date ? 'opacity-0 cursor-not-allowed' : 'hover:bg-[#1b293785]'}
                            `}
                            onClick={() => date && !isPast && !isFuture && handleDateClick(date)}
                        >
                            {date}
                            {
                                hasEntry && (<GiBookmarklet className={`absolute bottom-2 left-2 text-[20px] md:text-[40px]  p-1 rounded-full ${isSelected ? 'text-white' : 'text-[#1b2937]'}`}  >  </GiBookmarklet>)
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
