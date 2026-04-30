import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { collection, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export interface Project {
  id: string;
  title: string;
  problem: string;
  longProblem: string;
  approach: string;
  learning: string;
  tech: string[];
  github: string;
  metrics: Record<string, number>;
  theme: string;
  datasheets: { name: string; link: string }[];
  videoDemo: string;
  category: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  summary: string;
  tags: string[];
  content: string;
}

interface DataStoreContextType {
  projects: Project[];
  blogPosts: BlogPost[];
  addProject: (project: Omit<Project, 'id'>) => void;
  removeProject: (id: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  removeBlogPost: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

// Default projects (these are the hardcoded ones from the original)
const defaultProjects: Project[] = [
  {
    id: 'default-5',
    title: "Real-Time Industrial Process Monitor - ESP32 (Apr 2026)",
    problem: "Modern small-scale industrial setups lack affordable, local real-time monitoring systems.",
    longProblem: "Modern small-scale industrial setups often lack affordable, real-time monitoring systems. Existing solutions depend on cloud infrastructure, dedicated apps, or expensive PLC systems, making them less accessible. There is a need for a lightweight, local, and reliable system that can monitor key parameters like pressure, tank level, and motor performance without internet dependency.",
    approach: "Developed a real-time monitoring system using ESP32 that streams live data over WebSocket to a browser-based dashboard. The system measures pressure, tank level, and motor RPM, and ensures safe operation through hardware-level fail-safes like a normally-closed relay for automatic shutdown during abnormal conditions.",
    learning: "Gained hands-on experience in embedded debugging, real-time communication, and hardware-software integration. Learned practical constraints of sensors, GPIO limitations, and the importance of datasheets in avoiding design mistakes.",
    tech: ['ESP32', 'WebSocket', 'ESPAsyncWebServer', 'ArduinoJson'],
    github: "https://github.com/JOTHIRNADHREDDY/Web-Based-Industrial-Process-Control-System-Using-ESP32",
    metrics: { accuracy: 95, stability: 92, efficiency: 88, responsiveness: 98 },
    theme: "emerald",
    datasheets: [
      { name: "ESP32 DevKit", link: "#" },
      { name: "BTS7960 Motor Driver", link: "#" },
      { name: "HC-SR04 Ultrasonic", link: "#" },
      { name: "BMP280 Pressure", link: "#" },
      { name: "Relay Module (NC)", link: "#" }
    ],
    videoDemo: "",
    category: "Hardware",
  },
  {
    id: 'default-1',
    title: "Semi-Autonomous Weed Detection & Laser Removal Robot (Feb 2026 – Mar 2026)",
    problem: "Inefficient and environmentally harmful chemical weed control in agriculture.",
    longProblem: "Modern agriculture relies heavily on chemical herbicides, leading to environmental degradation, resistant weed strains, and high recurring costs. Manual weeding is labor-intensive and inefficient. This project addresses the need for a sustainable, precision-targeted weed control mechanism that operates semi-autonomously in diverse field conditions.",
    approach: "Developed a real-time targeting system using computer vision to identify and precisely eliminate weeds using a laser mechanism.",
    learning: "Advanced YOLO model deployment on edge devices and high-precision actuator control.",
    tech: ['YOLOv11s', 'ESP32 DevKit', 'Real-time targeting'],
    github: "https://github.com/JOTHIRNADHREDDY/Semi-Autonomous-Weed-Detection-and-Removal-Robot",
    metrics: { accuracy: 95, stability: 88, efficiency: 92 },
    theme: "emerald",
    datasheets: [{ name: "ESP32-WROOM-32D", link: "#" }, { name: "Laser Diode 5W", link: "#" }],
    videoDemo: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Hardware",
  },
  {
    id: 'default-6',
    title: "Smart Basket — AI Grocery Planning App (Nov 2025)",
    problem: "Grocery runs often go sideways due to forgotten items, exceeding budgets, and duplicated purchases.",
    longProblem: "Honestly, the idea came from something pretty relatable \u2014 grocery runs that go sideways. You forget things, go over budget, or end up buying the same stuff twice because someone else in the family already got it. I wanted to build something that actually solves this, not just another list app.",
    approach: "Smart Basket is an AI-powered grocery planning app where you can create and manage shopping lists, track your budget in real time, and share lists with family or roommates. The highlight is an AI assistant named Lova \u2014 type a dish name, and it breaks it down into a categorized grocery list with quantities and estimated prices. The app runs fully in the browser with no dedicated backend.",
    learning: "Supabase's RLS policies don't automatically apply to shared queries, causing silent data access failures. A \u20B90 budget edge case showed how tiny inputs impact dashboard state. Real prompt engineering was required to make the AI return an ingredient list instead of a full recipe, and handling real-time sync with rapid state changes was a complex UI challenge.",
    tech: ['React', 'Tailwind', 'Supabase', 'Lovable.dev', 'OpenAI API'],
    github: "https://github.com/JOTHIRNADHREDDY/smartbasket-list",
    metrics: { accuracy: 95, responsiveness: 98, usability: 90 },
    theme: "purple",
    datasheets: [],
    videoDemo: "",
    category: "AI",
  },
  {
    id: 'default-3',
    title: "Pneumatic Safety Bumper (Oct 2025)",
    problem: "Need for rapid-response mechanical impact absorption in autonomous vehicles.",
    longProblem: "Autonomous vehicles operating in dynamic environments require fail-safe physical intervention mechanisms when software collision avoidance fails.",
    approach: "Designed a pneumatic system using double-acting cylinders triggered by proximity sensors to deploy a physical barrier.",
    learning: "Fluid power systems, mechanical CAD design, and rapid prototyping.",
    tech: ['Double-acting cylinders', 'SolidWorks', 'Pneumatics'],
    github: "#",
    metrics: { accuracy: 90, stability: 98, efficiency: 85 },
    theme: "amber",
    datasheets: [{ name: "SMC Double-Acting Cylinder", link: "#" }, { name: "5/2 Way Solenoid Valve", link: "#" }],
    videoDemo: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Hardware",
  },
  {
    id: 'default-4',
    title: "Manually Controlled Trash Collecting Bot (Apr 2025 – May 2025)",
    problem: "Manual sorting of hazardous and mixed waste materials.",
    longProblem: "Waste segregation is a critical step in recycling, but manual sorting is hazardous, slow, and prone to human error.",
    approach: "Built an automated sorting mechanism using inductive sensors and IoT connectivity for remote monitoring.",
    learning: "Sensor integration, IoT telemetry, and automated mechanical sorting.",
    tech: ['Arduino + ESP32', 'Blynk', 'Metal detection'],
    github: "https://github.com/JOTHIRNADHREDDY/Manually-Controlled-Trash-Collecting-Bot",
    metrics: { accuracy: 88, stability: 90, efficiency: 95 },
    theme: "purple",
    datasheets: [{ name: "LJ12A3-4-Z/BX Inductive Sensor", link: "#" }, { name: "ESP32 NodeMCU", link: "#" }],
    videoDemo: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Hardware",
  },
  {
    id: 'default-2',
    title: "Self-Balancing Robot (Nov 2024 – Dec 2024)",
    problem: "Maintaining stability in two-wheeled robotic platforms under dynamic disturbances.",
    longProblem: "Two-wheeled inverted pendulum robots are inherently unstable and non-linear systems. The primary challenge is to maintain balance while navigating uneven terrain or responding to external forces.",
    approach: "Implemented a closed-loop control system utilizing IMU sensor fusion and proportional-integral-derivative algorithms.",
    learning: "Deep understanding of PID tuning, sensor noise filtering, and real-time motor control.",
    tech: ['Arduino Uno', 'MPU6050', 'PID Control'],
    github: "#",
    metrics: { accuracy: 85, stability: 94, efficiency: 80 },
    theme: "blue",
    datasheets: [{ name: "MPU6050 6-DoF IMU", link: "#" }, { name: "L298N Motor Driver", link: "#" }],
    videoDemo: "https://www.w3schools.com/html/mov_bbb.mp4",
    category: "Hardware",
  }
];

const defaultBlogPosts: BlogPost[] = [
  {
    id: 'default-blog-1',
    slug: 'weed-detection-robot',
    title: 'Building the Semi-Autonomous Weed Detection Robot',
    date: 'Oct 24, 2025',
    readingTime: '5 min read',
    summary: 'A deep dive into deploying YOLOv11s on an edge device for real-time agricultural applications.',
    tags: ['Computer Vision', 'Robotics', 'Agriculture'],
    content: '', // MDX content is rendered by the existing MDX route
  }
];

const STORAGE_KEY_PROJECTS = 'portfolio-projects';
const STORAGE_KEY_BLOGS = 'portfolio-blogs';

function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        try {
          const custom = JSON.parse(saved) as Project[];
          return [...defaultProjects, ...custom];
        } catch { /* ignore */ }
      }
    }
    return defaultProjects;
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_BLOGS);
      if (saved) {
        try {
          const custom = JSON.parse(saved) as BlogPost[];
          return [...defaultBlogPosts, ...custom];
        } catch { /* ignore */ }
      }
    }
    return defaultBlogPosts;
  });

  // Listen to Firestore OR persist to localStorage
  useEffect(() => {
    if (db) {
      // Firebase Sync for Projects
      const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        const custom = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects([...defaultProjects, ...custom]);
      });

      // Firebase Sync for Blogs
      const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snap) => {
        const custom = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setBlogPosts([...defaultBlogPosts, ...custom]);
      });

      return () => {
        unsubProjects();
        unsubBlogs();
      };
    } else {
      // LocalStorage fallback
      const customProjects = projects.filter(p => p.id.startsWith('custom-'));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(customProjects));

      const customBlogs = blogPosts.filter(b => b.id.startsWith('custom-'));
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(customBlogs));
    }
  }, [projects, blogPosts]);

  const addProject = useCallback(async (project: Omit<Project, 'id'>) => {
    const id = generateId();
    const newProject: Project = { ...project, id };

    if (db) {
      await setDoc(doc(db, 'projects', id), project);
    } else {
      setProjects(prev => [...prev, newProject]);
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    if (db && id.startsWith('custom-')) {
      await deleteDoc(doc(db, 'projects', id));
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  }, []);

  const addBlogPost = useCallback(async (post: Omit<BlogPost, 'id'>) => {
    const id = generateId();
    const newPost: BlogPost = { ...post, id };

    if (db) {
      await setDoc(doc(db, 'blogPosts', id), post);
    } else {
      setBlogPosts(prev => [...prev, newPost]);
    }
  }, []);

  const removeBlogPost = useCallback(async (id: string) => {
    if (db && id.startsWith('custom-')) {
      await deleteDoc(doc(db, 'blogPosts', id));
    } else {
      setBlogPosts(prev => prev.filter(b => b.id !== id));
    }
  }, []);

  return (
    <DataStoreContext.Provider value={{ projects, blogPosts, addProject, removeProject, addBlogPost, removeBlogPost }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
}
