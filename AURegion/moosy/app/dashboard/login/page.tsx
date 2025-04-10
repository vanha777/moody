'use client';
import { FcGoogle } from 'react-icons/fc';
import { BsApple } from 'react-icons/bs';
import { AppProvider, useAppContext } from "@/app/utils/AppContext";
import { Db, Server } from '@/app/utils/db'
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core'
import { useRouter } from 'next/navigation'
export interface LoginResponse {
  roles: {
    owner: Array<{
      id: string;
      personal_information: {
        first_name: string;
        last_name: string;
        date_of_birth: string | null;
        gender: string | null;
      };
      profile_image: {
        id: string;
        type: string;
        path: string;
      } | null;
      contact_method: Array<{
        id: string;
        type: string;
        value: string;
        is_primary: boolean;
      }> | null;
    }>;
    admin: Array<{
      id: string;
      personal_information: {
        first_name: string;
        last_name: string;
        date_of_birth: string | null;
        gender: string | null;
      };
      profile_image: {
        id: string;
        type: string;
        path: string;
      } | null;
      contact_method: Array<{
        id: string;
        type: string;
        value: string;
        is_primary: boolean;
      }> | null;
    }>;
    staff: Array<{
      id: string;
      personal_information: {
        first_name: string;
        last_name: string;
        date_of_birth: string | null;
        gender: string | null;
      };
      profile_image: {
        id: string;
        type: string;
        path: string;
      } | null;
      contact_method: Array<{
        id: string;
        type: string;
        value: string;
        is_primary: boolean;
      }> | null;
    }>;
    customer: Array<{
      id: string;
      personal_information: {
        first_name: string;
        last_name: string;
        date_of_birth: string | null;
        gender: string | null;
      };
      notes: string | null;
      profile_image: {
        id: string;
        type: string;
        path: string;
      } | null;
      contact_method: Array<{
        id: string;
        type: string;
        value: string;
        is_primary: boolean;
      }> | null;
      address: {
        street: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
      } | null;
    }>;
  };
  company: {
    id: string;
    name: string;
    description: string;
    logo: {
      id: string;
      type: string;
      path: string;
    };
    profile: {
      id: string;
      type: string;
      path: string;
    };
    currency: {
      id: string;
      code: string;
      symbol: string;
    };
    timetable: Array<{
      id: string;
      company_id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      timezone: string;
    }>;
    services_by_catalogue: Array<{
      catalogue: {
        id: string;
        name: string;
      };
      services: Array<ServiceResponse>;
    }>;
    contact_method: Array<{
      id: string;
      type: string;
      value: string;
      is_primary: boolean;
    }>;
    campaigns: {
      [key: string]: Array<{
        id: string;
        name: string;
        description: string;
        trigger_frequency: number;
        message_template: string;
        active: boolean;
        type: string;
        features: Array<{
          feature_id: string;
          feature_name: string;
          feature_description: string;
          feature_cap: number;
          usage: number;
        }> | null;
      }>;
    } | null;
    financial: {
      daily: {
        total_revenue: number;
        total_count: number;
        most_used_payment_method: string | null;
        most_used_service: string | null;
        new_customer: number;
      };
      weekly: {
        total_revenue: number;
        total_count: number;
        breakdown: Array<{
          date_full: string;
          total_revenue: number;
          total_count: number;
          most_used_payment_method: string | null;
          most_used_service: string | null;
          new_customer: number;
        }>;
      };
      monthly: {
        total_revenue: number;
        total_count: number;
        breakdown: Array<{
          month: string;
          total_revenue: number;
          total_count: number;
          most_used_payment_method: string | null;
          most_used_service: string | null;
          new_customer: number;
        }>;
      };
    };
  };
  bookings: Array<BookingResponse> | null;
}

