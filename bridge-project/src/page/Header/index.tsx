import React, { useContext } from 'react';
import { HiChevronLeft } from 'react-icons/hi';
import { HiChevronRight } from 'react-icons/hi';
import moment from 'moment';
import { CategoryContext } from '../../main';

interface HeaderProps {
  curDate: string;
  changeDate(newDate: string): void;
}

const Header: React.FC<HeaderProps> = ({ changeDate, curDate }) => {
  const info = useContext(CategoryContext);
  const moveDate = (date: number, direction: 'forward' | 'backward') => {
    const momentDate = moment(curDate, 'YYYY-MM-DD');
    let newDate = momentDate;

    if (direction == 'forward') newDate = newDate.add(date, 'days');
    else if (direction == 'backward') newDate = newDate.subtract(date, 'days');
    else return; // 오류 처리

    changeDate(newDate.format('YYYY-MM-DD'));
  };

  return (
    <>
      <h2 className="text-2xl font-semibold">{info.fname}</h2>
      <div className="flex content-center justify-between my-2">
        <button
          className="bg-transparent hover:border-primary"
          onClick={() => moveDate(7, 'backward')}
        >
          <HiChevronLeft />
        </button>
        <span className="self-center">{curDate}</span>
        <button
          className="bg-transparent hover:border-primary"
          onClick={() => moveDate(7, 'forward')}
        >
          <HiChevronRight />
        </button>
      </div>
    </>
  );
};

export default Header;
