
import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ isScrolled }) => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link 
        to="/" 
        className={`font-medium hover:text-primary transition-colors
          ${isScrolled ? 'text-foreground' : 'text-foreground'}`}
      >
        Home
      </Link>
      <Link 
        to="/features" 
        className={`font-medium hover:text-primary transition-colors
          ${isScrolled ? 'text-foreground' : 'text-foreground'}`}
      >
        Features
      </Link>
      <Link 
        to="/pricing" 
        className={`font-medium hover:text-primary transition-colors
          ${isScrolled ? 'text-foreground' : 'text-foreground'}`}
      >
        Pricing
      </Link>
      <Link 
        to="/contact" 
        className={`font-medium hover:text-primary transition-colors
          ${isScrolled ? 'text-foreground' : 'text-foreground'}`}
      >
        Contact
      </Link>
    </nav>
  );
};

export default NavLinks;
