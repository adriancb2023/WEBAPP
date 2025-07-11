import React from 'react';
import { useResponsive } from '../../hooks/useResponsive';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: {
    icon: string;
    onClick: () => void;
    label: string;
  };
  rightActions?: Array<{
    icon: string;
    onClick: () => void;
    label: string;
    badge?: number;
  }>;
  sticky?: boolean;
}

export default function Header({ 
  title, 
  subtitle, 
  leftAction, 
  rightActions = [], 
  sticky = true 
}: HeaderProps) {
  const { isMobile } = useResponsive();

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: isMobile ? 'var(--spacing-md)' : 'var(--spacing-lg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          {leftAction && (
            <button
              onClick={leftAction.onClick}
              aria-label={leftAction.label}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius)',
                transition: 'background 0.2s ease',
              }}
            >
              {leftAction.icon}
            </button>
          )}
          
          <div>
            <h1
              style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  margin: '2px 0 0 0',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        {rightActions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {rightActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                aria-label={action.label}
                style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius)',
                  padding: isMobile ? 'var(--spacing-sm)' : 'var(--spacing-md)',
                  fontSize: isMobile ? '16px' : '18px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {action.icon}
                {action.badge && action.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
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
                    {action.badge > 99 ? '99+' : action.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}