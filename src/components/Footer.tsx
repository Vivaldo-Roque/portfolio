import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      {/* Social media buttons */}
      <div className="row">
        <a
          className="fa-brands fa-x-twitter social-button-circ"
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/vivaldo_roque"
        ></a>
        <a
          className="fa-brands fa-github social-button-circ"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Vivaldo-Roque/"
        ></a>
        <a
          className="fa-brands fa-linkedin social-button-circ"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/vivaldo-roque-953837179/"
        ></a>
      </div>
    </footer>
  );
};
