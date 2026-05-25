import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" }); // fallback
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin / author user ───────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@1234", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@pasacademy.com" },
    update: {},
    create: {
      name: "PAS Academy",
      email: "admin@pasacademy.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Courses ───────────────────────────────────────────────────────────────
  const coursesData = [
    {
      title: "Introduction to Mathematics",
      slug: "introduction-to-mathematics",
      description:
        "A comprehensive introduction to core mathematical concepts covering arithmetic, fractions, decimals, and an introduction to algebra. Designed for learners who want to build a solid numerical foundation.",
      shortDesc: "Build a solid foundation in core math concepts.",
      category: "MATH" as const,
      level: "BEGINNER" as const,
      tags: ["math", "arithmetic", "algebra", "beginner"],
      isPublished: true,
      isFeatured: true,
      isFree: true,
      totalDuration: 180,
      lessons: [
        { title: "Basic Arithmetic & Number Systems", order: 1, duration: 25, isFree: true, isPublished: true },
        { title: "Fractions and Decimals Explained", order: 2, duration: 30, isFree: true, isPublished: true },
        { title: "Introduction to Algebra", order: 3, duration: 35, isFree: false, isPublished: true },
        { title: "Ratios, Proportions & Percentages", order: 4, duration: 30, isFree: false, isPublished: true },
        { title: "Geometry Basics: Shapes & Angles", order: 5, duration: 35, isFree: false, isPublished: true },
        { title: "Introduction to Statistics", order: 6, duration: 25, isFree: false, isPublished: true },
      ],
    },
    {
      title: "English Writing Mastery",
      slug: "english-writing-mastery",
      description:
        "Develop your written English from sentence construction through to polished academic and professional essays. Covers grammar, punctuation, essay structure, argumentation, and academic referencing.",
      shortDesc: "From grammar basics to academic essay writing.",
      category: "ENGLISH" as const,
      level: "INTERMEDIATE" as const,
      tags: ["english", "writing", "grammar", "essays", "academic"],
      isPublished: true,
      isFeatured: true,
      isFree: true,
      totalDuration: 210,
      lessons: [
        { title: "Grammar Foundations: Parts of Speech", order: 1, duration: 30, isFree: true, isPublished: true },
        { title: "Sentence Construction & Clarity", order: 2, duration: 35, isFree: true, isPublished: true },
        { title: "Paragraph Structure & Coherence", order: 3, duration: 30, isFree: false, isPublished: true },
        { title: "Essay Planning & Argumentation", order: 4, duration: 40, isFree: false, isPublished: true },
        { title: "Academic Writing & Referencing", order: 5, duration: 40, isFree: false, isPublished: true },
        { title: "Proofreading & Editing Techniques", order: 6, duration: 35, isFree: false, isPublished: true },
      ],
    },
    {
      title: "Science Fundamentals",
      slug: "science-fundamentals",
      description:
        "Explore the building blocks of natural science — from the scientific method to forces, motion, energy, cells, and the Earth's systems. Ideal for students preparing for exams or simply curious about how the world works.",
      shortDesc: "Explore physics, biology, and earth science basics.",
      category: "SCIENCE" as const,
      level: "BEGINNER" as const,
      tags: ["science", "physics", "biology", "chemistry", "beginner"],
      isPublished: true,
      isFeatured: false,
      isFree: true,
      totalDuration: 195,
      lessons: [
        { title: "The Scientific Method", order: 1, duration: 20, isFree: true, isPublished: true },
        { title: "Forces, Motion & Newton's Laws", order: 2, duration: 35, isFree: true, isPublished: true },
        { title: "Energy: Forms & Conservation", order: 3, duration: 35, isFree: false, isPublished: true },
        { title: "Cells & the Building Blocks of Life", order: 4, duration: 35, isFree: false, isPublished: true },
        { title: "Atoms, Elements & Chemical Reactions", order: 5, duration: 35, isFree: false, isPublished: true },
        { title: "Earth's Systems & Climate", order: 6, duration: 35, isFree: false, isPublished: true },
      ],
    },
    {
      title: "Media & Design Essentials",
      slug: "media-and-design-essentials",
      description:
        "A practical introduction to visual communication, graphic design principles, and digital media. Learn colour theory, typography, layout, and how to use design tools to produce professional-looking work.",
      shortDesc: "Practical design skills for the digital age.",
      category: "MEDIA" as const,
      level: "BEGINNER" as const,
      tags: ["design", "media", "graphic design", "tutorial", "visual"],
      isPublished: true,
      isFeatured: false,
      isFree: true,
      totalDuration: 165,
      lessons: [
        { title: "Design Principles: Balance, Contrast & Alignment", order: 1, duration: 30, isFree: true, isPublished: true },
        { title: "Colour Theory & Palettes", order: 2, duration: 25, isFree: true, isPublished: true },
        { title: "Typography: Choosing & Pairing Fonts", order: 3, duration: 25, isFree: false, isPublished: true },
        { title: "Layout & Composition", order: 4, duration: 30, isFree: false, isPublished: true },
        { title: "Introduction to Digital Tools (Canva & Figma)", order: 5, duration: 35, isFree: false, isPublished: true },
      ],
    },
  ];

  // Tutorial courses (tagged "tutorial" prominently)
  const tutorialsData = [
    {
      title: "Python for Data Science – Beginner Tutorial",
      slug: "python-for-data-science-beginner",
      description:
        "A step-by-step tutorial series taking you from Python installation to data analysis with Pandas and basic visualisations with Matplotlib. No prior programming experience required.",
      shortDesc: "Learn Python and data analysis from scratch.",
      category: "OTHER" as const,
      level: "BEGINNER" as const,
      tags: ["python", "data science", "tutorial", "programming", "pandas"],
      isPublished: true,
      isFeatured: true,
      isFree: true,
      totalDuration: 150,
      lessons: [
        { title: "Setting Up Python & Your First Script", order: 1, duration: 20, isFree: true, isPublished: true },
        { title: "Variables, Data Types & Operators", order: 2, duration: 25, isFree: true, isPublished: true },
        { title: "Control Flow: If, Loops & Functions", order: 3, duration: 30, isFree: false, isPublished: true },
        { title: "Introduction to Pandas & DataFrames", order: 4, duration: 35, isFree: false, isPublished: true },
        { title: "Data Visualisation with Matplotlib", order: 5, duration: 40, isFree: false, isPublished: true },
      ],
    },
    {
      title: "Study Skills & Time Management Tutorial",
      slug: "study-skills-time-management",
      description:
        "Practical tutorial covering proven study techniques — spaced repetition, active recall, the Pomodoro method, and goal-setting strategies — to help students achieve more in less time.",
      shortDesc: "Proven techniques to study smarter, not harder.",
      category: "OTHER" as const,
      level: "BEGINNER" as const,
      tags: ["study skills", "tutorial", "productivity", "time management"],
      isPublished: true,
      isFeatured: false,
      isFree: true,
      totalDuration: 100,
      lessons: [
        { title: "How Memory Works & Why It Matters", order: 1, duration: 20, isFree: true, isPublished: true },
        { title: "Active Recall & Spaced Repetition", order: 2, duration: 25, isFree: true, isPublished: true },
        { title: "The Pomodoro Technique in Practice", order: 3, duration: 20, isFree: false, isPublished: true },
        { title: "Goal Setting & Weekly Planning", order: 4, duration: 20, isFree: false, isPublished: true },
        { title: "Managing Exam Stress & Staying Motivated", order: 5, duration: 15, isFree: false, isPublished: true },
      ],
    },
    {
      title: "Introduction to Public Speaking – Tutorial",
      slug: "introduction-to-public-speaking",
      description:
        "A hands-on tutorial series building confidence and skill in public speaking. Covers speech structure, vocal delivery, body language, handling nerves, and Q&A sessions.",
      shortDesc: "Build confidence and clarity when speaking in public.",
      category: "ENGLISH" as const,
      level: "BEGINNER" as const,
      tags: ["public speaking", "tutorial", "communication", "confidence"],
      isPublished: true,
      isFeatured: false,
      isFree: true,
      totalDuration: 110,
      lessons: [
        { title: "Why Public Speaking Matters", order: 1, duration: 15, isFree: true, isPublished: true },
        { title: "Structuring a Compelling Speech", order: 2, duration: 25, isFree: true, isPublished: true },
        { title: "Vocal Delivery: Pace, Tone & Clarity", order: 3, duration: 25, isFree: false, isPublished: true },
        { title: "Body Language & Stage Presence", order: 4, duration: 25, isFree: false, isPublished: true },
        { title: "Handling Nerves & Q&A Sessions", order: 5, duration: 20, isFree: false, isPublished: true },
      ],
    },
  ];

  const allCourses = [...coursesData, ...tutorialsData];

  for (const { lessons, ...courseData } of allCourses) {
    const course = await db.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        ...courseData,
        authorId: admin.id,
        lessons: {
          create: lessons.map((l) => ({
            title: l.title,
            slug: l.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            duration: l.duration,
            order: l.order,
            isFree: l.isFree,
            isPublished: l.isPublished,
          })),
        },
      },
    });
    console.log(`✅ Course: ${course.title}`);
  }

  // ── Webinars ──────────────────────────────────────────────────────────────
  const now = new Date();
  const future = (daysAhead: number, hour = 14) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    return d;
  };
  const past = (daysAgo: number, hour = 10) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const webinarsData = [
    {
      title: "Leadership in the 21st Century",
      slug: "leadership-21st-century",
      description:
        "Join us for an engaging session exploring what effective leadership looks like in today's fast-changing world. We'll cover adaptive leadership, emotional intelligence, and building high-performing teams.",
      hostName: "Dr. Sarah Mensah",
      scheduledAt: future(7),
      durationMins: 90,
      status: "SCHEDULED" as const,
      isPublic: true,
      isFree: true,
      maxAttendees: 200,
      tags: ["Leadership", "Personal Development"],
    },
    {
      title: "Sustainability & Climate Action for Students",
      slug: "sustainability-climate-action-students",
      description:
        "Understand the science behind climate change and discover practical ways students can contribute to sustainability. Featuring live Q&A with environmental experts.",
      hostName: "Prof. James Osei",
      scheduledAt: future(14),
      durationMins: 60,
      status: "SCHEDULED" as const,
      isPublic: true,
      isFree: true,
      maxAttendees: 300,
      tags: ["Sustainability", "Digital Skills"],
    },
    {
      title: "Digital Skills for the Future Workforce",
      slug: "digital-skills-future-workforce",
      description:
        "Explore the digital skills employers demand most — from AI literacy and data analysis to cybersecurity awareness and remote collaboration. Get ahead of the curve before you enter the workforce.",
      hostName: "Ama Darko",
      scheduledAt: future(21),
      durationMins: 75,
      status: "SCHEDULED" as const,
      isPublic: true,
      isFree: true,
      maxAttendees: 250,
      tags: ["Digital Skills", "Career Guidance"],
    },
    {
      title: "Navigating University Applications",
      slug: "navigating-university-applications",
      description:
        "A practical guide to the university application process — from choosing the right institution and writing a standout personal statement to interview preparation and scholarship applications.",
      hostName: "Mrs. Abena Boateng",
      scheduledAt: future(3),
      durationMins: 90,
      status: "SCHEDULED" as const,
      isPublic: true,
      isFree: true,
      maxAttendees: 150,
      tags: ["Academic Success", "Career Guidance"],
    },
    {
      title: "Media & Design: Building Your Portfolio",
      slug: "media-design-building-your-portfolio",
      description:
        "Learn how to curate and present a compelling design portfolio that gets you noticed by universities and employers. We'll cover platform choices, case study writing, and live portfolio reviews.",
      hostName: "Kwame Asante",
      scheduledAt: future(28),
      durationMins: 60,
      status: "SCHEDULED" as const,
      isPublic: true,
      isFree: true,
      maxAttendees: 100,
      tags: ["Media & Design", "Career Guidance"],
    },
    {
      title: "Academic Success Strategies (Recorded)",
      slug: "academic-success-strategies-recorded",
      description:
        "Missed our live session? Watch the full recording of our popular Academic Success Strategies webinar covering note-taking, exam preparation, and managing academic pressure.",
      hostName: "PAS Academy Team",
      scheduledAt: past(10),
      durationMins: 60,
      status: "ENDED" as const,
      replayUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isPublic: true,
      isFree: true,
      tags: ["Academic Success", "Personal Development"],
    },
    {
      title: "Personal Development: Finding Your Purpose",
      slug: "personal-development-finding-your-purpose",
      description:
        "A reflective and practical webinar helping young people identify their values, strengths, and goals. Includes guided exercises and breakout discussions.",
      hostName: "Nana Yaa Asante",
      scheduledAt: past(5),
      durationMins: 75,
      status: "ENDED" as const,
      replayUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isPublic: true,
      isFree: true,
      tags: ["Personal Development", "Leadership"],
    },
  ];

  for (const webinar of webinarsData) {
    const w = await db.webinar.upsert({
      where: { slug: webinar.slug },
      update: {},
      create: { ...webinar, hostId: admin.id },
    });
    console.log(`✅ Webinar: ${w.title}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
