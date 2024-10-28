import React from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import './calender.css';

interface CalenderProp {
  selectedDate: Date | null | undefined;
  onChange: (date: Date | null) => void;
}
const CustomCalender: React.FC<CalenderProp> = ({ selectedDate, onChange }) => {
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return (
    <DatePicker
      locale={ko}
      dateFormat="yyyy-MM-dd"
      minDate={new Date('1970-01-01')}
      maxDate={new Date()}
      selected={selectedDate}
      onChange={onChange}
      className="input-box"
      placeholderText="생년월일"
      shouldCloseOnSelect
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={70}
      showMonthDropdown
      renderCustomHeader={({ date, changeYear, changeMonth }) => (
        <div className="calender-div">
          <select
            className="select"
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(parseInt(value))}
          >
            {Array.from({ length: 50 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <select
            className="select"
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
};

export default CustomCalender;
