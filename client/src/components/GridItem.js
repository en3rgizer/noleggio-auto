import React from 'react';

const GridItem = (props) => {

  let {car} = props;
  let img = './img/' + car.carID + '.jpg'

  return (
    
    <div className="FilterGrid-cell">
      <div tabIndex="0" className="u-p2 u-md-px3 u-md-pb3">
        <div className="u-gray u-h5 u-tr u-lhh"><span>Categoria {car.category}</span></div>
        <div className="u-muted">{car.brand}</div>
        <div className="u-h3 u-truncate">{car.model}</div>
        <div className="FlexEmbed"> 
        <img alt="" src={img} className="FlexEmbed-content"></img></div>
      </div>
    </div>
  );
}

export default GridItem;
