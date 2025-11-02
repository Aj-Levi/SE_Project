//components/.DateSelector.jsx 

import React, { useState, useEffect } from 'react';
import "./DateSelector.css"

function AlertMessage({ message }) {
  if (!message) return null;
  return <div className="alert">{message}</div>;
}

export function DateSelector({ onDateChange }) {
  const today = new Date();
  const MIN_YEAR = 1900;
  const MAX_YEAR = today.getFullYear();

  const [year, setYear] = useState(MAX_YEAR);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [alert, setAlert] = useState(null);


  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const reportDateChange = (d, m, y) => {
    const daysInMonth = new Date(y, m, 0).getDate();
    const validDay = Math.min(d, daysInMonth);
    const newDate = new Date(y, m - 1, validDay);
    if (!isNaN(newDate) && onDateChange) {
      onDateChange(newDate);
    }

    if (d !== validDay) {
      setDay(validDay);
    }
  };



  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleDayChange = (e) => setDay(e.target.value);

  const handleYearBlur = (e) => {
    let newYear = parseInt(e.target.value, 10);
    if (isNaN(newYear) || newYear < MIN_YEAR) {
      newYear = MIN_YEAR;
      setAlert(`Year must be after ${MIN_YEAR}. Setting to ${MIN_YEAR}.`);
    } else if (newYear > MAX_YEAR) {
      newYear = MAX_YEAR;
      setAlert(`Year cannot be in the future. Setting to ${MAX_YEAR}.`);
    }
    setYear(newYear);
    reportDateChange(day, month, newYear); 
  };

  const handleMonthBlur = (e) => {
    let newMonth = parseInt(e.target.value, 10);
    if (isNaN(newMonth) || newMonth < 1) newMonth = 1;
    else if (newMonth > 12) newMonth = 12;
    setMonth(newMonth);
    reportDateChange(day, newMonth, year); 
  };

  const handleDayBlur = (e) => {
    let newDay = parseInt(e.target.value, 10);
    const daysInMonth = new Date(year, month, 0).getDate();
    if (isNaN(newDay) || newDay < 1) newDay = 1;
    else if (newDay > daysInMonth) newDay = daysInMonth;
    setDay(newDay);
    reportDateChange(newDay, month, year); 
  };

  return (
    <>
      <div className="container">
        <div className="inputGroup">
          <div className="inputContainer">
            <label className="label">Day</label>
            <input type="number" value={day} onChange={handleDayChange} onBlur={handleDayBlur} className="input" />
          </div>
          <div className="inputContainer">
            <label className="label">Month</label>
            <input type="number" value={month} onChange={handleMonthChange} onBlur={handleMonthBlur} className="input" />
          </div>
          <div className="inputContainer">
            <label className="label">Year</label>
            <input type="number" value={year} onChange={handleYearChange} onBlur={handleYearBlur} className="input" />
          </div>
        </div>
      </div>
      <AlertMessage message={alert} />
    </>
  );
}



