import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase';
import { Navbar, Sidebar } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { InternshipSearch } from './components/InternshipSearch';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Recommendations } from './components/Recommendations';
import { seedInternships } from './seedInternships';
import Applications from './components/Applications';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   seedInternships();
// }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar user={user} />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard user={user} />}
                />

                <Route
                  path="/search"
                  element={<InternshipSearch user={user} />}
                />

                <Route
                  path="/recommendations"
                  element={<Recommendations user={user} />}
                />

                <Route
                  path="/profile"
                  element={<Profile user={user} />}
                />

              <Route
  path="/applications"
  element={<Applications user={user} />}
/>

                <Route
                  path="/settings"
                  element={
                    <div className="p-8 text-slate-500 italic">
                      Settings view coming soon...
                    </div>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}