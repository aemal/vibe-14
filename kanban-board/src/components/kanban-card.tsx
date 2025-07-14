'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types/kanban';

interface KanbanCardProps {
  card: Card;
  index: number;
}

export function KanbanCard({ card, index }: KanbanCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white p-4 rounded-lg shadow-md border border-gray-200 cursor-grab
            hover:shadow-lg active:shadow-inner transition-all duration-200
            ${snapshot.isDragging ? 'rotate-3 shadow-xl opacity-90' : ''}
            ${snapshot.isDragging ? 'transform scale-105' : ''}
            group relative
          `}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Card Title */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-5">
            {card.title}
          </h3>
          
          {/* Card Description */}
          {card.description && (
            <p className="text-sm text-gray-600 line-clamp-3 leading-4">
              {card.description}
            </p>
          )}
          
          {/* Card Metadata */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>#{card.id}</span>
            {card.createdAt && (
              <span>
                {new Date(card.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Tooltip for full description */}
          {showTooltip && card.description && card.description.length > 100 && (
            <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs">
              <div className="font-medium mb-1">{card.title}</div>
              <div className="text-gray-200">{card.description}</div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}

          {/* Drag indicator */}
          {snapshot.isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-lg border-2 border-blue-300 border-dashed"></div>
          )}
        </div>
      )}
    </Draggable>
  );
} 