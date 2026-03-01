// ─── CCPC Admissions Data ─────────────────────────────────────────────────

export interface Student {
  id: number;
  name: string;
  section?: string;
  institution: string;
  shortName: string;
  examType: "Medical" | "BUET";
  year: 2024 | 2025;
  department?: string;
  rank?: number;
  rollNo?: string;
  quota?: string;
  version?: string;
  highlight?: string;
  isSubmitted?: boolean;
}

// ─── HSC 2025 Medical Admissions ──────────────────────────────────────────
export const medical2025: Student[] = [
  {
    id: 1,
    name: "Dedat",
    section: "F",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 2,
    name: "Nuraj",
    section: "F",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 3,
    name: "Protikkha Mozumdar",
    section: "H",
    institution: "Mymensingh Medical College",
    shortName: "MMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 4,
    name: "Sadman Sakib",
    section: "H",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 5,
    name: "Ahdora",
    section: "F",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 6,
    name: "Salma",
    section: "E",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 7,
    name: "Soha",
    section: "E",
    institution: "MAG Osmani Medical College, Sylhet",
    shortName: "SOMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 8,
    name: "Jubaida Nur Rikha",
    section: "C",
    institution: "Jamalpur Medical College",
    shortName: "JMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 9,
    name: "Syeda Sadia",
    section: "A",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 10,
    name: "Hamid Hasan",
    section: "E",
    institution: "Chandpur Medical College",
    shortName: "ChMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 11,
    name: "Nahian",
    section: "C",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 12,
    name: "Sayeda Sadia",
    section: "A",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 13,
    name: "Adnan Sami",
    section: "-",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 14,
    name: "Shuvo Prio Chakma",
    section: "-",
    institution: "TBD (Tribal Quota)",
    shortName: "TBD",
    examType: "Medical",
    year: 2025,
    quota: "Tribal",
  },
  {
    id: 15,
    name: "Nazrul",
    section: "B",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 16,
    name: "Tanjil Shamir",
    section: "F",
    institution: "Shahid Mansur Ali Medical College",
    shortName: "SMAMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 17,
    name: "Ramin",
    section: "H",
    institution: "Dinajpur Medical College",
    shortName: "DiMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 18,
    name: "Sian",
    section: "H",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 19,
    name: "Nishan",
    section: "C",
    institution: "Rangamati Medical College",
    shortName: "RaMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 20,
    name: "Sujana Kulsum Juhi",
    section: "B",
    institution: "Chandpur Medical College",
    shortName: "ChMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 21,
    name: "Raisa",
    section: "H",
    institution: "MAG Osmani Medical College, Sylhet",
    shortName: "SOMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 22,
    name: "Fabiha Mubasshira",
    section: "H",
    institution: "Chandpur Medical College",
    shortName: "ChMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 23,
    name: "Mrittika",
    section: "F",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 24,
    name: "Farah Binte Nasir",
    section: "F",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 25,
    name: "Jamian",
    section: "H",
    institution: "Sir Salimullah Medical College",
    shortName: "SSMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 26,
    name: "Samin Yesar",
    section: "H",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 27,
    name: "Suraiya Ashfaque",
    section: "F",
    institution: "CMC Dental",
    shortName: "CMCD",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 28,
    name: "Sujana",
    section: "B",
    institution: "Chandpur Medical College",
    shortName: "ChMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 29,
    name: "Afsa",
    section: "-",
    institution: "Cumilla Medical College",
    shortName: "CuMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 30,
    name: "Nazrul",
    section: "-",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 31,
    name: "Maruf",
    section: "D",
    institution: "Rangamati Medical College",
    shortName: "RaMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 32,
    name: "Arpita Chakma",
    section: "-",
    institution: "TBD (Tribal Quota)",
    shortName: "TBD",
    examType: "Medical",
    year: 2025,
    quota: "Tribal",
  },
  {
    id: 33,
    name: "Aditya Chakma",
    section: "-",
    institution: "TBD (Tribal Quota)",
    shortName: "TBD",
    examType: "Medical",
    year: 2025,
    quota: "Tribal",
  },
  {
    id: 34,
    name: "Lubna",
    section: "A",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2025,
  },
  {
    id: 35,
    name: "Srabon Nandi",
    section: "D",
    institution: "Shahid Syed Nazrul Islam Medical College",
    shortName: "SSNIMC",
    examType: "Medical",
    year: 2025,
    rollNo: "4066",
  },
  {
    id: 36,
    name: "Tanrum Nur Seeam",
    section: "C",
    institution: "Dhaka Medical College",
    shortName: "DHMC",
    examType: "Medical",
    year: 2025,
    rank: 143,
    highlight: "National Rank 143 — Dhaka Medical College",
  },
];

