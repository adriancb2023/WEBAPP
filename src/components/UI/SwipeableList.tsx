import React, { useState, useRef, useEffect } from 'react';

interface SwipeAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface SwipeableListItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right', actionId?: string) => void;
}

export function SwipeableListItem({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
}: SwipeableListItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    
    // Limitar el desplazamiento
    const maxSwipe = 120;
    const limitedDiffX = Math.max(-maxSwipe, Math.min(maxSwipe, diffX));
    
    setTranslateX(limitedDiffX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const threshold = 60;
    
    if (Math.abs(translateX) > threshold) {
      const direction = translateX > 0 ? 'right' : 'left';
      const actions = direction === 'right' ? leftActions : rightActions;
      
      if (actions.length > 0) {
        onSwipe?.(direction, actions[0].id);
        actions[0].onClick();
      }
    }
    
    // Resetear posición
    setTranslateX(0);
  };

  return (
    <div
      ref={itemRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--border-radius)',
      }}
    >
      {/* Acciones izquierdas */}
      {leftActions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: leftActions[0].color,
            color: 'white',
            fontSize: '20px',
            transform: `translateX(${Math.min(0, translateX - 120)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
        >
          {leftActions[0].icon}
        </div>
      )}

      {/* Acciones derechas */}
      {rightActions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: rightActions[0].color,
            color: 'white',
            fontSize: '20px',
            transform: `translateX(${Math.max(0, translateX + 120)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
        >
          {rightActions[0].icon}
        </div>
      )}

      {/* Contenido principal */}
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          background: 'var(--bg-primary)',
          position: 'relative',
          zIndex: 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

interface SwipeableListProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function SwipeableList({ children, className = '', style = {} }: SwipeableListProps) {
  return (
    <div
      className={`swipeable-list ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}