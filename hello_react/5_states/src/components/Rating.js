import React from 'react';

import {FaStar} from "react-icons/fa";

const Star = ({selected = false, onSelect = (f) => f}) =>
    (<FaStar color={selected?"red":"grey"} onClick={onSelect}/>);

const createArray = (len) => [...new Array(len)];

export default function Rating({totalStars=5, rating=0}){
	return (
		<div>
  		{createArray(totalStars).map((n, i) =>
        <Star key={i} selected={rating > i}/>)}
      <p>{rating} of {totalStars} stars</p>
    </div>
	);
}
