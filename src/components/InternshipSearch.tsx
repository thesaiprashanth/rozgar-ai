import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Grid,
  List as ListIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  collection,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

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

export const InternshipSearch = ({ user }: { user: any }) => {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedMinistry, setSelectedMinistry] = useState('All Ministries');
  const [selectedDuration, setSelectedDuration] = useState('Any Duration');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedJob, setSelectedJob] = useState<Internship | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'internships'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Internship[];

        setInternships(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const locations = useMemo(() => {
    return [...new Set(internships.map((job) => job.location))];
  }, [internships]);

  const ministries = useMemo(() => {
    return [...new Set(internships.map((job) => job.ministry))];
  }, [internships]);

  const filteredInternships = useMemo(() => {
    return internships.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.ministry.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === 'All Locations' ||
        job.location === selectedLocation;

      const matchesMinistry =
        selectedMinistry === 'All Ministries' ||
        job.ministry === selectedMinistry;

      const matchesDuration =
        selectedDuration === 'Any Duration' ||
        job.duration === selectedDuration;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesMinistry &&
        matchesDuration
      );
    });
  }, [
    internships,
    searchTerm,
    selectedLocation,
    selectedMinistry,
    selectedDuration,
  ]);

  const applyForInternship = async (job: Internship) => {
    try {
      await addDoc(collection(db, 'applications'), {
        userId: user?.uid,
        title: job.title,
        ministry: job.ministry,
        location: job.location,
        duration: job.duration,
        status: 'Under Review',
        createdAt: new Date(),
      });

      alert('Application marked successfully');
    } catch (error) {
      console.error('Error applying:', error);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Internship Search
        </h1>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filters (unchanged) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter keywords..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option>All Locations</option>
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ministry
            </label>
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option>All Ministries</option>
              {ministries.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            >
              <option>Any Duration</option>
              <option>1 Month</option>
              <option>2 Months</option>
              <option>3 Months</option>
              <option>6 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* JOB LIST */}
      <div className="space-y-4">
        {filteredInternships.map((job, i) => (
          <motion.div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md cursor-pointer"
          >
            <h3 className="font-bold">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.ministry}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedJob && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    onClick={() => setSelectedJob(null)}
  >
    <div
      className="bg-white w-full max-w-2xl rounded-2xl p-6 relative shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setSelectedJob(null)}
        className="absolute top-4 right-4 text-slate-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        {selectedJob.title}
      </h2>

      <p className="text-slate-500 mb-4">
        {selectedJob.ministry}
      </p>

      {/* BASIC INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
        <div><strong>Location:</strong> {selectedJob.location}</div>
        <div><strong>Duration:</strong> {selectedJob.duration}</div>

        {selectedJob.stipend && (
          <div><strong>Stipend:</strong> {selectedJob.stipend}</div>
        )}

        {selectedJob.eligibility && (
          <div><strong>Eligibility:</strong> {selectedJob.eligibility}</div>
        )}
      </div>

      {/* DESCRIPTION */}
      {selectedJob.description && (
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900 mb-1">
            Description
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {selectedJob.description}
          </p>
        </div>
      )}

      {/* 🔥 AUTO RENDER EXTRA FIELDS */}
      <div className="space-y-2 text-sm text-slate-600">
        {Object.entries(selectedJob).map(([key, value]) => {
          // skip already shown fields
          if (
            ['id','title','ministry','location','duration','description','stipend','eligibility','link']
              .includes(key)
          ) return null;

          if (!value) return null;

          return (
            <div key={key}>
              <strong className="capitalize">{key}:</strong>{' '}
              {String(value)}
            </div>
          );
        })}
      </div>

      {/* APPLY BUTTON ONLY */}
      <div className="mt-6">
        {selectedJob.link ? (
          <button
            onClick={() => window.open(selectedJob.link, '_blank')}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm w-full"
          >
            Apply on Official Website
          </button>
        ) : (
          <div className="text-center text-sm text-red-500">
            No application link available
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};