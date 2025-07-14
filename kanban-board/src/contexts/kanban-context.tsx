'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Board, BoardAction, Card, ColumnId } from '@/types/kanban';

// Initial board data
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

// Generate unique ID for new cards
const generateCardId = (): string => {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Reducer function for board state management
const boardReducer = (state: Board, action: BoardAction): Board => {
  switch (action.type) {
    case 'MOVE_CARD': {
      const { sourceColumnId, destinationColumnId, destinationIndex, sourceIndex } = action.payload;
      
      const sourceColumn = state.columns[sourceColumnId];
      const destinationColumn = state.columns[destinationColumnId];
      
      const newState = { ...state };

      // Moving within the same column
      if (sourceColumnId === destinationColumnId) {
        const newCards = Array.from(sourceColumn.cards);
        const [movedCard] = newCards.splice(sourceIndex, 1);
        
        if (movedCard) {
          newCards.splice(destinationIndex, 0, movedCard);
          newState.columns[sourceColumnId] = {
            ...sourceColumn,
            cards: newCards,
          };
        }
      } else {
        // Moving between different columns
        const sourceCards = Array.from(sourceColumn.cards);
        const destinationCards = Array.from(destinationColumn.cards);
        
        const [movedCard] = sourceCards.splice(sourceIndex, 1);
        
        if (movedCard) {
          const updatedCard = {
            ...movedCard,
            updatedAt: new Date(),
          };
          destinationCards.splice(destinationIndex, 0, updatedCard);

          newState.columns[sourceColumnId] = {
            ...sourceColumn,
            cards: sourceCards,
          };

          newState.columns[destinationColumnId] = {
            ...destinationColumn,
            cards: destinationCards,
          };
        }
      }

      return newState;
    }

    case 'ADD_CARD': {
      const { columnId, card } = action.payload;
      const newCard: Card = {
        ...card,
        id: generateCardId(),
        createdAt: new Date(),
      };

      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cards: [...state.columns[columnId].cards, newCard],
          },
        },
      };
    }

    case 'EDIT_CARD': {
      const { cardId, columnId, updates } = action.payload;
      
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cards: state.columns[columnId].cards.map(card =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date() }
                : card
            ),
          },
        },
      };
    }

    case 'DELETE_CARD': {
      const { cardId, columnId } = action.payload;
      
      return {
        ...state,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            cards: state.columns[columnId].cards.filter(card => card.id !== cardId),
          },
        },
      };
    }

    case 'SET_BOARD': {
      return action.payload.board;
    }

    default:
      return state;
  }
};

// Context type definition
interface KanbanContextType {
  board: Board;
  dispatch: React.Dispatch<BoardAction>;
  // Helper methods
  moveCard: (cardId: string, sourceColumnId: ColumnId, destinationColumnId: ColumnId, destinationIndex: number, sourceIndex: number) => void;
  addCard: (columnId: ColumnId, cardData: Omit<Card, 'id' | 'createdAt'>) => void;
  editCard: (cardId: string, columnId: ColumnId, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  deleteCard: (cardId: string, columnId: ColumnId) => void;
}

// Create context
const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

// Provider component
interface KanbanProviderProps {
  children: ReactNode;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children }) => {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);

  // Helper methods for easier action dispatching
  const moveCard = (cardId: string, sourceColumnId: ColumnId, destinationColumnId: ColumnId, destinationIndex: number, sourceIndex: number) => {
    dispatch({
      type: 'MOVE_CARD',
      payload: { cardId, sourceColumnId, destinationColumnId, destinationIndex, sourceIndex },
    });
  };

  const addCard = (columnId: ColumnId, cardData: Omit<Card, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_CARD',
      payload: { columnId, card: cardData },
    });
  };

  const editCard = (cardId: string, columnId: ColumnId, updates: Partial<Pick<Card, 'title' | 'description'>>) => {
    dispatch({
      type: 'EDIT_CARD',
      payload: { cardId, columnId, updates },
    });
  };

  const deleteCard = (cardId: string, columnId: ColumnId) => {
    dispatch({
      type: 'DELETE_CARD',
      payload: { cardId, columnId },
    });
  };

  const value: KanbanContextType = {
    board,
    dispatch,
    moveCard,
    addCard,
    editCard,
    deleteCard,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};

// Custom hook to use the Kanban context
export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}; 