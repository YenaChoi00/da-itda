import React, { useState } from 'react'
import { Info } from './model/info'

interface OwnProps {
    data: Info,
}

const Card: React.FC<OwnProps> = ({ data }) => {

    const contentList = data.content.map((d, i) => (<li key={i}>{d}</li>))

    return (
        <div>
            <h4>{data.name}</h4>
            <ul>
                {contentList}
            </ul>
        </div>
    )
}

export default Card

