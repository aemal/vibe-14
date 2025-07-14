'use client';

import React, { useState } from 'react';
import { Board, COLUMN_CONFIG, ColumnId } from '@/types/kanban';
import { Column } from './column';

// Initial sample data
const initialBoard: Board = {
  columns: {
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      color: COLUMN_CONFIG.backlog.color,
      cards: [
        {
          id: '1',
          title: 'Setup project structure',
          description: 'Initialize the project with Next.js and TypeScript',
        },
        {
          id: '2',
          title: 'Design UI mockups',
          description: 'Create wireframes for the Kanban board interface',
        },
      ],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: COLUMN_CONFIG['in-progress'].color,
      cards: [
        {
          id: '3',
          title: 'Implement drag and drop',
          description: 'Add drag and drop functionality to cards',
        },
      ],
    },
    cancelled: {
      id: 'cancelled',
      title: 'Cancelled',
      color: COLUMN_CONFIG.cancelled.color,
      cards: [],
    },
    blocked: {
      id: 'blocked',
      title: 'Blocked',
      color: COLUMN_CONFIG.blocked.color,
      cards: [
        {
          id: '4',
          title: 'API integration',
          description: 'Waiting for backend API specifications',
        },
      ],
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      color: COLUMN_CONFIG.completed.color,
      cards: [
        {
          id: '5',
          title: 'Initial setup',
          description: 'Project initialization and dependencies installation',
        },
      ],
    },
  },
};

export function KanbanBoard() {
  const [board] = useState<Board>(initialBoard);
  
  const columnOrder: ColumnId[] = ['backlog', 'in-progress', 'cancelled', 'blocked', 'completed'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Kanban Board
        </h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 h-[calc(100vh-12rem)]">
          {columnOrder.map((columnId) => (
            <Column
              key={columnId}
              column={board.columns[columnId]}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 