// ─── HSC 2024 BUET Admissions ─────────────────────────────────────────────
export const buet2024: Student[] = [
  {
    id: 101,
    name: "Sadman Nuheen",
    section: "F",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "EEE",
    rank: 277,
  },
  {
    id: 102,
    name: "Tanzil Kabir",
    section: "G",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "ME",
    rank: 481,
  },
  {
    id: 103,
    name: "Mushfiqur Rahman Mahir",
    section: "G",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "ME",
    rank: 406,
  },
  {
    id: 104,
    name: "Rafsan Adhiyan Chowdhury",
    section: "H",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "Chemical Engineering",
  },
  {
    id: 105,
    name: "Samin Yeasar",
    section: "-",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "Civil Engineering",
    rank: 624,
  },
  {
    id: 106,
    name: "Nazmus Sakib",
    section: "A",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "Civil Engineering",
    rank: 412,
  },
  {
    id: 107,
    name: "Sadril Wasid",
    section: "E",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "ME",
    rank: 557,
  },
  {
    id: 108,
    name: "Md. Abir Hussain",
    section: "F",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "NCE",
    rank: 1156,
  },
  {
    id: 109,
    name: "Atanu Dasgupta",
    section: "-",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    department: "NCE",
    rank: 1163,
  },
  {
    id: 110,
    name: "Humaira",
    section: "G",
    institution: "BUET",
    shortName: "BUET",
    examType: "BUET",
    year: 2024,
    rank: 1301,
  },
];

// ─── HSC 2024 Medical Admissions ──────────────────────────────────────────
export const medical2024: Student[] = [
  {
    id: 201,
    name: "Meherin Islam Samia",
    rollNo: "14",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 202,
    name: "Roksana Akter",
    rollNo: "41",
    institution: "Rangpur Medical College",
    shortName: "RgMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 203,
    name: "Muntasir Ahamad",
    rollNo: "93",
    institution: "Shaheed Ziaur Rahman Medical College",
    shortName: "SZRMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 204,
    name: "Nahid Ahmed Chowdhury",
    rollNo: "132",
    institution: "Gopalganj Medical College",
    shortName: "GpMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 205,
    name: "Mohammed Irfan",
    rollNo: "248",
    institution: "BSMMU Faridpur",
    shortName: "BSMMUF",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 206,
    name: "Ayesha Tabassum",
    rollNo: "301",
    institution: "Cumilla Medical College",
    shortName: "CuMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 207,
    name: "Mamaliya Sarker Meethee",
    rollNo: "315",
    institution: "Sir Salimullah Medical College",
    shortName: "SSMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 208,
    name: "Shah Md. Sadikul Islam",
    rollNo: "482",
    institution: "MAG Osmani Medical College, Sylhet",
    shortName: "SOMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 209,
    name: "Zaria Zaheen",
    rollNo: "501",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 210,
    name: "Nazia",
    rollNo: "516",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 211,
    name: "Azmain Itiad",
    rollNo: "548",
    institution: "Suhrawardi Medical College",
    shortName: "SuMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 212,
    name: "Abu Bakr Wasi",
    rollNo: "596",
    institution: "MAG Osmani Medical College, Sylhet",
    shortName: "SOMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 213,
    name: "Jawwad Ahnaf",
    rollNo: "600",
    institution: "Sir Salimullah Medical College",
    shortName: "SSMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 214,
    name: "Sawban Bin Hossain Chowdhury",
    rollNo: "645",
    institution: "Sir Salimullah Medical College",
    shortName: "SSMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 215,
    name: "Aminul Islam Rafi",
    rollNo: "655",
    institution: "Dhaka Medical College",
    shortName: "DHMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 216,
    name: "Muhtasim Hasan",
    rollNo: "680",
    institution: "Dhaka Medical College",
    shortName: "DHMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 217,
    name: "Rawad Chowdhury",
    rollNo: "685",
    institution: "Dhaka Medical College",
    shortName: "DHMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 218,
    name: "Shifa",
    section: "A",
    institution: "Chandpur Medical College",
    shortName: "ChMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 219,
    name: "Fatema",
    section: "A",
    institution: "Naogaon Medical College",
    shortName: "NMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 220,
    name: "Nasifa",
    section: "G",
    institution: "Chattogram Medical College",
    shortName: "CMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 221,
    name: "Afsana Nahar Chy",
    section: "F",
    institution: "Cox's Bazar Medical College",
    shortName: "CBMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 222,
    name: "Jannatul Ferdous",
    section: "F",
    institution: "Faridpur Medical College",
    shortName: "FMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 223,
    name: "Abrar",
    section: "F",
    institution: "Rangamati Medical College",
    shortName: "RaMC",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 224,
    name: "Sumaiya Jannat",
    rollNo: "322",
    institution: "BSMMU Sunamganj",
    shortName: "BSMMUG",
    examType: "Medical",
    year: 2024,
  },
  {
    id: 225,
    name: "Nujahat Mawa",
    section: "B",
    institution: "Rangamati Medical College",
    shortName: "RaMC",
    examType: "Medical",
    year: 2024,
  },
];

