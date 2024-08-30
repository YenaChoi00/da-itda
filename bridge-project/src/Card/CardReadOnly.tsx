import React, { useState, useEffect } from 'react';
import { Info } from '../model/info';
import { HiOutlineTrash } from 'react-icons/hi';

interface OwnProps {
  data: Info;
}

const CardReadOnly: React.FC<OwnProps> = ({ data }) => {
  return (
    <div className="container flex justify-start">
      <div className="flex flex-col w-full">
        <div className="flex justify-between mb-1">
          <h4 className="self-center text-base font-semibold">{data.name}</h4>
          <button className="bg-transparent">
            <HiOutlineTrash />
          </button>
        </div>
        <ol className="pl-5 list-decimal">
          {data.content.map((item, index) => (
            <li key={index} className="text-left whitespace-pre-line">
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default CardReadOnly;
