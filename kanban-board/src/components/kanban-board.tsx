'use client';

import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Board, ColumnId } from '@/types/kanban';
import { Column } from './column';

// Initial sample data
const initialBoard: Board = {
  columns: {
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      cards: [
        {
          id: '1',
          title: 'Setup project structure',
          description: 'Initialize the project with Next.js and TypeScript',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          title: 'Design UI mockups',
          description: 'Create wireframes for the Kanban board interface',
          createdAt: new Date('2024-01-16'),
        },
      ],
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        {
          id: '3',
          title: 'Implement drag and drop',
          description: 'Add drag and drop functionality to cards using @hello-pangea/dnd library with smooth animations and visual feedback',
          createdAt: new Date('2024-01-17'),
        },
      ],
    },
    cancelled: {
      id: 'cancelled',
      title: 'Cancelled',
      cards: [],
    },
    blocked: {
      id: 'blocked',
      title: 'Blocked',
      cards: [
        {
          id: '4',
          title: 'API integration',
          description: 'Waiting for backend API specifications',
          createdAt: new Date('2024-01-18'),
        },
      ],
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      cards: [
        {
          id: '5',
          title: 'Initial setup',
          description: 'Project initialization and dependencies installation',
          createdAt: new Date('2024-01-14'),
        },
      ],
    },
  },
};

export function KanbanBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  
  const columnOrder: ColumnId[] = ['backlog', 'in-progress', 'cancelled', 'blocked', 'completed'];

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If dropped outside a droppable area, do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = board.columns[source.droppableId as ColumnId];
    const destinationColumn = board.columns[destination.droppableId as ColumnId];

    // Create new board state
    const newBoard = { ...board };

    // Moving within the same column
    if (source.droppableId === destination.droppableId) {
      const newCards = Array.from(sourceColumn.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      
      if (movedCard) {
        newCards.splice(destination.index, 0, movedCard);
        newBoard.columns[source.droppableId as ColumnId] = {
          ...sourceColumn,
          cards: newCards,
        };
      }
    } else {
      // Moving between different columns
      const sourceCards = Array.from(sourceColumn.cards);
      const destinationCards = Array.from(destinationColumn.cards);
      
      const [movedCard] = sourceCards.splice(source.index, 1);
      
      if (movedCard) {
        const updatedCard = {
          ...movedCard,
          updatedAt: new Date(),
        };
        destinationCards.splice(destination.index, 0, updatedCard);

        newBoard.columns[source.droppableId as ColumnId] = {
          ...sourceColumn,
          cards: sourceCards,
        };

        newBoard.columns[destination.droppableId as ColumnId] = {
          ...destinationColumn,
          cards: destinationCards,
        };
      }
    }

    setBoard(newBoard);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-900">
            Kanban Board
          </h1>
          
          {/* Mobile: Stack columns vertically, Desktop: Grid layout */}
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-4 lg:gap-6 h-auto md:h-[calc(100vh-10rem)]">
            {columnOrder.map((columnId) => (
              <Column
                key={columnId}
                column={board.columns[columnId]}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
} 