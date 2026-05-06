import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  XCircle,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

interface Application {
  id: string;
  title: string;
  ministry: string;
  location?: string;
  duration?: string;
  status: string;
  createdAt?: {
    seconds: number;
  };
}

export default function Applications({ user }: { user: any }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  useEffect(() => {
    if (!user?.uid) return;

    const applicationsQuery = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Application[];

      // 🔥 REMOVE DUPLICATES (by title + ministry)
      const uniqueMap = new Map();
      data.forEach((app) => {
        const key = `${app.title}-${app.ministry}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, app);
        }
      });

      setApplications(Array.from(uniqueMap.values()));
    });

    return () => unsubscribe();
  }, [user]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.ministry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All Statuses' || app.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  const stats = [
    {
      label: 'Applications Submitted',
      value: applications.length,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Under Review',
      value: applications.filter((a) => a.status === 'Under Review').length,
      icon: Clock3,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Shortlisted',
      value: applications.filter((a) => a.status === 'Shortlisted').length,
      icon: CheckCircle2,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Rejected',
      value: applications.filter((a) => a.status === 'Rejected').length,
      icon: XCircle,
      color: 'bg-red-100 text-red-600',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Rejected':
        return 'bg-red-50 text-red-600 border border-red-100';
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-100';
    }
  };

  // 🔥 UPDATE STATUS
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-2 text-slate-500 text-lg">
          Track the progress of your Rozgar AI internship applications.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`p-4 rounded-2xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>

            <div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by internship or ministry..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-slate-700"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700"
          >
            <option>All Statuses</option>
            <option>Under Review</option>
            <option>Shortlisted</option>
            <option>Rejected</option>
          </select>
        </div>

        {/* APPLICATION LIST */}
        <div className="space-y-5">
          {filteredApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {application.title}
                    </h2>
                    <p className="text-slate-500">
                      {application.ministry}
                    </p>
                  </div>
                </div>

                {/* 🔥 DROPDOWN STATUS (INLINE) */}
                <select
                  value={application.status}
                  onChange={(e) =>
                    updateStatus(application.id, e.target.value)
                  }
                  className={`text-xs font-bold px-4 py-2 rounded-full ${getStatusStyle(application.status)}`}
                >
                  <option>Under Review</option>
                  <option>Shortlisted</option>
                  <option>Rejected</option>
                  <option>Selected</option>
                </select>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}