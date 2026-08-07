export interface AiPrompt {
  title: string;
  prompt: string;
  category: string;
}

export const aiPromptCategories = [
  "Creative Prompts",
  "Developer Prompts",
  "Image Prompts",
  "Video Prompts",
] as const;

export const aiPrompts: AiPrompt[] = [
  {
    title: "Time Travel Discovery",
    prompt:
      "Write a short story about a character who discovers they have the ability to time travel.",
    category: "Creative Prompts",
  },
  {
    title: "Poem About Dreams",
    prompt:
      "Compose a poem inspired by the concept of dreams and their meanings.",
    category: "Creative Prompts",
  },
  {
    title: "Forgotten Deity's Revenge",
    prompt:
      "Craft a mythological tale featuring a forgotten deity who seeks revenge on those who abandoned them.",
    category: "Creative Prompts",
  },
  {
    title: "Unexpected Hero",
    prompt:
      "Develop a plot twist where the apparent villain turns out to be an unexpected hero.",
    category: "Creative Prompts",
  },
  {
    title: "Colonizing Planets",
    prompt:
      "Imagine a future where humans have colonized other planets and encounter an alien civilization for the first time.",
    category: "Creative Prompts",
  },
  {
    title: "AI Surpassing Humans",
    prompt:
      "Describe a society where artificial intelligence has surpassed human intelligence and its implications on society.",
    category: "Creative Prompts",
  },
  {
    title: "World of Feared Magic",
    prompt:
      "Create a world where magic exists but is feared and hunted by those without its power.",
    category: "Creative Prompts",
  },
  {
    title: "Hidden Message",
    prompt:
      "Write a suspenseful scene where the protagonist discovers a hidden message that unravels a long-held secret.",
    category: "Creative Prompts",
  },
  {
    title: "Haunted House",
    prompt:
      "Describe a haunted house that traps its inhabitants within its walls, feeding off their fears.",
    category: "Creative Prompts",
  },
  {
    title: "Cursed Object",
    prompt:
      "Craft a story where a cursed object brings misfortune to anyone who possesses it.",
    category: "Creative Prompts",
  },
  {
    title: "Reimagined Historical Event",
    prompt:
      "Reimagine a famous historical event from the perspective of a lesser-known figure involved.",
    category: "Creative Prompts",
  },
  {
    title: "Diary Entry in History",
    prompt:
      "Write a diary entry from the point of view of a person living during a significant historical period.",
    category: "Creative Prompts",
  },
  {
    title: "Meet-Cute Between Worlds",
    prompt:
      "Create a meet-cute scenario between two characters from different worlds who find themselves drawn to each other.",
    category: "Creative Prompts",
  },
  {
    title: "Unspoken Love Letter",
    prompt:
      "Describe a love letter written by someone who can't confess their feelings in person.",
    category: "Creative Prompts",
  },
  {
    title: "High-Stakes Heist",
    prompt:
      "Outline a high-stakes heist involving a team of skilled individuals with conflicting motivations.",
    category: "Creative Prompts",
  },
  {
    title: "Quest for a Legendary Artifact",
    prompt:
      "Craft a quest where the protagonist must journey through dangerous terrain to retrieve a legendary artifact.",
    category: "Creative Prompts",
  },
  {
    title: "Letter to Past Self",
    prompt:
      "Write a letter to your past self, offering advice and encouragement based on what you've learned.",
    category: "Creative Prompts",
  },
  {
    title: "Moment of Personal Growth",
    prompt:
      "Describe a moment of personal growth or realization that changed the way you see the world.",
    category: "Creative Prompts",
  },
  {
    title: "Identity Transformation",
    prompt:
      "Explore the concept of identity through the perspective of a character who undergoes a drastic transformation.",
    category: "Creative Prompts",
  },
  {
    title: "Meaning of Life Vignettes",
    prompt:
      "Reflect on the meaning of life through a series of interconnected vignettes.",
    category: "Creative Prompts",
  },
  {
    title: "Code Review",
    prompt:
      "Review a pull request for potential bugs, code smells, and adherence to coding standards.",
    category: "Developer Prompts",
  },
  {
    title: "Debugging",
    prompt:
      "Debug a piece of code that is throwing an unknown error and document the steps taken to resolve it.",
    category: "Developer Prompts",
  },
  {
    title: "Algorithm Optimization",
    prompt:
      "Optimize an existing algorithm to improve its time and space complexity.",
    category: "Developer Prompts",
  },
  {
    title: "Unit Testing",
    prompt:
      "Write unit tests for a newly developed feature using a popular testing framework.",
    category: "Developer Prompts",
  },
  {
    title: "System Design",
    prompt:
      "Design a scalable system architecture for a web application that handles a million users.",
    category: "Developer Prompts",
  },
  {
    title: "Refactoring",
    prompt:
      "Refactor legacy code to improve readability and maintainability without changing its behavior.",
    category: "Developer Prompts",
  },
  {
    title: "API Design",
    prompt:
      "Design a RESTful API for a new service, including endpoints, request/response formats, and error handling.",
    category: "Developer Prompts",
  },
  {
    title: "Continuous Integration",
    prompt:
      "Set up a continuous integration pipeline to automate the build and testing process for a project.",
    category: "Developer Prompts",
  },
  {
    title: "Performance Tuning",
    prompt:
      "Profile and tune a web application to reduce load times and improve user experience.",
    category: "Developer Prompts",
  },
  {
    title: "Security Audit",
    prompt:
      "Conduct a security audit of an application to identify vulnerabilities and recommend mitigation strategies.",
    category: "Developer Prompts",
  },
  {
    title: "Code Documentation",
    prompt:
      "Write comprehensive documentation for a software library or API to help other developers understand and use it.",
    category: "Developer Prompts",
  },
  {
    title: "Responsive Design",
    prompt:
      "Implement a responsive design for a web page to ensure it looks good on both desktop and mobile devices.",
    category: "Developer Prompts",
  },
  {
    title: "Database Optimization",
    prompt:
      "Optimize database queries and schema to improve performance and reduce latency.",
    category: "Developer Prompts",
  },
  {
    title: "Git Workflow",
    prompt:
      "Explain a common Git workflow for a team of developers, including branching, merging, and handling conflicts.",
    category: "Developer Prompts",
  },
  {
    title: "Microservices",
    prompt:
      "Design and implement a microservices architecture for an existing monolithic application.",
    category: "Developer Prompts",
  },
  {
    title: "Serverless Functions",
    prompt:
      "Develop a serverless function to handle a specific task within a larger application.",
    category: "Developer Prompts",
  },
  {
    title: "Frontend Frameworks",
    prompt:
      "Compare and contrast popular frontend frameworks (e.g., React, Vue, Angular) for a new project.",
    category: "Developer Prompts",
  },
  {
    title: "DevOps",
    prompt:
      "Describe the process of setting up and managing infrastructure as code using tools like Terraform or Ansible.",
    category: "Developer Prompts",
  },
  {
    title: "Containerization",
    prompt:
      "Containerize an application using Docker and set up orchestration with Kubernetes.",
    category: "Developer Prompts",
  },
  {
    title: "Machine Learning Integration",
    prompt:
      "Integrate a machine learning model into a web application to provide predictive analytics.",
    category: "Developer Prompts",
  },
  {
    title: "Surreal Landscape",
    prompt:
      "Create an image of a surreal landscape where mountains float in the sky.",
    category: "Image Prompts",
  },
  {
    title: "Futuristic City",
    prompt:
      "Design a futuristic city with advanced architecture and flying vehicles.",
    category: "Image Prompts",
  },
  {
    title: "Steampunk Character",
    prompt:
      "Illustrate a character dressed in steampunk fashion with intricate gears and gadgets.",
    category: "Image Prompts",
  },
  {
    title: "Underwater Scene",
    prompt:
      "Draw an underwater scene teeming with colorful marine life and ancient ruins.",
    category: "Image Prompts",
  },
  {
    title: "Fantasy Forest",
    prompt:
      "Create a magical forest with glowing plants and mythical creatures.",
    category: "Image Prompts",
  },
  {
    title: "Alien Landscape",
    prompt:
      "Design an alien landscape with bizarre plants and animals, and unusual terrain.",
    category: "Image Prompts",
  },
  {
    title: "Robot Companion",
    prompt:
      "Illustrate a friendly robot companion with a unique design and personality.",
    category: "Image Prompts",
  },
  {
    title: "Medieval Battle",
    prompt:
      "Create an image depicting an epic medieval battle between knights and dragons.",
    category: "Image Prompts",
  },
  {
    title: "Haunted House",
    prompt:
      "Draw a spooky haunted house with ghostly figures and eerie lighting.",
    category: "Image Prompts",
  },
  {
    title: "Space Exploration",
    prompt:
      "Illustrate astronauts exploring a distant planet with strange rock formations.",
    category: "Image Prompts",
  },
  {
    title: "Mythical Creature",
    prompt:
      "Create an image of a mythical creature, such as a griffin or a phoenix.",
    category: "Image Prompts",
  },
  {
    title: "Cyberpunk Street",
    prompt:
      "Design a cyberpunk street scene with neon lights and futuristic technology.",
    category: "Image Prompts",
  },
  {
    title: "Ancient Temple",
    prompt:
      "Draw an ancient temple hidden deep within a jungle, overgrown with vines.",
    category: "Image Prompts",
  },
  {
    title: "Winter Wonderland",
    prompt:
      "Illustrate a serene winter wonderland with snow-covered trees and a cozy cabin.",
    category: "Image Prompts",
  },
  {
    title: "Desert Oasis",
    prompt: "Create an image of a lush oasis in the middle of a vast desert.",
    category: "Image Prompts",
  },
  {
    title: "Pirate Ship",
    prompt:
      "Design a pirate ship sailing on the high seas, complete with pirate crew and treasure.",
    category: "Image Prompts",
  },
  {
    title: "Victorian Street",
    prompt:
      "Draw a bustling Victorian street scene with carriages and people in period clothing.",
    category: "Image Prompts",
  },
  {
    title: "Magical Portal",
    prompt:
      "Illustrate a magical portal that leads to another world, with glowing edges and mysterious surroundings.",
    category: "Image Prompts",
  },
  {
    title: "Dystopian Future",
    prompt:
      "Create an image of a dystopian future city with decaying buildings and oppressive atmosphere.",
    category: "Image Prompts",
  },
  {
    title: "Ancient Ruins",
    prompt:
      "Draw ancient ruins being reclaimed by nature, with crumbling structures and overgrown vegetation.",
    category: "Image Prompts",
  },
  {
    title: "Surpassing Human Intelligence",
    prompt:
      "Describe a society where intelligence has surpassed human intelligence and its implications on society.",
    category: "Video Prompts",
  },
  {
    title: "Space Exploration",
    prompt:
      "Imagine a scenario where advanced technology is used for space exploration. How does it impact space missions and discoveries?",
    category: "Video Prompts",
  },
  {
    title: "Combating Climate Change",
    prompt:
      "Discuss how technology can be utilized to combat climate change and its potential effects on the environment.",
    category: "Video Prompts",
  },
  {
    title: "Healthcare Revolution",
    prompt:
      "Envision a future where technology plays a significant role in healthcare. How does it change patient care and medical practices?",
    category: "Video Prompts",
  },
  {
    title: "Personal Privacy Risks",
    prompt:
      "Examine the potential risks and benefits of technology on personal privacy and data security.",
    category: "Video Prompts",
  },
  {
    title: "Education Transformation",
    prompt:
      "Explore how technology can revolutionize education and personalized learning experiences.",
    category: "Video Prompts",
  },
  {
    title: "Job Automation",
    prompt: "Discuss the impact of automation on the future of work.",
    category: "Video Prompts",
  },
  {
    title: "Entertainment Evolution",
    prompt:
      "Imagine how technology could transform the entertainment industry, from movies to video games.",
    category: "Video Prompts",
  },
  {
    title: "Ethical Dilemmas",
    prompt:
      "Debate the ethical considerations and dilemmas associated with the advancement of technology.",
    category: "Video Prompts",
  },
  {
    title: "Smart Cities",
    prompt:
      "Describe how technology could be integrated into the development of smart cities and urban planning.",
    category: "Video Prompts",
  },
  {
    title: "Transportation Changes",
    prompt:
      "Discuss the potential changes in transportation with the integration of advanced technology, such as self-driving cars and smart traffic management.",
    category: "Video Prompts",
  },
  {
    title: "Finance Innovations",
    prompt:
      "Explore the role of technology in the financial sector, including investment strategies and fraud detection.",
    category: "Video Prompts",
  },
  {
    title: "Creative Assistance",
    prompt:
      "Imagine a world where technology assists in creative fields such as art, music, and writing. What are the possibilities?",
    category: "Video Prompts",
  },
  {
    title: "Retail Transformation",
    prompt:
      "Discuss the potential impact of technology on the retail industry, including personalized shopping experiences and inventory management.",
    category: "Video Prompts",
  },
  {
    title: "Human Relationships",
    prompt:
      "Examine how technology might affect human relationships, including friendships and romantic partnerships.",
    category: "Video Prompts",
  },
  {
    title: "Agricultural Advancements",
    prompt:
      "Explore the ways technology could revolutionize agriculture and food production.",
    category: "Video Prompts",
  },
  {
    title: "Disaster Management",
    prompt:
      "Discuss how technology can be used in disaster management and emergency response.",
    category: "Video Prompts",
  },
  {
    title: "Cybersecurity Enhancement",
    prompt:
      "Analyze the role of technology in enhancing cybersecurity measures and protecting against cyber threats.",
    category: "Video Prompts",
  },
  {
    title: "Virtual Reality",
    prompt:
      "Imagine the possibilities of combining technology with virtual reality to create immersive experiences.",
    category: "Video Prompts",
  },
  {
    title: "Improving Aging",
    prompt:
      "Discuss how technology could assist in improving the quality of life for the aging population.",
    category: "Video Prompts",
  },
];
