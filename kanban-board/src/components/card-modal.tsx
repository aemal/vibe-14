'use client';

import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import FocusLock from 'react-focus-lock';
import { Card, CardFormData, ColumnId } from '@/types/kanban';
import { useKanban } from '@/contexts/kanban-context';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: ColumnId;
  mode: 'add' | 'edit';
  card?: Card; // For edit mode
}

export function CardModal({ isOpen, onClose, columnId, mode, card }: CardModalProps) {
  const { addCard, editCard } = useKanban();
  
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CardFormData>({
    defaultValues: {
      title: card?.title || '',
      description: card?.description || '',
    },
  });

  // Reset form when modal opens/closes or card changes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: card?.title || '',
        description: card?.description || '',
      });
      // Focus the title field when modal opens
      setTimeout(() => setFocus('title'), 100);
    }
  }, [isOpen, card, reset, setFocus]);

  const onSubmit: SubmitHandler<CardFormData> = async (data) => {
    try {
      if (mode === 'add') {
        addCard(columnId, {
          title: data.title.trim(),
          description: data.description.trim(),
        });
      } else if (mode === 'edit' && card) {
        editCard(card.id, columnId, {
          title: data.title.trim(),
          description: data.description.trim(),
        });
      }
      
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={handleClose}
        onKeyDown={handleKeyDown}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <FocusLock disabled={!isOpen} returnFocus>
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-title"
                    >
                      {mode === 'add' ? 'Add New Card' : 'Edit Card'}
                    </Dialog.Title>
                    
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Close dialog"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" role="form">
                    {/* Title Field */}
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        {...register('title', {
                          required: 'Title is required',
                          minLength: {
                            value: 1,
                            message: 'Title must be at least 1 character',
                          },
                          maxLength: {
                            value: 100,
                            message: 'Title must be less than 100 characters',
                          },
                        })}
                        className={`
                          mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 
                          shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
                          ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                        `}
                        placeholder="Enter card title..."
                        aria-invalid={errors.title ? 'true' : 'false'}
                        aria-describedby={errors.title ? 'title-error' : undefined}
                      />
                      {errors.title && (
                        <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    {/* Description Field */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        {...register('description', {
                          maxLength: {
                            value: 500,
                            message: 'Description must be less than 500 characters',
                          },
                        })}
                        className={`
                          mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 
                          shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical
                          ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                        `}
                        placeholder="Enter card description (optional)..."
                        aria-invalid={errors.description ? 'true' : 'false'}
                        aria-describedby={errors.description ? 'description-error' : undefined}
                      />
                      {errors.description && (
                        <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4" role="group" aria-label="Form actions">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] transition-colors duration-200"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] transition-colors duration-200"
                        aria-describedby={isSubmitting ? 'submit-status' : undefined}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          mode === 'add' ? 'Add Card' : 'Save Changes'
                        )}
                      </button>
                      {isSubmitting && (
                        <span id="submit-status" className="sr-only">
                          Saving card, please wait...
                        </span>
                      )}
                    </div>
                  </form>
                </FocusLock>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 