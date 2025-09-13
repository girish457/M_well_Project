'use client'

import React, { useState } from 'react'

export type ViewMode = 'grid-small' | 'list' | 'list-bullet' | 'grid-large'
export type SortOption = 'default' | 'popularity' | 'rating' | 'latest' | 'price-low' | 'price-high'

interface ProductViewBarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  productCount?: number
}

const viewIcons = {
  'grid-small': (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  'list': (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
  'list-bullet': (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 000 2h.01a1 1 0 100-2H3zm3 0a1 1 0 000 2h.01a1 1 0 100-2H6zm3 0a1 1 0 000 2h.01a1 1 0 100-2H9zm3 0a1 1 0 000 2h.01a1 1 0 100-2h-.01zm-9 4a1 1 0 000 2h.01a1 1 0 100-2H3zm3 0a1 1 0 000 2h.01a1 1 0 100-2H6zm3 0a1 1 0 000 2h.01a1 1 0 100-2H9zm3 0a1 1 0 000 2h.01a1 1 0 100-2h-.01zm-9 4a1 1 0 000 2h.01a1 1 0 100-2H3zm3 0a1 1 0 000 2h.01a1 1 0 100-2H6zm3 0a1 1 0 000 2h.01a1 1 0 100-2H9zm3 0a1 1 0 000 2h.01a1 1 0 100-2h-.01zm-9 4a1 1 0 000 2h.01a1 1 0 100-2H3zm3 0a1 1 0 000 2h.01a1 1 0 100-2H6zm3 0a1 1 0 000 2h.01a1 1 0 100-2H9zm3 0a1 1 0 000 2h.01a1 1 0 100-2h-.01z" clipRule="evenodd" />
    </svg>
  ),
  'grid-large': (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  )
}

const sortOptions = [
  { value: 'default', label: 'Default sorting' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'latest', label: 'Sort by latest' },
  { value: 'price-low', label: 'Sort by price: low to high' },
  { value: 'price-high', label: 'Sort by price: high to low' }
] as const

export default function ProductViewBar({
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  productCount = 0
}: ProductViewBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentSortLabel = sortOptions.find(option => option.value === sortOption)?.label || 'Default sorting'

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* View Options */}
        <div className="flex items-center gap-2">
          {Object.entries(viewIcons).map(([mode, icon]) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode as ViewMode)}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'
              }`}
              title={`${mode.replace('-', ' ')} view`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Product Count and Sort */}
        <div className="flex items-center gap-4">
          {productCount > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {productCount} product{productCount !== 1 ? 's' : ''}
            </span>
          )}
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 min-w-[180px]"
            >
              <span className="flex-1 text-left">{currentSortLabel}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value as SortOption)
                      setIsDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                      sortOption === option.value
                        ? 'bg-green-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
