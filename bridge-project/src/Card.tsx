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
        changeContent(newContent);  // 저장하기를 누르면, 지금까지의 내용으로 App 업뎃
        setEditing(false);
    }

    const handleChange = (index: number, value: string) => {
        // 각 항목의 수정 사항 업데이트
        const updatedContent = [...newContent];
        updatedContent[index] = value;
        setNewContent(updatedContent);
    }

    return (
        <div onDoubleClick={handleDoubleClick}>
            <h4>{data.name}</h4>
            {editing ? (
                // 편집 중일 때
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
            ) : (
                // 편집 중 아닐 때
                <ul>
                    {data.content.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>)}
        </div>
    )
}

export default Card

