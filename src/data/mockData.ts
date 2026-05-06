import { Internship } from '../types';

export const MINISTRIES = [
  "Ministry of Information & Broadcasting",
  "Ministry of Statistics & Programme Implementation",
  "Ministry of Electronics & IT",
  "Ministry of Law & Justice",
  "Ministry of External Affairs",
  "Ministry of Finance",
  "Ministry of Environment, Forest & Climate Change",
  "Ministry of Rural Development",
  "Ministry of Health & Family Welfare",
  "Ministry of Education"
];

export const LOCATIONS = [
  "New Delhi",
  "Bangalore",
  "Mumbai",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Remote"
];

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "1",
    title: "Digital Marketing Internship",
    ministry: "Ministry of Information & Broadcasting",
    location: "New Delhi",
    duration: "2 Months",
    category: "Marketing",
    status: "Available",
    description: "Support digital outreach and social media management for government initiatives."
  },
  {
    id: "2",
    title: "Data Analysis Internship",
    ministry: "Ministry of Statistics & Programme Implementation",
    location: "Bangalore",
    duration: "3 Months",
    category: "Data Science",
    status: "Available",
    description: "Analyze large datasets to derive insights for national policy making."
  },
  {
    id: "3",
    title: "Cybersecurity Internship",
    ministry: "Ministry of Electronics & IT",
    location: "New Delhi",
    duration: "3 Months",
    category: "IT",
    status: "Available",
    description: "Assist in monitoring and securing government digital infrastructure."
  },
  {
    id: "4",
    title: "Public Policy Internship",
    ministry: "Ministry of Law & Justice",
    location: "New Delhi",
    duration: "3 Months",
    category: "Legal",
    status: "Available",
    description: "Research and draft policy recommendations for legal reforms."
  },
  {
    id: "5",
    title: "Software Development Internship",
    ministry: "Ministry of Electronics & IT",
    location: "Bangalore",
    duration: "3 Months",
    category: "IT",
    status: "Available",
    description: "Develop and maintain internal portals for government services."
  },
  {
    id: "6",
    title: "Journalism Internship",
    ministry: "Ministry of Information & Broadcasting",
    location: "Mumbai",
    duration: "3 Months",
    category: "Media",
    status: "Available",
    description: "Content creation and reporting for national news outlets."
  },
  {
    id: "7",
    title: "Environmental Research Internship",
    ministry: "Ministry of Environment, Forest & Climate Change",
    location: "Hyderabad",
    duration: "2 Months",
    category: "Science",
    status: "Available",
    description: "Study climate change impacts and biodiversity conservation."
  },
  {
    id: "8",
    title: "Financial Analysis Internship",
    ministry: "Ministry of Finance",
    location: "Chennai",
    duration: "3 Months",
    category: "Finance",
    status: "Available",
    description: "Support budgetary analysis and economic forecasting."
  },
  {
    id: "9",
    title: "Community Development Internship",
    ministry: "Ministry of Rural Development",
    location: "Pune",
    duration: "3 Months",
    category: "Social Work",
    status: "Available",
    description: "Work on grassroots projects for rural upliftment."
  }
];
