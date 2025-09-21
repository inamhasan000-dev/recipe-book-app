import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

const AppLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user?.uid) {
        const userDoc = await getDoc(doc(db, "users", session.user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };
    fetchUsername();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please log in.</p>;

  return (
    <>
      {/* Navbar */}
      <header className="bg-green-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side (Logo) */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">🍴 Recipe Book</h1>
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-white font-medium">
                Welcome,&nbsp;
                {username || session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Sign out
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Bar (Desktop) */}
        <nav className="bg-green-700 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex space-x-8 h-12 items-center">
              <li>
                <Link
                  href="/create"
                  className="text-white font-medium hover:text-yellow-300 transition"
                >
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  className="text-white font-medium hover:text-yellow-300 transition"
                >
                  Manage Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/favourites"
                  className="text-white font-medium hover:text-yellow-300 transition"
                >
                  View Favourites
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <nav className="bg-green-700 md:hidden">
            <ul className="flex flex-col space-y-2 p-4">
              <li>
                <Link
                  href="/create"
                  className="block text-white font-medium hover:text-yellow-300 transition"
                >
                  Create Recipe
                </Link>
              </li>
              <li>
                <Link
                  href="/manage"
                  className="block text-white font-medium hover:text-yellow-300 transition"
                >
                  Manage Recipes
                </Link>
              </li>
              <li>
                <Link
                  href="/favourites"
                  className="block text-white font-medium hover:text-yellow-300 transition"
                >
                  View Favourites
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full bg-white text-green-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Page Content */}
      <main style={{ minHeight: '450px' }}>{children}</main>
      <footer className="bg-green-600 text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Recipe Book. All rights reserved.
          </p>
        </div>
      </footer>

    </>
  );
};

export default AppLayout;
