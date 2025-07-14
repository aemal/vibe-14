export interface Card {
  id: string;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export type ColumnId = 'backlog' | 'in-progress' | 'cancelled' | 'blocked' | 'completed';

export interface Board {
  columns: Record<ColumnId, Column>;
}

export interface DragEndEvent {
  active: {
    id: string;
  };
  over: {
    id: string;
  } | null;
}

// Board Actions for useReducer
export type BoardAction =
  | { type: 'MOVE_CARD'; payload: { cardId: string; sourceColumnId: ColumnId; destinationColumnId: ColumnId; destinationIndex: number; sourceIndex: number } }
  | { type: 'ADD_CARD'; payload: { columnId: ColumnId; card: Omit<Card, 'id'> } }
  | { type: 'EDIT_CARD'; payload: { cardId: string; columnId: ColumnId; updates: Partial<Pick<Card, 'title' | 'description'>> } }
  | { type: 'DELETE_CARD'; payload: { cardId: string; columnId: ColumnId } }
  | { type: 'SET_BOARD'; payload: { board: Board } };

// Form data types
export interface CardFormData {
  title: string;
  description: string;
}

// Column configuration with colors as specified in PRD
export const COLUMN_CONFIG: Record<ColumnId, { title: string; color: string; bgColor: string }> = {
  backlog: {
    title: 'Backlog',
    color: 'border-blue-300 text-blue-800',
    bgColor: 'bg-blue-50',
  },
  'in-progress': {
    title: 'In Progress', 
    color: 'border-yellow-300 text-yellow-800',
    bgColor: 'bg-yellow-50',
  },
  cancelled: {
    title: 'Cancelled',
    color: 'border-red-300 text-red-800',
    bgColor: 'bg-red-50',
  },
  blocked: {
    title: 'Blocked',
    color: 'border-gray-300 text-gray-800',
    bgColor: 'bg-gray-50',
  },
  completed: {
    title: 'Completed',
    color: 'border-green-300 text-green-800',
    bgColor: 'bg-green-50',
  },
}; 