import React, { useState } from 'react';
import { TabModel } from './model/tabModel';

interface TabsProps {
  tabs: TabModel[];
}

const Tab: React.FC<TabsProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col mb-3">
      <ul>
        {tabs.map((tab: TabModel, index: number) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={active === index ? 'active inline mx-1' : 'inline mx-1'}
          >
            {tab.title}
          </li>
        ))}
      </ul>
      <div>{tabs[active].content}</div>
    </div>
  );
};

export default Tab;
