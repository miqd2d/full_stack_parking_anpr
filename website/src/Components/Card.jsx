import React from 'react';
import './Card_style.css';

function Card({ title, information, balanceColor }) {
  return (
    <div className='box_main'>
      <div className="heading_card">{title}</div>
      <div className="card_info" style={{ backgroundColor: balanceColor }}>
        {information}
      </div>
    </div>
  );
}

export default Card;
