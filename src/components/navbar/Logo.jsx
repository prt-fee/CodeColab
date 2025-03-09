
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ isScrolled }) => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className={`text-2xl ${isScrolled ? 'text-primary' : 'text-primary'}`}>●</span>
      <span className={`text-xl font-semibold ${isScrolled ? 'text-foreground' : 'text-foreground'}`}>
        Projectify
      </span>
    </Link>
  );
};

export default Logo;
