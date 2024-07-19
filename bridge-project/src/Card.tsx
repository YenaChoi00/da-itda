import React, { useState } from 'react'
import { Info } from './model/info'

interface OwnProps {
    data: Info,
    changeContent(newContent: string[]): void;
    changeName(newName: string): void;
}

const Card: React.FC<OwnProps> = ({ data, changeContent, changeName }) => {
    // 더블클릭 - 수정
    const [editing, setEditing] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [newContent, setNewContent] = useState(data.content);
    const [newName, setNewName] = useState(data.name);

    // 내용 수정
    const contentDoubleClick = () => {
        setEditing(true);
    }

    const handleChange = (index: number, value: string) => {
        const updatedContent = [...newContent];
        if (value == '') {
            // 빈 값이면 아예 삭제
            updatedContent.splice(index, 1);
        } else {
            updatedContent[index] = value;
        }
        setNewContent(updatedContent);
    }

    const contentSave = () => {
        changeContent(newContent);
        setEditing(false);
    }

    // 이름 수정
    const nameDoubleClick = () => {
        setEditingName(true);
    }

    const handleNameChange = (value: string) => {
        setNewName(value);
    }

    const nameSave = () => {
        changeName(newName);
        setEditingName(false);
    }

    return (
        <div>
            {editingName ?
                <div>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => handleNameChange(e.target.value)}
                    />
                    <button onClick={nameSave}>저장하기</button>
                </div> :
                <h4 onDoubleClick={nameDoubleClick}>{data.name}</h4>}
            {
                editing ? (
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
                        <button onClick={contentSave}>저장하기</button>
                    </div>
                ) : (
                    // 편집 중 아닐 때
                    <ul onDoubleClick={contentDoubleClick}>
                        {data.content.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>)
            }
        </div >
    )
}

export default Card

