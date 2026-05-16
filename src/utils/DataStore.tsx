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
  previewUrl?: string;
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
    id: 'default-7',
    title: "🏗️ Truss Bridge Simulator — Real-Time Structural Analysis Tool (Apr 2026)",
    problem: "Truss problems in class felt abstract — I wanted to actually see how forces flow through a structure, not just solve equations on paper.",
    longProblem: "Truss problems in class always felt abstract. You plug numbers into equations, get an answer, and move on — but I never really understood how forces actually flow through a structure. Like, why does adding one diagonal member suddenly make the whole thing stable? I wanted something visual where I could build a truss, throw a load on it, and instantly see what happens.",
    approach: "I built a browser-based simulator where you place nodes, connect members, assign supports, and apply loads. The app solves for internal forces in real time and color-codes each member by stress — red for high tension, blue for compression. It also spits out analytics like maximum stress, safety factor, and individual member forces. The physics engine is custom — no library, just matrix math and equilibrium equations.",
    learning: "Seeing force distribution visually made concepts like tension, compression, and redundancy click in a way textbooks never did. I also cross-checked my simulator against hand calculations — my manual result was ~28.8 kN and the simulator gave ~27.5 kN, which was close enough to make me trust it. The hardest part was getting the equilibrium solver to work correctly across all joints simultaneously. One wrong sign in the stiffness matrix and the whole structure would \"explode\" on screen. State management with Zustand was also trickier than expected because every node move triggers a full re-solve.",
    tech: ['React (TS)', 'Zustand', 'Custom Physics Engine', 'Tailwind'],
    github: "https://github.com/JOTHIRNADHREDDY/Truss-Bridge-Simulator",
    previewUrl: "https://ai.studio/apps/f9103285-177e-4b99-9327-e6fd2c874ca5?fullscreenApplet=true",
    metrics: { physics: 100, visualization: 95, accuracy: 96 },
    theme: "amber",
    datasheets: [],
    videoDemo: "",
    category: "AI",
  },
  {
    id: 'default-5',
    title: "Real-Time Industrial Process Monitor - ESP32 (Apr 2026)",
    problem: "Small workshops and labs can't afford PLCs or cloud dashboards — I built a local monitoring system with an ESP32 and a browser.",
    longProblem: "I noticed that small-scale setups — college labs, small workshops — never have proper monitoring. The industrial solutions cost a fortune and most need cloud accounts and proprietary apps. I wanted to build something that runs entirely on the local network, costs under ₹2000, and shows live data in any browser without installing anything.",
    approach: "The ESP32 reads pressure from a BMP280, tank level from an HC-SR04 ultrasonic sensor, and motor RPM, then streams everything over WebSocket to a browser-based dashboard. No cloud, no app store — just connect to the same WiFi and open a URL. I also added a normally-closed relay as a hardware fail-safe, so if pressure goes above a threshold, the motor shuts off automatically even if the ESP32 crashes.",
    learning: "The WebSocket part was smoother than I expected — ESPAsyncWebServer handles it well. What wasn't smooth was the BMP280 giving me garbage readings until I realized I had to account for altitude calibration. The HC-SR04 is surprisingly unreliable when the water surface isn't calm — ripples cause the ultrasonic pulse to scatter. The biggest lesson was reading datasheets properly before wiring things up. I burned a GPIO pin because I didn't check the maximum current rating.",
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
    problem: "I wanted to see if a robot could actually spot weeds in real time and zap them with a laser — no chemicals needed.",
    longProblem: "The idea started when I read about how much herbicide gets dumped on fields every year and how weeds keep getting resistant to it anyway. I thought — what if you could just point a laser at each weed individually? Sounds simple in theory, but getting a camera to tell weeds from crops in real time, and then aiming a laser accurately enough to actually do something? That turned out to be way harder than I expected.",
    approach: "I trained a YOLOv11s model to detect weeds in real time and mounted it on a robot platform with an ESP32 controlling the laser targeting. The camera feeds into the model, which outputs bounding boxes, and then servos aim the laser at each detected weed. The whole pipeline had to run fast enough that the robot doesn't just roll past the weed before the laser fires.",
    learning: "Getting YOLO to run on an edge device was the first real challenge — I had to optimize the model size without killing accuracy. But the part that genuinely surprised me was how much the servo precision mattered. Even a tiny overshoot meant the laser hit the crop instead of the weed. I ended up spending more time on actuator calibration than on the ML model itself, which I really did not see coming.",
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
    problem: "Grocery runs always go sideways — forgotten items, busted budgets, duplicate purchases. I built an app to actually fix that.",
    longProblem: "Honestly, the idea came from something pretty relatable — grocery runs that go sideways. You forget things, go over budget, or end up buying the same stuff twice because someone else in the family already got it. I wanted to build something that actually solves this, not just another list app where you type items and check them off.",
    approach: "Smart Basket is an AI-powered grocery planning app where you can create and manage shopping lists, track your budget in real time, and share lists with family or roommates. The highlight is an AI assistant named Lova — type a dish name, and it breaks it down into a categorized grocery list with quantities and estimated prices. The whole thing runs in the browser with Supabase handling auth and storage, no dedicated backend needed.",
    learning: "Supabase's RLS policies don't automatically apply to shared queries, which caused silent data access failures that took me hours to debug. A ₹0 budget edge case broke the entire dashboard because I wasn't handling division by zero in the percentage calculations. The real prompt engineering challenge was getting the AI to return just an ingredient list instead of a full recipe — it kept wanting to give me cooking instructions too. Handling real-time sync when multiple people edit the same list was also way harder than I thought it would be.",
    tech: ['React', 'Tailwind', 'Supabase', 'Lovable.dev', 'OpenAI API'],
    github: "https://github.com/JOTHIRNADHREDDY/smartbasket-list",
    previewUrl: "https://smartbasket-list.lovable.app",
    metrics: { accuracy: 95, responsiveness: 98, usability: 90 },
    theme: "purple",
    datasheets: [],
    videoDemo: "",
    category: "AI",
  },
  {
    id: 'default-3',
    title: "Pneumatic Safety Bumper (Oct 2025)",
    problem: "What happens when an autonomous vehicle's software fails to avoid a collision? I designed a physical last-resort bumper.",
    longProblem: "This started as a 'what if' question in a design class — what happens if the software on an autonomous vehicle fails to brake in time? You can't just rely on code for safety. I wanted to design a purely mechanical backup, something physical that deploys on its own when a collision is imminent, regardless of what the software is doing.",
    approach: "I designed a pneumatic bumper system in SolidWorks that uses double-acting cylinders triggered by proximity sensors. When an object gets too close, the sensors fire a solenoid valve, and the cylinders push out a physical barrier in front of the vehicle. The whole mechanism is purely pneumatic — no software in the loop, which was the entire point.",
    learning: "This was my first real project with fluid power systems, and the biggest lesson was how different pneumatics is from what you'd expect. The response time depends on air pressure, hose length, cylinder bore — things you don't think about until you see the bumper deploy a full second late. I spent a lot of time in SolidWorks getting the mounting geometry right so the force distribution didn't twist the chassis.",
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
    problem: "I built a remotely controlled bot that picks up trash and sorts metal from non-metal using an inductive sensor.",
    longProblem: "The idea was pretty straightforward — waste sorting by hand is slow, messy, and sometimes actually dangerous. I wanted to build a bot you could drive around remotely that picks up trash and can at least do basic sorting between metal and non-metal objects on its own.",
    approach: "The bot runs on an Arduino + ESP32 combo. The Arduino handles the motors and the mechanical gripper, while the ESP32 connects to Blynk for remote control over WiFi. An inductive proximity sensor near the gripper detects whether the picked-up object is metal, and the bot sorts it into the right bin automatically. It's not fully autonomous — you still drive it to the trash — but the sorting part is hands-free.",
    learning: "The inductive sensor was finicky. It works great for detecting big metal objects, but small things like bottle caps would sometimes not trigger it depending on the angle. I also learned that Blynk's free tier has real latency issues — there's a noticeable delay between pressing a button on your phone and the bot actually moving, which makes precise driving frustrating. If I did this again, I'd use a direct WebSocket connection instead.",
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
    problem: "I wanted to build a two-wheeled robot that balances on its own — basically an inverted pendulum that really doesn't want to stay upright.",
    longProblem: "I'd seen self-balancing robots online and they looked deceptively simple — just two wheels and a board. But the moment you try to build one, you realize it's basically an inverted pendulum that really wants to fall over. The whole thing is inherently unstable, and you have to react in milliseconds to keep it upright.",
    approach: "I used an MPU6050 IMU to read the tilt angle and angular velocity, fused the sensor data with a complementary filter, and fed it into a PID controller running on an Arduino Uno. The PID output drives two DC motors through an L298N driver. The loop runs at around 100Hz, which turned out to be just fast enough.",
    learning: "PID tuning was genuinely painful. You think you understand P, I, and D from textbooks, but actually tuning them on a physical system is a completely different experience. The I term kept causing windup and making the robot oscillate wildly before tipping over. The other thing that surprised me was how noisy the raw MPU6050 data is — without the complementary filter, the robot was basically guessing which way was up.",
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
