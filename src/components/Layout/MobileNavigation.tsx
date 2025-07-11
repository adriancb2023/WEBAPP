import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  badge?: number;
}

interface MobileNavigationProps {
  items: NavigationItem[];
  activeItem?: string;
}

export default function MobileNavigation({ items, activeItem }: MobileNavigationProps) {
  const { isMobile } = useResponsive();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY, isMobile]);

  if (!isMobile) return null;

  return (
    <nav
      className={`mobile-nav ${isVisible ? 'mobile-nav--visible' : 'mobile-nav--hidden'}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className={`mobile-nav-item ${activeItem === item.id ? 'mobile-nav-item--active' : ''}`}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius)',
            color: activeItem === item.id ? 'var(--primary-color)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            position: 'relative',
            minWidth: '60px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
          {item.badge && item.badge > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '8px',
                background: 'var(--error-color)',
                color: 'white',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 'bold',
                padding: '2px 6px',
                minWidth: '16px',
                textAlign: 'center',
              }}
            >
              {item.badge > 99 ? '99+' : item.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}