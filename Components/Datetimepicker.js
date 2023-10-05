import React, { useState } from 'react';

function DateTimePicker() {
    const [months, setMonths] = useState(0);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
  
    // Functions to update the state when values change
    const handleMonthsChange = (e) => setMonths(parseInt(e.target.value, 10));
    const handleDaysChange = (e) => setDays(parseInt(e.target.value, 10));
    const handleHoursChange = (e) => setHours(parseInt(e.target.value, 10));
  
    return (
      <div>
        <label>
          Months:
          <select value={months} onChange={handleMonthsChange}>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Days:
          <select value={days} onChange={handleDaysChange}>
            {Array.from({ length: 32 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Hours:
          <select value={hours} onChange={handleHoursChange}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }
  
  export default DateTimePicker;
  