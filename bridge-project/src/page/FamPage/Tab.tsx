import React, { useState } from 'react';
import { FamPageTab } from '../../model/tab';

interface TabsProps {
  tabs: FamPageTab[];
}

const Tab: React.FC<TabsProps> = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col mb-3">
      <ul>
        {tabs.map((tab: FamPageTab, index: number) => (
          <li
            key={index}
            onClick={() => setActive(index)}
            className={`${active === index ? 'active inline mx-1' : 'inline mx-1'}rounded-t-lg`}
          >
            {tab.name}
          </li>
        ))}
      </ul>
      <div>
        {
          //tabs[active].content
        }
      </div>
    </div>
  );
};

export default Tab;
