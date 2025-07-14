'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType } from '@/types/kanban';
import { KanbanCard } from './kanban-card';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`p-4 rounded-t-lg border-2 ${column.color}`}>
        <h2 className="font-semibold text-gray-800 text-lg">
          {column.title}
        </h2>
        <div className="text-sm text-gray-600 mt-1">
          {column.cards.length} card{column.cards.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-4 space-y-3 min-h-[200px] rounded-b-lg border-2 border-t-0 ${column.color} bg-opacity-30`}
      >
        <SortableContext
          items={column.cards.map(card => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </SortableContext>

        {/* Add Card Button */}
        <button
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => {
            // TODO: Implement add card functionality
            console.log('Add card to column:', column.id);
          }}
        >
          + Add a card
        </button>
      </div>
    </div>
  );
} 