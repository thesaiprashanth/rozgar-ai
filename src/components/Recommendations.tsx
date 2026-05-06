import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { recommendInternships } from '../services/resumeRecommendation';
import {
  Building2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Recommendations = ({ user }: { user: any }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError('');

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setError('No user profile found.');
          setLoading(false);
          return;
        }

        const userData = userSnap.data();

        const internshipSnapshot = await getDocs(
          collection(db, 'internships')
        );

        const internships = internshipSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let recommended: any[] = [];

        // 🔥 FIX: USE KEYWORDS INSTEAD OF RAW RESUME
        if (userData.keywords && userData.keywords.length > 0) {
          recommended = recommendInternships(
            userData.keywords.join(' '),
            internships as any
          );
        }

        // 🔥 FALLBACK: ONLY IF NO KEYWORDS
        if (
          (!recommended || recommended.length === 0) &&
          (!userData.keywords || userData.keywords.length === 0)
        ) {
          recommended = internships.slice(0, 6).map((job: any, index) => ({
            ...job,
            score: 9 - index,
          }));
        }

        setMatches(recommended);
      } catch (err) {
        setError('Something went wrong while generating recommendations.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;

  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
        <Sparkles className="w-9 h-9 text-orange-500" />
        AI Recommendations
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((job, index) => {
          const score = Math.min((job.score || 1) * 10, 100);

          return (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {job.title}
                  </h2>
                  <p className="text-slate-500 mt-1">
                    {job.ministry}
                  </p>
                </div>

                <div className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-2 rounded-full">
                  #{index + 1} Match
                </div>
              </div>

              <div className="flex gap-4 text-sm text-slate-500 mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {job.duration}
                </div>
              </div>

              <p className="text-slate-600 mb-5">
                {job.description}
              </p>

              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500"
                  style={{ width: `${score}%` }}
                />
              </div>

              <div className="mt-6 flex justify-between">
                <span className="text-xs text-emerald-600">
                  Recommended
                </span>

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-sm"
                  >
                    View & Apply
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔥 POPUP */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl max-w-xl w-full"
            >
              <h2 className="text-xl font-bold">{selectedJob.title}</h2>
              <p className="text-slate-500">{selectedJob.ministry}</p>

              <p className="mt-4 text-sm text-slate-600">
                {selectedJob.description}
              </p>

              <div className="mt-4 space-y-1 text-sm">
                <div><b>Location:</b> {selectedJob.location}</div>
                <div><b>Duration:</b> {selectedJob.duration}</div>
                {selectedJob.stipend && (
                  <div><b>Stipend:</b> {selectedJob.stipend}</div>
                )}
              </div>

              <div className="mt-6">
                {selectedJob.link && (
                  <a
                    href={selectedJob.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl"
                  >
                    Apply on Official Site
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};