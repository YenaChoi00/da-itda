import React, { useState } from 'react'
import { Info } from './model/info'

interface OwnProps {
    data: Info,
    changeContent(newContent: string[]): void;
}

const Card: React.FC<OwnProps> = ({ data, changeContent }) => {
    // 더블클릭 - 수정
    const [editing, setEditing] = useState(false);
    const [newContent, setNewContent] = useState(data.content);

    const handleDoubleClick = () => {
        setEditing(true);
    }

    const changeSave = () => {
        changeContent(newContent);
        setEditing(false);
    }

    const handleChange = (index: number, value: string) => {
        const updatedContent = [...newContent];
        updatedContent[index] = value;
        setNewContent(updatedContent);
    }

    return (
        <div onDoubleClick={handleDoubleClick}>
            <h4>{data.name}</h4>
            {editing ? (
                <div>
                    <ul>
                        {newContent.map((item, index) => (
                            <li key={index}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                            </li>
                        ))}
                    </ul>
                    <button onClick={changeSave}>저장하기</button>
                </div>
            ) : (<ul>
                {data.content.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>)}
        </div>
    )
}

export default Card

