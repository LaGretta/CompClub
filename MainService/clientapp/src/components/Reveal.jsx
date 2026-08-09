import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, delay = 0, direction = 'up' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (direction === 'up') return 'translateY(30px)';
    if (direction === 'down') return 'translateY(-30px)';
    if (direction === 'left') return 'translateX(-30px)';
    if (direction === 'right') return 'translateX(30px)';
    return 'translate(0)';
  };

  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate(0)' : getTransform(),
      transition: `all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms`
    }}>
      {children}
    </div>
  );
}