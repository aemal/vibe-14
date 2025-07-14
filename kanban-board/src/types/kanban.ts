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
  color: string;
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

// Column configuration with colors as specified in PRD
export const COLUMN_CONFIG: Record<ColumnId, { title: string; color: string }> = {
  backlog: {
    title: 'Backlog',
    color: 'bg-blue-100 border-blue-300',
  },
  'in-progress': {
    title: 'In Progress', 
    color: 'bg-yellow-100 border-yellow-300',
  },
  cancelled: {
    title: 'Cancelled',
    color: 'bg-red-100 border-red-300',
  },
  blocked: {
    title: 'Blocked',
    color: 'bg-gray-100 border-gray-300',
  },
  completed: {
    title: 'Completed',
    color: 'bg-green-100 border-green-300',
  },
}; 