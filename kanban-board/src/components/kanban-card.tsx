'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Card, ColumnId } from '@/types/kanban';
import { PencilIcon } from '@heroicons/react/24/outline';

interface KanbanCardProps {
  card: Card;
  index: number;
  columnId: ColumnId;
  onEdit: (card: Card) => void;
}

export function KanbanCard({ card, index, columnId: _columnId, onEdit }: KanbanCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showIdTooltip, setShowIdTooltip] = useState(false);
  const [showDateTooltip, setShowDateTooltip] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(card);
  };

  // Check if text needs truncation
  const cardIdText = `#${card.id}`;
  const dateText = card.createdAt ? new Date(card.createdAt).toLocaleDateString() : '';
  const shouldTruncateId = cardIdText.length > 12;
  const shouldTruncateDate = dateText.length > 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      layout
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        layout: { duration: 0.3 }
      }}
    >
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
              group relative touch-manipulation
            `}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {/* Edit Button */}
            <motion.button
              onClick={handleEdit}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "rgba(243, 244, 246, 1)"
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1 right-1 p-2 min-w-[44px] min-h-[44px] rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 md:opacity-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 z-10 flex items-center justify-center"
              aria-label={`Edit ${card.title}`}
              title="Edit card"
            >
              <PencilIcon className="h-5 w-5" />
            </motion.button>

            {/* Card Title */}
            <motion.h3 
              className="font-medium text-gray-900 mb-2 line-clamp-2 leading-5 pr-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {card.title}
            </motion.h3>
            
            {/* Card Description */}
            {card.description && (
              <motion.p 
                className="text-sm text-gray-600 line-clamp-3 leading-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {card.description}
              </motion.p>
            )}
            
            {/* Card Metadata - Responsive with Tooltips */}
            <motion.div 
              className="mt-3 flex items-center justify-between text-xs text-gray-400 gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Card ID with tooltip */}
              <div className="relative flex-shrink-0">
                <span
                  className={`${shouldTruncateId ? 'max-w-[60px] truncate block' : ''}`}
                  onMouseEnter={() => shouldTruncateId && setShowIdTooltip(true)}
                  onMouseLeave={() => shouldTruncateId && setShowIdTooltip(false)}
                  title={shouldTruncateId ? cardIdText : undefined}
                >
                  {shouldTruncateId ? `${cardIdText.substring(0, 10)}...` : cardIdText}
                </span>
                {showIdTooltip && shouldTruncateId && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 bottom-full left-0 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                  >
                    {cardIdText}
                    <div className="absolute top-full left-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                  </motion.div>
                )}
              </div>

              {/* Date with tooltip */}
              {card.createdAt && (
                <div className="relative flex-shrink-0 text-right min-w-0">
                  <span
                    className={`${shouldTruncateDate ? 'max-w-[70px] truncate block ml-auto' : ''}`}
                    onMouseEnter={() => shouldTruncateDate && setShowDateTooltip(true)}
                    onMouseLeave={() => shouldTruncateDate && setShowDateTooltip(false)}
                    title={shouldTruncateDate ? dateText : undefined}
                  >
                    {shouldTruncateDate ? `${dateText.substring(0, 8)}...` : dateText}
                  </span>
                  {showDateTooltip && shouldTruncateDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 bottom-full right-0 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap"
                    >
                      {dateText}
                      <div className="absolute top-full right-2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Tooltip for full description */}
            {showTooltip && card.description && card.description.length > 100 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs"
              >
                <div className="font-medium mb-1">{card.title}</div>
                <div className="text-gray-200">{card.description}</div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </motion.div>
            )}

            {/* Drag indicator */}
            {snapshot.isDragging && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-blue-100 bg-opacity-20 rounded-lg border-2 border-blue-300 border-dashed"
              />
            )}
          </div>
        )}
      </Draggable>
    </motion.div>
  );
} 