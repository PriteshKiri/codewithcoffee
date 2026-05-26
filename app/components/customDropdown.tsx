'use client';

import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

export interface DropdownOption {
  value: string;
  label: string;
  count?: number;
}

interface CustomDropdownProps {
  options: (string | DropdownOption)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function normalizeOption(option: string | DropdownOption): DropdownOption {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }
  return option;
}

export default function CustomDropdown({ options, value, onChange, className = '' }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const normalized = options.map(normalizeOption);
  const selected = normalized.find((opt) => opt.value === value);
  const selectedLabel = selected?.label ?? value;
  const selectedCount = selected?.count;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-base rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>{selectedLabel}</span>
          {typeof selectedCount === 'number' && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
              ({selectedCount})
            </span>
          )}
        </span>
        <FaChevronDown
          className={`ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {normalized.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-base transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{option.label}</span>
                {typeof option.count === 'number' && (
                  <span
                    className={`text-xs font-normal ${
                      isSelected
                        ? 'text-white/80 dark:text-neutral-900/70'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    {option.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
