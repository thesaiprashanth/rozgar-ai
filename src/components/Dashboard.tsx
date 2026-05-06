import React, { useEffect, useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getDocs } from 'firebase/firestore';

interface Internship {
  id: string;
  title: string;
  ministry: string;
  location: string;
  duration: string;
  description?: string;
  stipend?: string;
  eligibility?: string;
  link?: string;
}

interface Application {
  id: string;
  title: string;
  ministry: string;
  status: string;
}

export const Dashboard = ({ user }: { user: any }) => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Internship | null>(null);
  

  useEffect(() => {
    const unsubscribeInternships = onSnapshot(
      collection(db, 'internships'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Internship[];

        setInternships(data);
      }
    );

    let unsubscribeApplications = () => {};

    if (user?.uid) {
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('userId', '==', user.uid)
      );

      unsubscribeApplications = onSnapshot(
        applicationsQuery,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Application[];

          setApplications(data);
        }
      );
    }

    return () => {
      unsubscribeInternships();
      unsubscribeApplications();
    };
  }, [user]);

  const applyForInternship = async (job: Internship) => {
  try {
    // 🔥 Check if already applied
    const existingQuery = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      where('title', '==', job.title),
      where('ministry', '==', job.ministry)
    );

    const snapshot = await getDocs(existingQuery);

    if (!snapshot.empty) {
      console.log("⚠️ Already applied");
      return; // ❌ STOP DUPLICATE
    }

    // ✅ Only add if not exists
    await addDoc(collection(db, 'applications'), {
      userId: user.uid,
      title: job.title,
      ministry: job.ministry,
      status: 'Under Review',
      createdAt: new Date(),
    });

  } catch (error) {
    console.error('Error applying:', error);
  }
};

  const stats = [
    {
      label: 'Matches Found',
      value: internships.length,
      icon: Search,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Available Internships',
      value: internships.length,
      icon: Building2,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Applications Submitted',
      value: applications.length,
      icon: CheckCircle2,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  const recommendations = internships.slice(0, 3);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name || 'Sai'}
        </h1>
        <p className="text-slate-500 mt-1 italic font-serif">
          Explore Internships Tailored to Your Skills and Interests
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Relevant Jobs
            </h2>
          </div>

          <div className="space-y-4">
            {recommendations.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {job.ministry}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      applyForInternship(job);
                    }}
                    className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                  >
                    Mark as Applied
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">
            Application Status
          </h2>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            {applications.map((app, i) => (
              <div
                key={app.id}
                className={cn(
                  'p-6 flex items-center justify-between',
                  i !== applications.length - 1 &&
                    'border-b border-slate-50'
                )}
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    {app.title}
                  </h4>

                  <p className="text-xs text-slate-500">{app.ministry}</p>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded',
                    app.status === 'Shortlisted'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-orange-600 bg-orange-50'
                  )}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-xl"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedJob.title}
              </h2>

              <p className="text-slate-500 mb-4">
                {selectedJob.ministry}
              </p>

              <div className="space-y-3 text-sm text-slate-600">
                <div><strong>Location:</strong> {selectedJob.location}</div>
                <div><strong>Duration:</strong> {selectedJob.duration}</div>

                {selectedJob.stipend && (
                  <div><strong>Stipend:</strong> {selectedJob.stipend}</div>
                )}

                {selectedJob.eligibility && (
                  <div><strong>Eligibility:</strong> {selectedJob.eligibility}</div>
                )}

                <div>
                  <strong>Description:</strong>
                  <p className="mt-1 text-slate-500">
                    {selectedJob.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                {selectedJob.link && (
                  <a
                    href={selectedJob.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm"
                  >
                    Apply on Official Site
                  </a>
                )}

                <button
                  onClick={() => applyForInternship(selectedJob)}
                  className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm"
                >
                  Mark as Applied
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};