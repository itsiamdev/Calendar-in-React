import { useState, useEffect } from 'react';

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add previous month's days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        day: prevMonthDays - i
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        day: i,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }

    // Add next month's days to fill the grid
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        day: i
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.date);
      setShowPopup(true);
    }
  };

  const handleAddEvent = () => {
    if (selectedDate && eventTitle.trim()) {
      const dateKey = selectedDate.toDateString();
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        date: selectedDate
      };

      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newEvent]
      }));

      setEventTitle('');
      setEventDescription('');
      setShowPopup(false);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setEventTitle('');
    setEventDescription('');
  };

  const handleDeleteEvent = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toDateString();
      setEvents(prev => {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      });
      setShowPopup(false);
    }
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="wrapper">
      <header className="header">
        <h2>Calendar</h2>
        <p>Let's plan your day</p>
      </header>
      <div className="calendar">
        <div className="current-date">
          <div className="month">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
          <div className="icons">
            <span className="bx bx-chevron-left" onClick={handlePrevMonth}></span>
            <span className="bx bx-chevron-right" onClick={handleNextMonth}></span>
          </div>
        </div>
        <ul className="weeks">
          {daysOfWeek.map(day => (
            <li key={day}>{day}</li>
          ))}
        </ul>
        <ul className="days">
          {days.map((day, index) => {
            const dateKey = day.date.toDateString();
            const hasEvent = events[dateKey] && events[dateKey].length > 0;
            return (
              <li
                key={index}
                className={`${!day.isCurrentMonth ? 'inactive' : ''} ${day.isToday ? 'today' : ''} ${hasEvent ? 'event' : ''}`}
                onClick={() => handleDayClick(day)}
              >
                {day.day}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={`event-popup ${showPopup ? 'active' : ''}`}>
        <h2>Add Event</h2>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <textarea
          placeholder="Event Description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        ></textarea>
        <button onClick={handleAddEvent}>Add Event</button>
        <button onClick={handleCancel}>Cancel</button>
        {selectedDate && events[selectedDate.toDateString()] && events[selectedDate.toDateString()].length > 0 && (
          <button onClick={handleDeleteEvent} className="delete-btn">Delete Event</button>
        )}
      </div>
      <div className={`overlay ${showPopup ? 'active' : ''}`} onClick={handleCancel}></div>
    </div>
  );
};

export default CalendarApp;