export interface BookingResponse {
  id: string;
  customer: {
    id: string;
    personal_information: {
      first_name: string;
      last_name: string;
      date_of_birth: string | null;
      gender: string | null;
    };
    notes: string | null;
    profile_image: {
      id: string;
      type: string;
      path: string;
    } | null;
    contact_method: Array<{
      id: string;
      type: string;
      value: string;
      is_primary: boolean;
    }> | null;
  };
  staff: {
    id: string;
    personal_information: {
      first_name: string;
      last_name: string;
      date_of_birth: string | null;
      gender: string | null;
    };
    profile_image: {
      id: string;
      type: string;
      path: string;
    } | null;
    contact_method: Array<{
      id: string;
      type: string;
      value: string;
      is_primary: boolean;
    }> | null;
  } | null;
  services: ServiceResponse[] | null;
  status: {
    id: string;
    name: string;
    description: string;
    created_at: string;
  };
  start_time: string;
  end_time: string;
}

export interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

// Function to handle login
async function handleLogin(username: string, password: string): Promise<LoginResponse | null> {
  try {
    const response: LoginResponse = await invoke('login', {
      username: username,
      password: password,
      refresh: false
    })
    console.log('Login successful:', response)
    return response;
  } catch (error) {
    alert('Login failed')
    console.error('Login failed:', error)
    return null;
  }
}

const SSOLogin = () => {
  const router = useRouter();
  const { setAuthentication } = useAppContext();
  const [isSpinning, setIsSpinning] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSSOLogin = async (provider: string) => {
    setIsSpinning(true);
    const redirectUri = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // if (userType === "founder") {
    //   window.location.href = `https://metaloot-cloud-d4ec.shuttle.app/v1/api/player/oauth/${provider}?redirect_uri=${redirectUri}/dashboard/oauth/callback/founder`;
    // } else {
    //   window.location.href = `https://metaloot-cloud-d4ec.shuttle.app/v1/api/player/oauth/${provider}?redirect_uri=${redirectUri}/dashboard/oauth/callback/distributor`;
    // }
  };

  const handleLoginSubmit = async (username: string, password: string) => {
    const response = await handleLogin(username, password);
    if (response?.company.id) {
      // setAuthentication(response);
      router.push('/');
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-8 max-w-md w-full px-6">
        {/* Logo Circle with minimal design */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-black border border-gray-200 rounded-full 
                        flex items-center justify-center relative z-10 shadow-sm">
            <img
              src="/moosyLogo.png"
              alt="MetaLoot Logo"
              className={`w-full h-full rounded-full ${isSpinning ? 'animate-spin' : ''}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-gray-500 text-sm tracking-wider">Welcome to</h2>
          <h1 className="text-black text-4xl font-light tracking-wider">Moosy</h1>
          <p className="text-gray-600 text-lg">Book, Manage & Optimize Your Space</p>
        </div>

        <div className="space-y-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-md
                      text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-md
                      text-gray-800 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
          <button
            onClick={() => handleLoginSubmit(username, password)}
            className="w-full px-5 py-3 bg-black rounded-md text-white 
                      hover:bg-gray-800 transition-all duration-200"
          >
            Login
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => handleSSOLogin('google')}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-md
                     text-gray-800 hover:bg-gray-50 hover:border-gray-300
                     transition-all duration-200 flex items-center justify-center gap-3"
          >
            <FcGoogle className="text-xl" />
            <span>Google</span>
          </button>

          <button
            onClick={() => handleSSOLogin('apple')}
            className="w-full px-5 py-3 bg-white border border-gray-200 rounded-md
                     text-gray-800 hover:bg-gray-50 hover:border-gray-300
                     transition-all duration-200 flex items-center justify-center gap-3"
          >
            <BsApple className="text-xl" />
            <span>Apple</span>
          </button>
        </div>

        <div className="text-xs text-gray-500 mt-8">
          By proceeding, you agree to our{' '}
          <span className="text-gray-700 hover:text-black cursor-pointer transition-colors">Terms</span>{' '}
          &{' '}
          <span className="text-gray-700 hover:text-black cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </div>
  );
};

export default SSOLogin;
