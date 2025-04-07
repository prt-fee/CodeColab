
import React, { useRef, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

interface AnimatedTransitionProps {
  children: React.ReactNode;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children }) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        nodeRef={nodeRef}
        timeout={300}
        classNames="page-transition"
        unmountOnExit
      >
        <div ref={nodeRef} className="page-content">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AnimatedTransition;
