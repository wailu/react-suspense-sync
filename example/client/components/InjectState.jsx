import React from "react";
import PropTypes from "prop-types";

const InjectState = ({ name, state }) => {
  const __html = `window['${name}'] = ${JSON.stringify(state)};`;
  return <script dangerouslySetInnerHTML={{ __html }} />;
};

InjectState.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.any,
};

export default InjectState;
