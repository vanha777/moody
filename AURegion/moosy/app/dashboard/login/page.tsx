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
  bookings: Array<BookingResponse>;
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
  service: ServiceResponse;
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
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="text-center space-y-8">
        {/* Logo Circle with Glow Effect */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-white border border-gray-200 rounded-full 
                        flex items-center justify-center relative z-10 shadow-lg">
            <img
              src="/apple.png"
              alt="MetaLoot Logo"
              className={`w-20 h-20 ${isSpinning ? 'animate-spin' : ''}`}
            />
          </div>
          {/* Glowing effect behind the circle */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 
                        blur-xl rounded-full transform scale-150 -z-0"></div>
        </div>

        <div className="space-y-2">
          <h2 className="text-gray-600 text-sm tracking-wider">Welcome to</h2>
          <h1 className="text-gray-800 text-5xl font-light tracking-wider">CoLaunch</h1>
          <p className="text-gray-500 text-xl">Share Ideas, Connect & Find Partners</p>
        </div>

        <div className="space-y-4 w-80">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg
                      text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg
                      text-gray-600 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
          />
          <button
            onClick={() => handleLoginSubmit(username, password)}
            className="w-full px-6 py-3 bg-blue-500 rounded-lg text-white 
                      hover:bg-blue-600 transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={() => handleSSOLogin('google')}
            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg
                     text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:shadow-md
                     transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSSOLogin('apple')}
            className="w-full px-6 py-3 bg-white border border-gray-200 rounded-lg
                     text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:shadow-md
                     transition-all duration-300 flex items-center justify-center gap-3"
          >
            <BsApple className="text-xl" />
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="text-sm text-gray-500 mt-8">
          By proceeding, you agree to our{' '}
          <span className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">Terms</span>{' '}
          &{' '}
          <span className="text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </div>
  );
};

export default SSOLogin;
