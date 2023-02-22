import React from 'react';
import PropTypes from 'prop-types';

import { Button as AriakitButton } from "ariakit/button";
import "./Button.scss";

const Button = React.forwardRef(
  ({ children, type, onClick, style }, forwadedRef) => {
    return (
      <AriakitButton
        className="button" 
        ref={forwadedRef}
        type={type}
        onClick={onClick}
        style={style}
      >
        {children}
      </AriakitButton>
    );
  }
);
Button.defaultProps = {
  onClick: null,
  type: 'button',
  style: null,
}
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  style: PropTypes.shape({}),
}

export default Button;
