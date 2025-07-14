'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/types/kanban';

interface KanbanCardProps {
  card: Card;
}

export function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'opacity-50 shadow-lg' : ''}
      `}
    >
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {card.title}
      </h3>
      
      {card.description && (
        <p className="text-sm text-gray-600 line-clamp-3">
          {card.description}
        </p>
      )}
      
      {/* Card metadata */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>#{card.id}</span>
        {card.createdAt && (
          <span>
            {new Date(card.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
} 