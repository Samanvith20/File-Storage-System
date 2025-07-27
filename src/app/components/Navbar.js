'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useuserdetails from '../hooks/useuserdetails';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const [user, setUser] = useState(null);
  console.log(user)
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userDetails = await useuserdetails();
        console.log("Fetched user details:", userDetails);
         if(!userDetails) {
           toast.error('User details not found');
          // redirect to signIn if user details are not found
          router.push('/signin');
         }

        setUser(userDetails);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST',
        credentials: 'include',
     });
    toast.success('Logged out successfully');
    setUser(null);
    router.push('/signin');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center text-white">
    <Toaster/>
      <h1 className="text-lg font-bold">Cloud Files</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">👤 {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm rounded-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <span className="text-sm text-slate-400">Loading user...</span>
      )}
    </nav>
  );
}