// ─── All Students Combined ────────────────────────────────────────────────
export const allStudents: Student[] = [
  ...medical2025,
  ...buet2024,
  ...medical2024,
];

// ─── College Comparison Data ──────────────────────────────────────────────
export interface CollegeComparison {
  college: string;
  city: string;
  buet2025Est: number;
  medical2025Est: number;
  isHighlighted?: boolean;
}

export const collegeComparisons: CollegeComparison[] = [
  {
    college: "Notre Dame College",
    city: "Dhaka",
    buet2025Est: 85,
    medical2025Est: 120,
    isHighlighted: false,
  },
  {
    college: "Dhaka College",
    city: "Dhaka",
    buet2025Est: 72,
    medical2025Est: 95,
    isHighlighted: false,
  },
  {
    college: "Rajshahi College",
    city: "Rajshahi",
    buet2025Est: 45,
    medical2025Est: 60,
    isHighlighted: false,
  },
  {
    college: "CCPC",
    city: "Chattogram",
    buet2025Est: 10,
    medical2025Est: 36,
    isHighlighted: true,
  },
  {
    college: "Chittagong College",
    city: "Chattogram",
    buet2025Est: 22,
    medical2025Est: 28,
    isHighlighted: false,
  },
  {
    college: "Govt. City College",
    city: "Chattogram",
    buet2025Est: 18,
    medical2025Est: 22,
    isHighlighted: false,
  },
  {
    college: "BAF Shaheen",
    city: "Dhaka",
    buet2025Est: 14,
    medical2025Est: 25,
    isHighlighted: false,
  },
  {
    college: "Sylhet Govt. College",
    city: "Sylhet",
    buet2025Est: 12,
    medical2025Est: 18,
    isHighlighted: false,
  },
];

// ─── Helper: Institution stats ────────────────────────────────────────────
export function getInstitutionStats(students: Student[]) {
  const map = new Map<string, number>();
  for (const s of students) {
    map.set(s.shortName, (map.get(s.shortName) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSectionStats(students: Student[]) {
  const map = new Map<string, number>();
  for (const s of students) {
    const sec = s.section ?? "-";
    if (sec !== "-")
      map.set(`Section ${sec}`, (map.get(`Section ${sec}`) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getDeptStats(students: Student[]) {
  const map = new Map<string, number>();
  for (const s of students) {
    if (s.department) {
      map.set(s.department, (map.get(s.department) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
