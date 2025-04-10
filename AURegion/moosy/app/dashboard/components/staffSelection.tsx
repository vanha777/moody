'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Db, Server } from "@/app/utils/db";
import { useAppContext } from "@/app/utils/AppContext";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SimpleSideBar from '@/app/dashboard/components/simpleSideBar';

export interface StaffProps {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  lastContacted?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  isFavorite?: boolean;
  lastVisited?: Date;
}

// Update the interface to remove toggle and isSelecting
interface StaffSelectionProps {
  staffMembers?: StaffProps[];
  onStaffSelect?: (staff: StaffProps) => void;
  onClose?: () => void;
}

// Helper function to transform staff data to StaffProps format
function transformStaffToStaffProps(staff: any): StaffProps {
  return {
    id: staff.id,
    name: `${staff.personal_information.first_name} ${staff.personal_information.last_name}`,
    firstName: staff.personal_information.first_name,
    lastName: staff.personal_information.last_name,
    email: staff.contact_method?.find((m: { type: string; }) => m.type === 'email')?.value || '',
    phone: staff.contact_method?.find((m: { type: string; }) => m.type === 'phone')?.value,
    role: 'staff', // No role field in auth staff data
    avatar: staff.profile_image?.path,
    notes: '', // No notes field in auth staff data
    lastVisited: undefined,
    address: undefined // No address field in auth staff data
  };
}

export default function StaffSelection({
  staffMembers: propStaffMembers,
  onStaffSelect,
  onClose
}: StaffSelectionProps = {}) {
  const router = useRouter();
  const { auth, getUser } = useAppContext();
  const [staffMembers, setStaffMembers] = useState<StaffProps[]>([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState<StaffProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffProps | undefined>(undefined);
  const [recentlyVisited, setRecentlyVisited] = useState<StaffProps[]>([]);

  // Alphabet for the side index
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  useEffect(() => {
    // If staff members are provided as props, use them
    if (propStaffMembers && propStaffMembers.length > 0) {
      setStaffMembers(propStaffMembers);
      setFilteredStaffMembers(propStaffMembers);
      return;
    }

    // Otherwise fetch from database
    const fetchStaffMembers = async () => {
      if (!auth) {
        router.push('/dashboard/login');
        return;
      }

      if (auth.roles.staff) {
        // Transform staff data to StaffProps format
        const realStaffMembers = auth.roles.staff.map(transformStaffToStaffProps);

        setStaffMembers(realStaffMembers);
        setFilteredStaffMembers(realStaffMembers);

        // Set recently visited staff
        const recent = realStaffMembers
          .filter(staff => staff.lastVisited)
          .sort((a, b) =>
            (b.lastVisited?.getTime() || 0) - (a.lastVisited?.getTime() || 0)
          )
          .slice(0, 4);

        setRecentlyVisited(recent);
      }
    };

    fetchStaffMembers();
  }, [propStaffMembers, auth]);

  // Filter staff members when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStaffMembers(staffMembers);
    } else {
      const filtered = staffMembers.filter(staff =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaffMembers(filtered);
    }
  }, [searchQuery, staffMembers]);

  // Group staff members by first letter of name
  const groupedStaffMembers = filteredStaffMembers.reduce((acc, staff) => {
    const firstLetter = staff.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(staff);
    return acc;
  }, {} as Record<string, StaffProps[]>);

  // Sort letters for display
  const sortedLetters = Object.keys(groupedStaffMembers).sort();

  const handleStaffClick = (staff: StaffProps) => {
    // Update the staff's lastVisited timestamp
    const updatedStaff = { ...staff, lastVisited: new Date() };

    // Update staff members array
    const updatedStaffMembers = staffMembers.map(s =>
      s.id === staff.id ? updatedStaff : s
    );
    setStaffMembers(updatedStaffMembers);

    // Update filtered staff members if needed
    setFilteredStaffMembers(prevFiltered =>
      prevFiltered.map(s => s.id === staff.id ? updatedStaff : s)
    );

    // Update recently visited list
    setRecentlyVisited(prev => {
      const withoutCurrent = prev.filter(s => s.id !== staff.id);
      return [updatedStaff, ...withoutCurrent].slice(0, 4);
    });

    // Call the onStaffSelect callback if provided
    if (onStaffSelect) {
      onStaffSelect(updatedStaff);
    }
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    // Scroll to the section
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-20">
      <SimpleSideBar>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {/* Header */}
          <div className="bg-white shadow-sm p-4 sticky top-0 z-30">
            <div className="flex items-center">
              {onClose && (
                <button
                  onClick={onClose}
                  className="mr-3 p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-semibold text-gray-800 mb-3">
                {onStaffSelect ? "Select Staff" : "Staff Members"}
              </h1>
            </div>

            {/* Search bar on a different line */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name"
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Staff list */}
            <div className="flex-1 overflow-y-auto pr-8">
              {/* No results message */}
              {filteredStaffMembers.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No staff members found</p>
                </div>
              )}

              {/* Alphabetical sections */}
              {sortedLetters.map((letter) => (
                <div key={letter} id={`section-${letter}`} className="px-4">
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-[73px] bg-gray-50 py-1 z-10 border-b border-gray-200">
                    {letter}
                  </h2>
                  <ul className="mt-20">
                    {groupedStaffMembers[letter].map((staff) => (
                      <li
                        key={staff.id}
                        className="py-3 flex items-center border-b border-gray-100 last:border-b-0"
                        onClick={() => handleStaffClick(staff)}
                      >
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold mr-3">
                            {staff.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                          {staff.role && (
                            <p className="text-xs text-gray-500">{staff.role}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Alphabetical index */}
            <div className="w-8 flex flex-col items-center justify-center bg-transparent py-2 text-xs font-medium sticky right-0 z-10">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  className={`w-6 h-6 flex items-center justify-center rounded-full ${selectedLetter === letter ? 'bg-blue-500 text-white' : 'text-gray-500'
                    }`}
                  onClick={() => handleLetterClick(letter)}
                  disabled={!groupedStaffMembers[letter]}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </SimpleSideBar>
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}