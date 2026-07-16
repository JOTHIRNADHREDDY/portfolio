import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { collection, onSnapshot, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export interface Project {
  id: string;
  title: string;
  problem: string;
  longProblem: string;
  whatBuilt: string;
  challenge: string;
  result: string;
  highlights?: string[];
  tech: string[];
  github: string;
  previewUrl?: string;
  resultTags: string[];
  theme: string;
  datasheets: { name: string; link: string }[];
  videoDemo: string;
  category: string;
  featured?: boolean;
  sortOrder: number;
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
  addProject: (project: Omit<Project, 'id' | 'sortOrder'> & { sortOrder?: number }) => void;
  removeProject: (id: string) => void;
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  removeBlogPost: (id: string) => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

const defaultProjects: Project[] = [
  {
    id: 'default-1',
    sortOrder: 1,
    featured: true,
    title: 'Semi-Autonomous Weed Detection & Laser Removal Robot',
    problem: 'Herbicide overuse and weed resistance make chemical spraying costly and environmentally harmful — farms need targeted, chemical-free weed removal.',
    longProblem:
      'Large-scale herbicide use drives cost, environmental damage, and rising weed resistance. I wanted a robotic approach that detects weeds in the field and removes them with targeted laser energy instead of blanket chemical spraying.',
    whatBuilt:
      'A mobile weed-removal prototype with a camera-based vision pipeline, YOLOv11s inference for weed detection, and an ESP32-controlled targeting workflow that aims a laser at detected weeds. I led hardware integration, dataset work, model training, and embedded targeting logic.',
    challenge:
      'Balancing edge inference speed with detection accuracy was difficult, but servo aiming precision mattered even more — small overshoots hit crops instead of weeds, so calibration took longer than model tuning.',
    result:
      'Achieved ~95% weed detection accuracy in controlled tests and integrated real-time inference with ESP32-based targeting for proof-of-concept autonomous weed localization.',
    highlights: [
      'Collected and labeled image data for weed vs. crop detection.',
      'Trained YOLOv11s model achieving ~95% detection accuracy in controlled tests.',
      'Integrated camera inference with ESP32-based laser targeting workflow.',
      'Reduced reliance on blanket chemical spraying through targeted weed localization.',
    ],
    tech: ['YOLOv11s', 'ESP32', 'Computer vision', 'Servo targeting', 'PWM motor control', 'Dataset labeling'],
    github: 'https://github.com/JOTHIRNADHREDDY/Semi-Autonomous-Weed-Detection-and-Removal-Robot',
    resultTags: ['~95% detection accuracy', 'Real-time edge inference', 'ESP32 targeting'],
    theme: 'emerald',
    datasheets: [
      { name: 'ESP32-WROOM-32D', link: '#' },
      { name: 'Laser Diode 5W', link: '#' },
    ],
    videoDemo: '',
    category: 'Hardware',
  },
  {
    id: 'default-5',
    sortOrder: 2,
    title: 'Real-Time Industrial Process Monitor — ESP32',
    problem: 'Small labs and workshops lack affordable, local monitoring — most industrial dashboards require expensive PLCs or cloud subscriptions.',
    longProblem:
      'College labs and small workshops rarely have live process monitoring. Commercial systems are costly, cloud-dependent, and overkill for local setups that only need pressure, level, and motor data on the LAN.',
    whatBuilt:
      'An ESP32-based monitoring system that reads BMP280 pressure, HC-SR04 tank level, and motor RPM, then streams live metrics over WebSocket to a browser dashboard on the local network — no cloud required. I designed the sensor interface, firmware, dashboard, and NC relay fail-safe.',
    challenge:
      'Sensor noise and calibration were the hardest parts: BMP280 needed altitude compensation, HC-SR04 readings varied with water surface ripples, and a GPIO was damaged early from an unchecked current limit on a peripheral.',
    result:
      'Built a sub-₹2000 local monitoring stack with live browser visualization, WebSocket updates, and hardware fail-safe relay cutoff above pressure threshold.',
    highlights: [
      'Implemented WebSocket streaming with ESPAsyncWebServer for browser dashboards.',
      'Added NC relay fail-safe to shut off motor on over-pressure even if firmware hangs.',
      'Calibrated BMP280 and ultrasonic level sensing for stable workshop readings.',
    ],
    tech: ['ESP32', 'WebSocket', 'BMP280', 'HC-SR04', 'ESPAsyncWebServer', 'ArduinoJson', 'Relay fail-safe'],
    github: 'https://github.com/JOTHIRNADHREDDY/Web-Based-Industrial-Process-Control-System-Using-ESP32',
    resultTags: ['Local WebSocket dashboard', 'NC relay fail-safe', 'Sub-₹2000 BOM'],
    theme: 'emerald',
    datasheets: [
      { name: 'ESP32 DevKit', link: '#' },
      { name: 'BTS7960 Motor Driver', link: '#' },
      { name: 'HC-SR04 Ultrasonic', link: '#' },
      { name: 'BMP280 Pressure', link: '#' },
    ],
    videoDemo: '',
    category: 'Hardware',
  },
  {
    id: 'default-2',
    sortOrder: 3,
    title: 'Self-Balancing Robot',
    problem: 'Two-wheeled inverted-pendulum robots are inherently unstable — they need fast sensing and control to stay upright.',
    longProblem:
      'A self-balancing robot looks simple online but behaves like an inverted pendulum that wants to fall over. The controller must react within milliseconds using noisy IMU data and imperfect motor response.',
    whatBuilt:
      'A two-wheeled balancing robot using MPU6050 IMU data, complementary filtering, and PID control on Arduino Uno driving DC motors through an L298N driver. I built the mechanical platform, wired sensors, and tuned the control loop.',
    challenge:
      'PID tuning on real hardware was far harder than textbook theory — integral windup caused oscillation and tipping until P/D gains and filter parameters were carefully balanced.',
    result:
      'Achieved stable balancing with ~100 Hz control loop and reliable upright operation after complementary-filtered IMU fusion and PID tuning.',
    highlights: [
      'Fused MPU6050 accelerometer and gyro data with a complementary filter.',
      'Tuned PID controller for stable upright balance on physical hardware.',
      'Ran control loop at ~100 Hz on Arduino Uno with L298N motor drive.',
    ],
    tech: ['Arduino Uno', 'MPU6050', 'PID control', 'Complementary filter', 'L298N', 'DC motor control'],
    github: '#',
    resultTags: ['~100 Hz control loop', 'Stable upright balance', 'IMU sensor fusion'],
    theme: 'blue',
    datasheets: [
      { name: 'MPU6050 6-DoF IMU', link: '#' },
      { name: 'L298N Motor Driver', link: '#' },
    ],
    videoDemo: '',
    category: 'Hardware',
  },
  {
    id: 'default-3',
    sortOrder: 4,
    title: 'Pneumatic Safety Bumper',
    problem: 'Software-only collision avoidance can fail — autonomous systems need a physical last-resort safety barrier.',
    longProblem:
      'If autonomous vehicle software fails to brake in time, there is no recovery from code alone. I wanted a mechanical backup that deploys independently when an obstacle is too close.',
    whatBuilt:
      'A pneumatic bumper mechanism designed in SolidWorks with double-acting cylinders, proximity-triggered solenoid valves, and a software-free deployment path. I handled mechanical layout, pneumatic circuit design, and mounting geometry.',
    challenge:
      'Pneumatic response depends on pressure, hose length, and cylinder bore — early prototypes deployed noticeably late until the circuit and mounting geometry were optimized for faster stroke time.',
    result:
      'Delivered a purely pneumatic fail-safe bumper concept with proximity-triggered deployment independent of software control.',
    tech: ['SolidWorks', 'Double-acting cylinders', '5/2 solenoid valve', 'Proximity sensors', 'Pneumatic circuits'],
    github: '#',
    resultTags: ['Software-independent deployment', 'Proximity-triggered actuation'],
    theme: 'amber',
    datasheets: [
      { name: 'SMC Double-Acting Cylinder', link: '#' },
      { name: '5/2 Way Solenoid Valve', link: '#' },
    ],
    videoDemo: '',
    category: 'Hardware',
  },
  {
    id: 'default-7',
    sortOrder: 5,
    title: 'Truss Bridge Simulator — Real-Time Structural Analysis',
    problem: 'Truss analysis on paper is abstract — I needed a visual tool to see how loads and members behave in real structures.',
    longProblem:
      'Classical truss homework gives numbers without intuition. I wanted to place nodes, apply loads, and immediately see tension, compression, and force flow through each member.',
    whatBuilt:
      'A browser-based truss simulator where users place nodes, connect members, assign supports, and apply loads. A custom physics engine solves internal forces in real time and color-codes members by stress, with safety factor analytics.',
    challenge:
      'Building a reliable equilibrium solver was difficult — one wrong sign in the stiffness matrix made the structure visually unstable. State updates also required full re-solve on every edit.',
    result:
      'Simulator results matched hand calculations within ~5% (manual ~28.8 kN vs. simulated ~27.5 kN) and provided real-time force visualization.',
    tech: ['React (TypeScript)', 'Zustand', 'Custom physics engine', 'Matrix equilibrium solver', 'Tailwind CSS'],
    github: 'https://github.com/JOTHIRNADHREDDY/Truss-Bridge-Simulator',
    previewUrl: 'https://ai.studio/apps/f9103285-177e-4b99-9327-e6fd2c874ca5?fullscreenApplet=true',
    resultTags: ['~5% vs. hand calc error', 'Real-time force visualization', 'Custom solver'],
    theme: 'amber',
    datasheets: [],
    videoDemo: '',
    category: 'Software',
  },
  {
    id: 'default-4',
    sortOrder: 6,
    title: 'Manually Controlled Trash Collecting Bot',
    problem: 'Manual waste sorting is slow and risky — a remote bot can collect trash and separate metal automatically at pickup.',
    longProblem:
      'Waste sorting by hand is tedious and sometimes hazardous. I built a remotely driven collector that picks up trash and sorts metal from non-metal using onboard sensing.',
    whatBuilt:
      'A trash-collecting robot with Arduino + ESP32 architecture: Arduino drives motors and gripper, ESP32 provides Blynk WiFi remote control, and an inductive sensor classifies metal at the gripper for bin sorting.',
    challenge:
      'Inductive sensing was angle-sensitive for small metal pieces, and Blynk free-tier latency made precise teleoperation frustrating compared with a direct low-latency link.',
    result:
      'Demonstrated remote collection with automatic metal/non-metal sorting using inductive detection at the gripper.',
    tech: ['Arduino', 'ESP32', 'Blynk', 'Inductive proximity sensor', 'Motor driver', 'Remote teleoperation'],
    github: 'https://github.com/JOTHIRNADHREDDY/Manually-Controlled-Trash-Collecting-Bot',
    resultTags: ['Metal sorting at gripper', 'WiFi remote control'],
    theme: 'purple',
    datasheets: [
      { name: 'LJ12A3-4-Z/BX Inductive Sensor', link: '#' },
      { name: 'ESP32 NodeMCU', link: '#' },
    ],
    videoDemo: '',
    category: 'Hardware',
  },
  {
    id: 'default-6',
    sortOrder: 7,
    title: 'Smart Basket — AI Grocery Planning App',
    problem: 'Grocery trips suffer from forgotten items, budget overruns, and duplicate purchases across household members.',
    longProblem:
      'Families often lose track of what is already purchased, exceed budget, or forget essentials. I wanted a shared planning tool with practical AI assistance, not just a static checklist.',
    whatBuilt:
      'A browser app with shared shopping lists, real-time budget tracking, multi-user sync via Supabase, and an AI assistant that converts dish names into categorized grocery lists with quantities and estimated prices.',
    challenge:
      'Supabase RLS edge cases, division-by-zero on ₹0 budget, prompt tuning to return ingredients only, and multi-user real-time sync were the main engineering hurdles.',
    result:
      'Shipped a working shared grocery planner with AI list generation and live budget tracking in the browser.',
    tech: ['React', 'Tailwind CSS', 'Supabase', 'OpenAI API', 'Real-time sync'],
    github: 'https://github.com/JOTHIRNADHREDDY/smartbasket-list',
    previewUrl: 'https://smartbasket-list.lovable.app',
    resultTags: ['AI grocery lists', 'Shared real-time lists', 'Budget tracking'],
    theme: 'purple',
    datasheets: [],
    videoDemo: '',
    category: 'AI',
  },
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
    content: '',
  },
];

const STORAGE_KEY_PROJECTS = 'portfolio-projects';
const STORAGE_KEY_BLOGS = 'portfolio-blogs';

function generateId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function normalizeProject(project: Project): Project {
  const legacy = project as Project & {
    approach?: string;
    learning?: string;
    metrics?: Record<string, number>;
  };

  return {
    ...project,
    whatBuilt: project.whatBuilt || legacy.approach || '',
    challenge: project.challenge || legacy.learning || '',
    result: project.result || '',
    resultTags:
      project.resultTags ||
      (legacy.metrics ? Object.keys(legacy.metrics).filter((k) => !['accuracy', 'stability', 'efficiency'].includes(k)) : []),
    sortOrder: project.sortOrder ?? 99,
  };
}

export function DataStoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        try {
          const custom = (JSON.parse(saved) as Project[]).map(normalizeProject);
          return [...defaultProjects, ...custom];
        } catch {
          /* ignore */
        }
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
        } catch {
          /* ignore */
        }
      }
    }
    return defaultBlogPosts;
  });

  useEffect(() => {
    if (db) {
      const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        const custom = snap.docs.map((d) => normalizeProject({ id: d.id, ...d.data() } as Project));
        setProjects([...defaultProjects, ...custom]);
      });

      const unsubBlogs = onSnapshot(collection(db, 'blogPosts'), (snap) => {
        const custom = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as BlogPost));
        setBlogPosts([...defaultBlogPosts, ...custom]);
      });

      return () => {
        unsubProjects();
        unsubBlogs();
      };
    } else {
      const customProjects = projects.filter((p) => p.id.startsWith('custom-'));
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(customProjects));

      const customBlogs = blogPosts.filter((b) => b.id.startsWith('custom-'));
      localStorage.setItem(STORAGE_KEY_BLOGS, JSON.stringify(customBlogs));
    }
  }, [projects, blogPosts]);

  const addProject = useCallback(async (project: Omit<Project, 'id' | 'sortOrder'> & { sortOrder?: number }) => {
    const id = generateId();
    const newProject: Project = {
      ...project,
      id,
      sortOrder: project.sortOrder ?? 99,
      resultTags: project.resultTags ?? [],
    };

    if (db) {
      await setDoc(doc(db, 'projects', id), newProject);
    } else {
      setProjects((prev) => [...prev, newProject]);
    }
  }, []);

  const removeProject = useCallback(async (id: string) => {
    if (db && id.startsWith('custom-')) {
      await deleteDoc(doc(db, 'projects', id));
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }, []);

  const addBlogPost = useCallback(async (post: Omit<BlogPost, 'id'>) => {
    const id = generateId();
    const newPost: BlogPost = { ...post, id };

    if (db) {
      await setDoc(doc(db, 'blogPosts', id), post);
    } else {
      setBlogPosts((prev) => [...prev, newPost]);
    }
  }, []);

  const removeBlogPost = useCallback(async (id: string) => {
    if (db && id.startsWith('custom-')) {
      await deleteDoc(doc(db, 'blogPosts', id));
    } else {
      setBlogPosts((prev) => prev.filter((b) => b.id !== id));
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

export const RESUME_PDF_URL = '/Jothirnadh Resume.pdf';
