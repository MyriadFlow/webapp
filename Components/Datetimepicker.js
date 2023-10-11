import React, { useState } from 'react';

function DateTimePicker({
  months,
  days,
  hours,
  onMonthsChange,
  onDaysChange,
  onHoursChange,
}) {
  
    return (
      <div className="text-black dark:text-white">
        <label>
          Months:
          <select value={months} onChange={onMonthsChange} className="dark:bg-gray-500 bg-gray-200">
            {Array.from({ length: 7 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Days:
          <select value={days} onChange={onDaysChange} className="dark:bg-gray-500 bg-gray-200">
            {Array.from({ length: 32 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
        <label>
          Hours:
          <select value={hours} onChange={onHoursChange} className="dark:bg-gray-500 bg-gray-200">
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
  