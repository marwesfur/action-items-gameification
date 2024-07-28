import React from 'react';
import './PostItList.css';

const PostItList<TItem> = (props: {} ) => {

    return (
        <ul className="post-it-list">
            {items.map((item, index) => (
                <li key={index} className="post-it-item">
                    <div className="post-it-header">{item.header}</div>
                    <div className="post-it-description">{item.description}</div>
                </li>
            ))}
        </ul>
    );
};

export default PostItList;
