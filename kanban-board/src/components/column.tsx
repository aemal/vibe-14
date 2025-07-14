'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, COLUMN_CONFIG, ColumnId } from '@/types/kanban';
import { KanbanCard } from './kanban-card';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const config = COLUMN_CONFIG[column.id as ColumnId];

  return (
    <div className="flex flex-col h-full md:h-auto">
      {/* Column Header */}
      <div className={`p-3 sm:p-4 rounded-t-lg border-2 shadow-sm ${config.color} ${config.bgColor}`}>
        <h2 className={`font-semibold text-base sm:text-lg ${config.color.split(' ')[1]}`}>
          {column.title}
        </h2>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">
          {column.cards.length} card{column.cards.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Column Body */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-3 sm:p-4 space-y-3 min-h-[250px] md:min-h-[300px] 
              rounded-b-lg border-2 border-t-0 transition-all duration-200
              ${config.color} ${config.bgColor} bg-opacity-60
              ${snapshot.isDraggingOver ? 'bg-opacity-80 shadow-inner' : ''}
              ${snapshot.isDraggingOver ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
            `}
          >
            {column.cards.map((card, index) => (
              <KanbanCard key={card.id} card={card} index={index} />
            ))}
            
            {provided.placeholder}

            {/* Add Card Button */}
            <button
              className="w-full p-2 sm:p-3 border-2 border-dashed border-gray-300 rounded-lg text-xs sm:text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md transition-all duration-200"
              onClick={() => {
                // TODO: Implement add card functionality
                console.log('Add card to column:', column.id);
              }}
            >
              + Add a card
            </button>
            
            {/* Drop zone indicator */}
            {snapshot.isDraggingOver && (
              <div className="absolute inset-x-3 top-16 bottom-3 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-50 bg-blue-50"></div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
} 