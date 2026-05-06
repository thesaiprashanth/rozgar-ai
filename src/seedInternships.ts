import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// 🔥 PASTE YOUR FULL JSON ARRAY HERE
const internships: any[] = [
  {
    "id": "drdo_debel_2026",
    "title": "Graduate Apprentice (Engineering & Science)",
    "ministry": "Ministry of Defence (DRDO - DEBEL)",
    "category": "Engineering / Research",
    "location": "Bangalore",
    "duration": "1 Year",
    "description": "DRDO DEBEL Bengaluru invites applications for Graduate Apprentices under the Apprentices Act with hands-on defence research exposure.",
    "stipend": "₹12,300/month",
    "eligibility": "BE/B.Tech, B.Sc, B.Com, B.Lib",
    "deadline": "20-05-2026",
    "tags": ["engineering","research","defence","drdo"],
    "link": "https://drdo.gov.in/drdo/en/offerings/vacancies/debel-bengaluru-invites-applications-engagement-graduate-apprentices-fy-2026-27"
  },
  {
    "id": "drdo_tbrl_jrf_ra_2026",
    "title": "Junior Research Fellow / Research Associate",
    "ministry": "Ministry of Defence (DRDO - TBRL)",
    "category": "Research / Engineering",
    "location": "Chandigarh",
    "duration": "2–5 Years",
    "description": "DRDO TBRL invites candidates for JRF and RA positions across engineering and science disciplines.",
    "stipend": "₹37,000–₹67,000/month + HRA",
    "eligibility": "BE/B.Tech, ME/M.Tech, PhD",
    "deadline": "Walk-in (April 2026)",
    "tags": ["research","engineering","physics","drdo"],
    "link": "https://drdo.gov.in/drdo/en/offerings/vacancies/tbrl-chandigarh-calls-walk-interview-post-research-associate-junior-research"
  },
  {
    "id": "drdo_inmas_apprentice_2026",
    "title": "Apprentice (Science / Engineering / Pharmacy)",
    "ministry": "Ministry of Defence (DRDO - INMAS)",
    "category": "Research / Life Sciences",
    "location": "Delhi",
    "duration": "1 Year",
    "description": "INMAS DRDO offers apprenticeship training in biomedical and defence research fields.",
    "stipend": "₹9,600–₹12,300/month",
    "eligibility": "B.Sc, B.Pharm, Diploma",
    "deadline": "30-04-2026",
    "tags": ["biology","research","defence"],
    "link": "https://drdo.gov.in/drdo/en/offerings/vacancies/inmas-delhi-invites-application-engagement-apprentics-fy-2026-27"
  },
  {
    "id": "drdo_vrde_jrf_2026",
    "title": "Junior Research Fellowship (JRF)",
    "ministry": "Ministry of Defence (DRDO - VRDE)",
    "category": "Mechanical / Automotive Engineering",
    "location": "Ahilyanagar",
    "duration": "2 Years",
    "description": "VRDE DRDO offers JRF roles focused on automotive and defence systems research.",
    "stipend": "₹37,000/month + HRA",
    "eligibility": "BE/B.Tech, ME/M.Tech with GATE/NET",
    "deadline": "Walk-in (April 2026)",
    "tags": ["mechanical","automobile","engineering","defence"],
    "link": "https://drdo.gov.in/drdo/en/offerings/vacancies/vrde-ahilyanagar-calls-walk-interview-post-junior-research-fellowship-jrf"
  },
  {
    "id": "mea_internship_2026",
    "title": "MEA Internship Programme",
    "ministry": "Ministry of External Affairs",
    "category": "Policy / International Relations",
    "location": "New Delhi",
    "duration": "1–3 Months",
    "description": "Exposure to diplomacy, foreign policy, and global governance.",
    "stipend": "₹10,000/month",
    "eligibility": "UG/PG students",
    "deadline": "Varies",
    "tags": ["policy","diplomacy"],
    "link": "https://www.mea.gov.in/internship-in-mea.htm"
  },
  {
    "id": "nlc_tuticorin_diploma_ec_2026",
    "title": "Diploma Intern – Electronics and Communication",
    "ministry": "Ministry of Coal (NLC Tamil Nadu Power Limited)",
    "category": "Electronics / Engineering",
    "location": "Tuticorin",
    "duration": "9 Months",
    "description": "Internship in power plant electronics systems and engineering operations.",
    "stipend": "₹9,000/month",
    "eligibility": "Diploma in Electronics Engineering",
    "deadline": "25-05-2026",
    "tags": ["electronics","engineering"],
    "link": "https://pminternship.mca.gov.in"
  },
  {
    "id": "nidm_internship_2026",
    "title": "NIDM Internship Programme",
    "ministry": "Ministry of Home Affairs",
    "category": "Disaster Management",
    "location": "India",
    "duration": "2–4 Months",
    "description": "Internship in disaster risk reduction and policy research.",
    "stipend": "₹12,000–₹15,000/month",
    "eligibility": "UG/PG students",
    "deadline": "Varies",
    "tags": ["policy","research"],
    "link": "https://nidm.gov.in/internship.asp"
  },
  {
    "id": "nhai_summer_2026",
    "title": "NHAI Summer Internship",
    "ministry": "Ministry of Road Transport & Highways",
    "category": "Infrastructure / Engineering",
    "location": "India",
    "duration": "2 Months",
    "description": "Internship in highway infrastructure and project management.",
    "stipend": "₹20,000/month",
    "eligibility": "UG/PG students",
    "deadline": "2026",
    "tags": ["civil","engineering"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/nhai-summer-internship-2026"
  },
  {
    "id": "mbbs_mph_2026",
    "title": "MBBS / MPH Internship",
    "ministry": "Government of India",
    "category": "Medical / Public Health",
    "location": "India",
    "duration": "1–2 Months",
    "description": "Internship in healthcare research and clinical exposure.",
    "stipend": "₹35,000",
    "eligibility": "MBBS / MPH students",
    "deadline": "Varies",
    "tags": ["health","medicine"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/mbbs-mph-internship-2026"
  },
  {
    "id": "bose_summer_2026",
    "title": "Satyendra Nath Bose Summer Internship",
    "ministry": "Government of India",
    "category": "Physics / Research",
    "location": "India",
    "duration": "1–2 Months",
    "description": "Physics and science research internship.",
    "stipend": "Varies",
    "eligibility": "Science students",
    "deadline": "Varies",
    "tags": ["physics","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/satyendra-nath-bose-summer-internship"
  },
  {
    "id": "nrei_2026",
    "title": "National Renewable Energy Internship",
    "ministry": "Ministry of New and Renewable Energy",
    "category": "Energy / Sustainability",
    "location": "India",
    "duration": "1–6 Months",
    "description": "Internship focused on renewable energy technologies.",
    "stipend": "Varies",
    "eligibility": "Engineering students",
    "deadline": "Varies",
    "tags": ["energy","sustainability"],
    "link": "https://www.indiascienceandtechnology.gov.in/programme-schemes/human-resource-and-development/national-renewable-energy-internship-nrei-scheme"
  },
  {
    "id": "ngsf_2026",
    "title": "NGSF Internship Program",
    "ministry": "Government of India",
    "category": "Science / Research",
    "location": "India",
    "duration": "2–3 Months",
    "description": "Scientific research internship in geoscience and data analysis.",
    "stipend": "Varies",
    "eligibility": "Science students",
    "deadline": "2026",
    "tags": ["science","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/ngsf-internship-program-2025%E2%80%9326"
  },
  {
    "id": "ncess_2026",
    "title": "NCESS Internship Programme",
    "ministry": "Ministry of Earth Sciences",
    "category": "Earth Science",
    "location": "India",
    "duration": "2–6 Months",
    "description": "Internship in earth science and environmental research.",
    "stipend": "Varies",
    "eligibility": "Science students",
    "deadline": "Varies",
    "tags": ["earth science","environment"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/national-centre-earth-science-studies-internshipdissertation-form-2024"
  },
  {
    "id": "nabi_research_training_2024",
    "title": "NABI Research Training Project",
    "ministry": "Department of Biotechnology",
    "category": "Biotechnology / Research",
    "location": "India",
    "duration": "4–6 Months",
    "description": "Research training program in biotechnology and life sciences.",
    "stipend": "Varies",
    "eligibility": "Biotech students",
    "deadline": "Varies",
    "tags": ["biotechnology","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/nabi-research-training-project-opportunity-4-6-months-july-dec-2024"
  },
  {
    "id": "instrumentation_summer_2026",
    "title": "Summer Internship in Instrumentation",
    "ministry": "Government of India",
    "category": "Electronics / Instrumentation",
    "location": "India",
    "duration": "1–2 Months",
    "description": "Hands-on internship in instrumentation systems.",
    "stipend": "Varies",
    "eligibility": "Electronics students",
    "deadline": "Varies",
    "tags": ["electronics","instrumentation"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/summer-internship-instrumentation"
  },
  {
    "id": "rare_disease_project_2026",
    "title": "Project Intern – Rare Disease Studies",
    "ministry": "Government of India",
    "category": "Medical / Research",
    "location": "India",
    "duration": "2–4 Months",
    "description": "Internship focusing on rare disease research.",
    "stipend": "Varies",
    "eligibility": "Medical students",
    "deadline": "Varies",
    "tags": ["health","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/project-intern-%E2%80%93-qualitative-studies-rare-diseases"
  },
  {
    "id": "gsbtm_summer_2026",
    "title": "GSBTM Summer Research Internship",
    "ministry": "Gujarat State Biotechnology Mission",
    "category": "Biotechnology",
    "location": "Gujarat",
    "duration": "2 Months",
    "description": "Summer research internship in biotechnology.",
    "stipend": "Varies",
    "eligibility": "Biotech students",
    "deadline": "2026",
    "tags": ["biotech","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/gujarat-state-biotechnology-mission-gsbtm-summer-research-internship-program-2026"
  },
  {
    "id": "bits_visri_2026",
    "title": "BITS Pilani VISRI Internship",
    "ministry": "BITS Pilani",
    "category": "Engineering / Research",
    "location": "India",
    "duration": "2 Months",
    "description": "Research internship at BITS Pilani.",
    "stipend": "Varies",
    "eligibility": "UG students",
    "deadline": "2026",
    "tags": ["engineering","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/visiting-summer-research-internship-visri-2026-bits-pilani-%E2%80%8B"
  },
  {
    "id": "iitgn_srip_2026",
    "title": "IIT Gandhinagar SRIP",
    "ministry": "IIT Gandhinagar",
    "category": "Engineering / Research",
    "location": "Gandhinagar",
    "duration": "2 Months",
    "description": "Research internship programme.",
    "stipend": "Varies",
    "eligibility": "UG students",
    "deadline": "2026",
    "tags": ["engineering","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/summer-research-internship-programme-srip-2026-iit-gandhinagar"
  },
  {
    "id": "iisc_cense_2026",
    "title": "IISc CeNSE Research Internship",
    "ministry": "Indian Institute of Science",
    "category": "Nanotechnology / Research",
    "location": "Bangalore",
    "duration": "2 Months",
    "description": "Nanoscience and advanced research internship.",
    "stipend": "Varies",
    "eligibility": "Engineering students",
    "deadline": "2026",
    "tags": ["nanotech","research"],
    "link": "https://www.indiascienceandtechnology.gov.in/internships/cense-research-experience-program-iisc-bengaluru%E2%80%8B"
  }
];

export async function seedInternships() {
  try {
    console.log('🚀 Starting upload...');

    for (const internship of internships) {
      if (!internship.id) {
        console.warn('⚠️ Skipping item without ID:', internship.title);
        continue;
      }

      await setDoc(
        doc(db, 'internships', internship.id), // ✅ use fixed ID
        internship
      );

      console.log(`✅ Uploaded: ${internship.title}`);
    }

    console.log('🎉 All internships uploaded successfully');
  } catch (error) {
    console.error('❌ Failed to seed internships:', error);
  }
}