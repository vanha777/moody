'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Db, Server } from "@/app/utils/db";
import { AppProvider, useAppContext, UserData } from "@/app/utils/AppContext";
import ManageIdeaForm from '@/app/dashboard/components/manageIdeas';
import router from 'next/router';
import CustomerDetails from './customerDetails';
export interface LocationProps {
  id?: number;
  country?: string;
  state?: string;
  suburb?: string;
}

export interface OfferProps {
  id?: number;
  created_at?: string;
  totalDeals?: number;
  active?: boolean;
  comission?: number;
  type?: string;
  description?: string;
}

export interface IdeaProps {
  id?: number;
  title: string;
  description: string;
  date?: string;
  address_detail?: LocationProps;
  industry?: string;
  media?: string[];
  upvotes?: number;
  downvotes?: number;
  url?: string;
  offer?: OfferProps;
}

export interface ContactProps {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  lastContacted?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  isFavorite?: boolean;
  lastVisited?: Date;
  totalSpent?: number;
  returns?: number;
  loyaltyPoints?: number;
  purchaseHistory?: {
    date: Date;
    amount: number;
    items?: string[];
  }[];
}

// Update the interface to remove toggle and isSelecting
interface ContactListProps {
  contacts?: ContactProps[];
  onContactSelect?: (contact: ContactProps) => void;
  onClose?: () => void;
}

