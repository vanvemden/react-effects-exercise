import React from "react";

function Card({ image, value, suit }) {

  return (
    <img src={image} alt={`${value} ${suit}`} />
  )
}

export default Card;