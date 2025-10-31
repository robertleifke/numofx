"use client";

import { Calendar, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForwardRates } from "@/lib/hooks/useFxRates";
import { useWalletInfo } from "@/lib/hooks/useWallet";

interface CalendarPickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

const CalendarPicker = ({ selectedDate, onDateSelect, onClose }: CalendarPickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add day cells
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      const isPast = date < today;
      const isSelected = date.toDateString() === new Date(selectedDate).toDateString();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) {
              const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              onDateSelect(newDate.toISOString().split('T')[0]);
              onClose();
            }
          }}
          disabled={isPast}
          className={`
            p-2 rounded-lg text-center font-medium transition
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
            ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
            ${isToday && !isSelected ? 'border-2 border-blue-600 text-blue-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
  };

  return (
    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays()}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        Past dates are disabled
      </div>
    </div>
  );
};

export function ForwardInterface() {
  const [usdAmount, setUsdAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Use wagmi hooks
  const { isConnected } = useWalletInfo();

  // Default to 3M tenor as that's the target
  const { data: forwardRateData, isLoading, error } = useForwardRates("3M");

  // Fallback to mock data if API is not available
  const forwardRate = forwardRateData?.rate?.toFixed(4) || "130.9700";
  const spotRate = forwardRateData?.spot?.toFixed(4) || "129.1500";
  const forwardPoints = forwardRateData?.forwardPoints?.toFixed(2) || "1.82";

  // Check if form is complete to show forward rate section
  const isFormComplete = usdAmount && parseFloat(usdAmount.replace(/,/g, '')) > 0 && expiryDate;

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateKES = () => {
    const amount = parseFloat(usdAmount.replace(/,/g, '')) || 0;
    return Math.round(amount * parseFloat(forwardRate));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getTimeUntil = (dateString: string) => {
    const target = new Date(dateString);
    const now = new Date();

    // Set time to start of day for both dates
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    // Calculate total days difference
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
      `}</style>
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-2xl font-bold text-gray-900">LOCK RATE</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* USD Amount Input */}
        <div className="mb-6">
          <label className="text-lg font-semibold text-gray-700 mb-2 block">
            How much do you need?
          </label>
          <div className="relative bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl focus-within:border-gray-400 focus-within:bg-white transition-all">
            <input
              type="text"
              value={usdAmount ? formatNumber(parseFloat(usdAmount.replace(/,/g, ''))) : ''}
              onChange={(e) => setUsdAmount(e.target.value.replace(/,/g, ''))}
              className="w-full text-4xl font-bold text-gray-900 focus:outline-none bg-transparent pr-24"
              placeholder="0"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Crect fill='%23B22234' width='60' height='30'/%3E%3Cpath d='M0 3.5h60M0 7h60M0 10.5h60M0 14h60M0 17.5h60M0 21h60M0 24.5h60M0 28h60' stroke='%23fff' stroke-width='2'/%3E%3Crect fill='%233C3B6E' width='24' height='15'/%3E%3C/svg%3E" alt="US Flag" className="w-8 h-5 rounded" />
              <span className="text-lg font-semibold text-gray-700">USD</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">For payment to your vendor</div>
        </div>

        {/* Expiry Date Selector */}
        <div className="mb-6 relative" ref={calendarRef}>
          <label className="text-lg font-semibold text-gray-700 mb-2 block">Lock rate until</label>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:border-gray-400 focus:bg-white cursor-pointer flex items-center justify-between transition-all"
          >
            <span className={expiryDate ? 'text-gray-900' : 'text-gray-400'}>
              {expiryDate ? formatDate(expiryDate) : 'Select expiry date'}
            </span>
            <Calendar className="w-5 h-5 text-gray-400" />
          </button>
          {expiryDate && (
            <div className="text-xs text-gray-500 mt-2">
              Rate will expire in {getTimeUntil(expiryDate)}
            </div>
          )}

          {showCalendar && (
            <CalendarPicker
              selectedDate={expiryDate || new Date().toISOString().split('T')[0]}
              onDateSelect={(date) => {
                setExpiryDate(date);
                setShowCalendar(false);
              }}
              onClose={() => setShowCalendar(false)}
            />
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* KES Amount Output */}
        <div className="mb-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">You'll pay</div>
          <div className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {usdAmount ? formatNumber(calculateKES()) : '0'}
                </div>
                <div className="text-sm text-gray-600">
                  ≈ ${formatNumber(parseFloat(usdAmount.replace(/,/g, '')) || 0)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Cpath fill='%23000' d='M0 0h900v600H0z'/%3E%3Cpath fill='%23FFF' d='M0 180h900v60H0zm0 180h900v60H0z'/%3E%3Cpath fill='%23006600' d='M0 240h900v180H0z'/%3E%3Cpath fill='%23BA0C2F' d='M0 60h900v120H0zm0 360h900v120H0z'/%3E%3Cg fill='%23FFF' stroke='%23000' stroke-width='15'%3E%3Cellipse cx='450' cy='300' rx='180' ry='210'/%3E%3Cpath d='M450 180v240M360 220l180 160M540 220L360 380'/%3E%3C/g%3E%3C/svg%3E" alt="Kenyan Flag" className="w-8 h-6 rounded" />
                <span className="text-lg font-semibold text-gray-700">KES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forward Rate and Lock Button - Appears when form is complete */}
        {isFormComplete && (
          <div className="animate-slideDown">
            {/* Dropdown Section */}
            <div className="mt-6 pt-6 bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 -mx-2">
              {/* Implied Forward Rate */}
              <div className="mb-6 text-center">
                <div className="text-sm text-gray-600 mb-1">Forward Rate</div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {forwardRate}
                </div>
                <div className="text-sm text-gray-600">KES per USD</div>
              </div>

              {/* Settlement Info */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Receive in {getTimeUntil(expiryDate)}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${formatNumber(parseFloat(usdAmount.replace(/,/g, '')))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Settlement date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(expiryDate)}
                  </span>
                </div>
              </div>

              {/* Lock Button */}
              <button
                className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition"
                disabled={isLoading}
              >
                {isLoading ? "Loading rate..." : "Lock This Rate"}
              </button>
            </div>
          </div>
        )}

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Know exactly how much KES you'll need - No surprises
          </p>
        </div>
      </div>
    </div>
  );
}