export default function ContactList({ 
  contacts: propContacts, 
  onContactSelect,
  onClose
}: ContactListProps = {}) {
  const { auth, getUser } = useAppContext();
  const [contacts, setContacts] = useState<ContactProps[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactProps | undefined>(undefined);
  const [showAddContact, setShowAddContact] = useState(false);
  const [recentlyVisited, setRecentlyVisited] = useState<ContactProps[]>([]);
  
  // Alphabet for the side index
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  useEffect(() => {
    // If contacts are provided as props, use them
    if (propContacts && propContacts.length > 0) {
      setContacts(propContacts);
      setFilteredContacts(propContacts);
      return;
    }

    // Otherwise fetch from database
    const fetchContacts = async () => {
      let user = auth.userData;
      if (!user) {
        user = getUser();
        if (!user) {
          router.push('/not-found');
          return;
        }
      }
      
      // Mock data for now - this would be replaced with actual DB fetch
      const mockContacts: ContactProps[] = [
        { 
          id: 1, 
          name: "Alice Johnson", 
          email: "alice@example.com", 
          phone: "123-456-7890", 
          company: "Acme Corp", 
          avatar: "https://randomuser.me/api/portraits/women/1.jpg", 
          lastVisited: new Date(Date.now() - 3600000), // 1 hour ago
          totalSpent: 1250.75,
          loyaltyPoints: 450,
          isFavorite: true,
          notes: "Prefers email communication",
          address: {
            street: "123 Main St",
            city: "Boston",
            state: "MA",
            country: "USA",
            zip: "02108"
          },
          purchaseHistory: [
            { date: new Date(Date.now() - 86400000 * 7), amount: 350.25, items: ["Product A", "Product B"] },
            { date: new Date(Date.now() - 86400000 * 30), amount: 900.50, items: ["Product C"] }
          ]
        },
        { 
          id: 2, 
          name: "Bob Smith", 
          email: "bob@example.com", 
          phone: "234-567-8901", 
          company: "Tech Solutions", 
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          totalSpent: 875.50,
          loyaltyPoints: 200,
          returns: 1
        },
        { 
          id: 3, 
          name: "Carol Davis", 
          email: "carol@example.com", 
          phone: "345-678-9012", 
          company: "Global Systems", 
          avatar: "https://randomuser.me/api/portraits/women/2.jpg", 
          lastVisited: new Date(Date.now() - 7200000), // 2 hours ago
          totalSpent: 3200.25,
          loyaltyPoints: 780,
          isFavorite: true,
          address: {
            street: "456 Oak Ave",
            city: "Chicago",
            state: "IL",
            country: "USA",
            zip: "60601"
          }
        },
        { 
          id: 4, 
          name: "David Wilson", 
          email: "david@example.com", 
          phone: "456-789-0123", 
          company: "Innovative Inc", 
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          totalSpent: 450.00,
          loyaltyPoints: 100,
          returns: 2
        },
        { 
          id: 5, 
          name: "Emma Brown", 
          email: "emma@example.com", 
          phone: "567-890-1234", 
          company: "Digital Services", 
          avatar: "https://randomuser.me/api/portraits/women/3.jpg", 
          lastVisited: new Date(Date.now() - 86400000), // 1 day ago
          totalSpent: 1875.30,
          loyaltyPoints: 520,
          notes: "Interested in premium products",
          purchaseHistory: [
            { date: new Date(Date.now() - 86400000 * 10), amount: 875.30, items: ["Premium Package"] },
            { date: new Date(Date.now() - 86400000 * 60), amount: 1000.00, items: ["Annual Subscription"] }
          ]
        },
        { 
          id: 6, 
          name: "Frank Miller", 
          email: "frank@example.com", 
          phone: "678-901-2345", 
          company: "Creative Solutions", 
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          totalSpent: 325.75,
          loyaltyPoints: 80
        },
        { 
          id: 7, 
          name: "Grace Lee", 
          email: "grace@example.com", 
          phone: "789-012-3456", 
          company: "Future Tech", 
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
          totalSpent: 2150.00,
          loyaltyPoints: 600,
          isFavorite: true,
          address: {
            street: "789 Pine St",
            city: "Seattle",
            state: "WA",
            country: "USA",
            zip: "98101"
          }
        },
        { 
          id: 8, 
          name: "Henry Garcia", 
          email: "henry@example.com", 
          phone: "890-123-4567", 
          company: "Smart Innovations", 
          avatar: "https://randomuser.me/api/portraits/men/4.jpg",
          totalSpent: 750.25,
          loyaltyPoints: 180,
          returns: 1
        },
        { 
          id: 9, 
          name: "Isabella Martinez", 
          email: "isabella@example.com", 
          phone: "901-234-5678", 
          company: "Bright Ideas", 
          avatar: "https://randomuser.me/api/portraits/women/5.jpg",
          totalSpent: 1625.50,
          loyaltyPoints: 420,
          notes: "Prefers phone calls",
          address: {
            street: "101 Maple Dr",
            city: "Austin",
            state: "TX",
            country: "USA",
            zip: "73301"
          }
        },
        { 
          id: 10, 
          name: "Jack Robinson", 
          email: "jack@example.com", 
          phone: "012-345-6789", 
          company: "Next Gen Tech", 
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          totalSpent: 950.00,
          loyaltyPoints: 250,
          purchaseHistory: [
            { date: new Date(Date.now() - 86400000 * 15), amount: 450.00, items: ["Service A"] },
            { date: new Date(Date.now() - 86400000 * 45), amount: 500.00, items: ["Service B"] }
          ]
        },
      ];
      
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
      
      // Set recently visited contacts
      const recent = mockContacts
        .filter(contact => contact.lastVisited)
        .sort((a, b) => 
          (b.lastVisited?.getTime() || 0) - (a.lastVisited?.getTime() || 0)
        )
        .slice(0, 4); // Get the 4 most recently visited contacts
      
      setRecentlyVisited(recent);
    };
    
    fetchContacts();
  }, [propContacts]);

  // Filter contacts when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  // Group contacts by first letter of name
  const groupedContacts = filteredContacts.reduce((acc, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {} as Record<string, ContactProps[]>);

  // Sort letters for display
  const sortedLetters = Object.keys(groupedContacts).sort();

  const handleContactClick = (contact: ContactProps) => {
    // Update the contact's lastVisited timestamp
    const updatedContact = { ...contact, lastVisited: new Date() };
    
    // Update contacts array
    const updatedContacts = contacts.map(c => 
      c.id === contact.id ? updatedContact : c
    );
    setContacts(updatedContacts);
    
    // Update filtered contacts if needed
    setFilteredContacts(prevFiltered => 
      prevFiltered.map(c => c.id === contact.id ? updatedContact : c)
    );
    
    // Update recently visited list
    setRecentlyVisited(prev => {
      const withoutCurrent = prev.filter(c => c.id !== contact.id);
      return [updatedContact, ...withoutCurrent].slice(0, 4);
    });
    
    if (onContactSelect) {
      onContactSelect(updatedContact);
    } else {
      // Only show contact detail if not in selection mode
      setSelectedContact(updatedContact);
      setShowContactDetail(true);
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
    <div className="w-full h-full flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
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
            {onContactSelect ? "Select Customer" : "My Customers"}
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
        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {/* Recently visited section */}
          {recentlyVisited.length > 0 && (
            <div className="px-4 py-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recently Visited</h2>
              <div className="mt-2 grid grid-cols-4 gap-4 pb-4">
                {recentlyVisited.map((contact) => (
                  <div 
                    key={`recent-${contact.id}`} 
                    className="flex flex-col items-center"
                    onClick={() => handleContactClick(contact)}
                  >
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-14 h-14 rounded-full object-cover mb-1"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-semibold">
                        {contact.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs text-center truncate w-full">{contact.name.split(' ')[0]}</span>
                    <span className="text-xs text-gray-400 text-center">
                      {contact.lastVisited ? formatTimeAgo(contact.lastVisited) : ''}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-b border-gray-200"></div>
            </div>
          )}

          {/* No results message */}
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No contacts found</p>
            </div>
          )}

          {/* Alphabetical sections */}
          {sortedLetters.map((letter) => (
            <div key={letter} id={`section-${letter}`} className="px-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 py-1">
                {letter}
              </h2>
              <ul>
                {groupedContacts[letter].map((contact) => (
                  <li 
                    key={contact.id}
                    className="py-3 flex items-center border-b border-gray-100 last:border-b-0"
                    onClick={() => handleContactClick(contact)}
                  >
                    {contact.avatar ? (
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
                        {contact.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      {contact.phone && (
                        <p className="text-xs text-gray-500">{contact.phone}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>

        {/* Alphabetical index */}
        <div className="w-6 flex flex-col items-center justify-center bg-transparent py-2 text-xs font-medium">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                selectedLetter === letter ? 'bg-blue-500 text-white' : 'text-gray-500'
              }`}
              onClick={() => handleLetterClick(letter)}
              disabled={!groupedContacts[letter]}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* New Contact Button - Only show if onContactSelect is not provided */}
      {!onContactSelect && (
        <button 
          className="fixed md:bottom-6 bottom-28 right-6 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-20"
          onClick={() => setShowAddContact(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Contact Detail Overlay - Now sticky */}
      {showContactDetail && selectedContact && (
        <CustomerDetails 
          customer={selectedContact}
          onClose={() => setShowContactDetail(false)}
        />
      )}

      {/* Add Contact Overlay - Now sticky */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] overflow-hidden">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Contact</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Company name"
                />
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-md text-gray-800 font-medium"
                  onClick={() => setShowAddContact(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-black rounded-md text-white font-medium hover:bg-gray-800"
                  onClick={() => {
                    // Handle form submission
                    setShowAddContact(false);
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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