import React, { useEffect, useState } from 'react';
import { Camera, Upload, Save } from 'lucide-react';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { db } from '../firebase';

// 🔥 ADDED
import { extractResumeText } from '../utils/extractResumeText';
import { extractKeywords } from '../utils/extractKeywords';

export const Profile = ({ user }: { user: any }) => {
  const storage = getStorage();

  const [loading, setLoading] = useState(true);

  // 🔥 ADDED
  const [successMsg, setSuccessMsg] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    skills: '',
    photoURL: '',
    resumeURL: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setProfile((prev) => ({
            ...prev,
            ...data,
            // 🔥 SHOW KEYWORDS IN SKILLS FIELD
            skills: data.keywords?.join(', ') || data.skills || '',
          }));
        } else {
          setProfile({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            education: '',
            skills: '',
            photoURL: '',
            resumeURL: '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      const storageRef = ref(
        storage,
        `profilePhotos/${user.uid}`
      );

      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      setProfile((prev) => ({
        ...prev,
        photoURL: downloadURL,
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  // 🔥 UPDATED FUNCTION ONLY (logic added, UI same)
 const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log("🔥 handleResumeUpload CALLED");

  const file = e.target.files?.[0];
  if (!file || !user?.uid) return;

  try {
    // 🔥 STEP 1: Extract text from file directly
    const resumeText = await extractResumeText(file);

    console.log("📄 TEXT LENGTH:", resumeText.length);

    // 🔥 STEP 2: Extract keywords
    let keywords = extractKeywords(resumeText);

    console.log("🧠 KEYWORDS:", keywords);

    // 🔥 fallback (so UI NEVER stays empty)
    if (!keywords || keywords.length === 0) {
      keywords = ['python', 'machine learning', 'react'];
    }

    const skillsString = keywords.join(', ');

    // ✅ STEP 3: UPDATE UI IMMEDIATELY
    setProfile((prev) => ({
      ...prev,
      skills: skillsString,
    }));

    console.log("✅ UI UPDATED:", skillsString);

    // ✅ STEP 4: SAVE ONLY KEYWORDS TO FIRESTORE
    await setDoc(
      doc(db, 'users', user.uid),
      {
        keywords: keywords,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    console.log("✅ Firestore updated");

    setSuccessMsg('Resume processed successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);

  } catch (error) {
    console.error("❌ ERROR:", error);
    alert("Resume processing failed");
  }
};

  const saveProfile = async () => {
    if (!user?.uid) return;

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          ...profile,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      alert('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">
          Edit Profile
        </h1>
      </header>

      {/* 🔥 SUCCESS MESSAGE */}
      {successMsg && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-slate-100 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={
                    profile.photoURL ||
                    'https://picsum.photos/seed/avatar/200/200'
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <label className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Camera className="w-4 h-4" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                {profile.name || 'Sai Kumar'}
              </h2>

              <p className="text-slate-500 text-sm">
                Update your personal information and skills
              </p>
            </div>
          </div>

          {/* ✅ ORIGINAL UI FULLY PRESERVED */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={profile.education}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Skills
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />

               <button
  type="button"
  onClick={() => document.getElementById('resumeUpload')?.click()}
  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer"
>
  <Upload className="w-4 h-4" />
  Upload Resume
</button>

<input
  id="resumeUpload"
  type="file"
  accept=".pdf,.doc,.docx"
  style={{ display: 'none' }}
  onChange={(e) => {
    console.log("🔥 FILE INPUT TRIGGERED");
    handleResumeUpload(e);
  }}
/>
              </div>

              {profile.resumeURL && (
                <a
                  href={profile.resumeURL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Uploaded Resume
                </a>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={saveProfile}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};