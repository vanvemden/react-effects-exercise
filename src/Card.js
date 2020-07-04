import React from "react";

function Card({ image, value, suit, angle }) {

  return (
    <img className="Card" src={image} alt={`${value} of ${suit}`} style={{ transform: 'rotate(' + angle + 'deg)' }} />
  )
}

export default Card;
