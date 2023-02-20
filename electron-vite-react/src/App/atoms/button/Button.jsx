import React from 'react';
import PropTypes from 'prop-types';

import { Button as AriakitButton } from "ariakit/button";
import "./Button.scss";

const Button = React.forwardRef(
  ({ children, type, onClick }, forwadedRef) => {
    return (
      <AriakitButton
        className="button" 
        ref={forwadedRef}
        type={type}
        onClick={onClick}
      >
        {children}
      </AriakitButton>
    );
  }
);
Button.defaultProps = {
  onClick: null,
  type: 'button',
}
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
}

export default Button;
