import React, { useState } from 'react';
import { PoleProps } from '../../_types';


export default function Accordion(props:any) {
    const { title, children } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <div className="accordion">
            <button className="accordion">Section 1</button>
            <div className="panel">
                <p>Lorem ipsum...</p>
            </div>Name
        </div>
    );
}