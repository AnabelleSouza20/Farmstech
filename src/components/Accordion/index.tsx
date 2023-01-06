import React, { useState } from 'react';
import './styles.scss';

export default function AccordionNovo() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="accordion">
      <div className="accordion__top" onClick={handleToggle}>
        <div className="accordion__left">
          <div className="accordion__title-container">
            <div className="accordion__title"> 
            {isExpanded ? '-    ' : '+   '}
            Product Name</div>
            <div className="accordion__subtitle">Subtitle</div>
          </div>
        </div>
        <div className="accordion__middle">Group</div>
        <div className="accordion__middle">Status</div>
        <div className="accordion__right">x</div>
      </div>
      <div className={`accordion__bottom ${isExpanded ? 'expanded' : 'notexpanded'}`}>
        <div className="accordion__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
        </div>
      </div>
    </div>
  );
};
