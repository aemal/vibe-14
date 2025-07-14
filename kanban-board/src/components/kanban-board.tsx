'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ColumnId } from '@/types/kanban';
import { Column } from './column';
import { useKanban } from '@/contexts/kanban-context';

export function KanbanBoard() {
  const { board, moveCard } = useKanban();
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const columnOrder: ColumnId[] = ['backlog', 'in-progress', 'cancelled', 'blocked', 'completed'];

  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

    // Use context method to move card
    moveCard(
      result.draggableId,
      source.droppableId as ColumnId,
      destination.droppableId as ColumnId,
      destination.index,
      source.index
    );
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isMobile) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentColumnIndex > 0) {
          setCurrentColumnIndex(prev => prev - 1);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentColumnIndex < columnOrder.length - 1) {
          setCurrentColumnIndex(prev => prev + 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        setCurrentColumnIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setCurrentColumnIndex(columnOrder.length - 1);
        break;
    }
  }, [isMobile, currentColumnIndex, columnOrder.length]);

  // Mobile swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile && currentColumnIndex < columnOrder.length - 1) {
        setCurrentColumnIndex(prev => prev + 1);
      }
    },
    onSwipedRight: () => {
      if (isMobile && currentColumnIndex > 0) {
        setCurrentColumnIndex(prev => prev - 1);
      }
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const goToPreviousColumn = () => {
    if (currentColumnIndex > 0) {
      setCurrentColumnIndex(prev => prev - 1);
    }
  };

  const goToNextColumn = () => {
    if (currentColumnIndex < columnOrder.length - 1) {
      setCurrentColumnIndex(prev => prev + 1);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div 
        className="min-h-screen bg-gray-50 p-3 sm:p-6"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="mx-auto max-w-7xl">
          <motion.h1 
            className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            id="main-heading"
          >
            Kanban Board
          </motion.h1>

          {/* Skip to content link for screen readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>

          {/* Mobile Navigation */}
          {isMobile && (
            <motion.nav 
              className="mb-4 flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              role="navigation"
              aria-label="Column navigation"
            >
              <button
                onClick={goToPreviousColumn}
                disabled={currentColumnIndex === 0}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Previous column"
                type="button"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="text-center">
                <h2 className="font-semibold text-lg text-gray-900" id="current-column">
                  {board.columns[columnOrder[currentColumnIndex] as ColumnId]?.title || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-500" aria-live="polite">
                  Column {currentColumnIndex + 1} of {columnOrder.length}
                </p>
              </div>

              <button
                onClick={goToNextColumn}
                disabled={currentColumnIndex === columnOrder.length - 1}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Next column"
                type="button"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </motion.nav>
          )}

          {/* Column Dots Navigation (Mobile) */}
          {isMobile && (
            <motion.div 
              className="mb-4 flex justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              role="tablist"
              aria-label="Column indicators"
            >
              {columnOrder.map((columnId, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentColumnIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentColumnIndex 
                      ? 'bg-blue-500 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to ${board.columns[columnId].title} column`}
                  aria-current={index === currentColumnIndex ? 'page' : undefined}
                  role="tab"
                  aria-selected={index === currentColumnIndex}
                  type="button"
                />
              ))}
            </motion.div>
          )}
          
          {/* Desktop: Grid layout, Mobile: Single column with swiping */}
          <main 
            {...swipeHandlers} 
            className="h-auto md:h-[calc(100vh-10rem)]"
            id="main-content"
            role="main"
            aria-label="Kanban board columns"
          >
            {isMobile ? (
              /* Mobile: Single column view with swipe */
              <div className="overflow-hidden" role="region" aria-live="polite" aria-atomic="true">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentColumnIndex}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="w-full"
                  >
                    <Column
                      column={board.columns[columnOrder[currentColumnIndex] as ColumnId]}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              /* Desktop: Grid layout */
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                role="region"
                aria-label="All kanban columns"
              >
                {columnOrder.map((columnId, index) => (
                  <motion.div
                    key={columnId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  >
                    <Column
                      column={board.columns[columnId]}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </main>

          {/* Mobile Swipe Hint */}
          {isMobile && (
            <motion.div 
              className="mt-4 text-center text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              role="status"
              aria-live="polite"
            >
              Swipe left or right to navigate between columns, or use keyboard arrow keys
            </motion.div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
} 