import React from 'react';
import { Sparkles, Chrome } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      await setDoc(
        doc(db, 'users', result.user.uid),
        {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row"
      >
        <div className="md:w-1/2 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-500 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles className="text-white w-7 h-7" />
              </div>

              <span className="font-bold text-2xl tracking-tight">
                Rozgar AI
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Empowering India's{' '}
                <span className="text-orange-500">Youth</span> Through
                Opportunity.
              </h1>

              <p className="text-slate-400 text-lg max-w-md font-serif italic">
                AI-powered government internship recommendation platform.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-12">
            <p className="text-sm text-slate-500 font-medium">
              Joined by 2,000+ students this month
            </p>
          </div>
        </div>

        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-8 text-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2">
                Sign in with your Google account to continue
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}