'use client';

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Column as ColumnType, COLUMN_CONFIG, ColumnId, Card } from '@/types/kanban';
import { KanbanCard } from './kanban-card';
import { CardModal } from './card-modal';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingCard, setEditingCard] = useState<Card | undefined>(undefined);
  const config = COLUMN_CONFIG[column.id as ColumnId];

  const handleAddCard = () => {
    setModalMode('add');
    setEditingCard(undefined);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setModalMode('edit');
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCard(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key for add card button
    if (e.key === 'Enter' && e.target === e.currentTarget) {
      e.preventDefault();
      handleAddCard();
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full md:h-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      layout
      role="region"
      aria-labelledby={`column-header-${column.id}`}
    >
      {/* Column Header */}
      <motion.header 
        className={`p-3 sm:p-4 rounded-t-lg border-2 shadow-sm ${config.color} ${config.bgColor}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        id={`column-header-${column.id}`}
      >
        <h2 className={`font-semibold text-base sm:text-lg ${config.color.split(' ')[1]}`}>
          {column.title}
        </h2>
        <motion.div 
          className="text-xs sm:text-sm text-gray-600 mt-1"
          key={column.cards.length}
          initial={{ scale: 1.2, color: "#3B82F6" }}
          animate={{ scale: 1, color: "#6B7280" }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
          aria-atomic="true"
        >
          {column.cards.length} card{column.cards.length !== 1 ? 's' : ''}
        </motion.div>
      </motion.header>

      {/* Column Body */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <motion.section
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-3 sm:p-4 space-y-3 min-h-[250px] md:min-h-[300px] 
              rounded-b-lg border-2 border-t-0 transition-all duration-200
              ${config.color} ${config.bgColor} bg-opacity-60
              ${snapshot.isDraggingOver ? 'bg-opacity-80 shadow-inner' : ''}
              ${snapshot.isDraggingOver ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}
            `}
            animate={{
              backgroundColor: snapshot.isDraggingOver ? "rgba(59, 130, 246, 0.1)" : "transparent"
            }}
            transition={{ duration: 0.2 }}
            aria-label={`Cards in ${column.title} column`}
            role="group"
            aria-describedby={`column-description-${column.id}`}
          >
            <div id={`column-description-${column.id}`} className="sr-only">
              Column containing {column.cards.length} cards. You can drag and drop cards to reorder or move them between columns.
            </div>

            <AnimatePresence mode="popLayout">
              {column.cards.map((card, index) => (
                <KanbanCard 
                  key={card.id} 
                  card={card} 
                  index={index} 
                  columnId={column.id as ColumnId}
                  onEdit={handleEditCard}
                />
              ))}
            </AnimatePresence>
            
            {provided.placeholder}

            {/* Add Card Button */}
            <motion.button
              onClick={handleAddCard}
              onKeyDown={handleKeyDown}
              className="w-full p-2 sm:p-3 border-2 border-dashed border-gray-300 rounded-lg text-xs sm:text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px]"
              aria-label={`Add a new card to ${column.title} column`}
              aria-describedby={`add-card-hint-${column.id}`}
              whileHover={{ 
                scale: 1.02,
                borderColor: "#9CA3AF",
                backgroundColor: "white"
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              type="button"
            >
              + Add a card
            </motion.button>
            
            <div id={`add-card-hint-${column.id}`} className="sr-only">
              Press Enter or click to open a dialog for adding a new card to this column
            </div>
            
            {/* Drop zone indicator */}
            {snapshot.isDraggingOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-x-3 top-16 bottom-3 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none opacity-50 bg-blue-50"
                aria-hidden="true"
              />
            )}

            {/* Screen reader announcement for drag over */}
            {snapshot.isDraggingOver && (
              <div className="sr-only" aria-live="assertive" role="status">
                Drop zone active for {column.title} column
              </div>
            )}
          </motion.section>
        )}
      </Droppable>

      {/* Card Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        columnId={column.id as ColumnId}
        mode={modalMode}
        card={editingCard}
      />
    </motion.div>
  );
} 