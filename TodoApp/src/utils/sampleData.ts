import { Task, Priority, RecurrencePattern, Category } from '../store/taskStore';
import { Subtask } from '../store/subtaskStore';

// Helper function to create a date with a specific offset from today
const createDate = (dayOffset: number, hourOffset: number = 0): Date => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(date.getHours() + hourOffset);
  return date;
};

// Sample categories
export const getSampleCategories = (): Category[] => [
  {
    id: '1',
    name: 'Work',
    color: '#FF5722' // Orange
  },
  {
    id: '2',
    name: 'Personal',
    color: '#2196F3' // Blue
  },
  {
    id: '3',
    name: 'Shopping',
    color: '#4CAF50' // Green
  },
  {
    id: '4',
    name: 'Health',
    color: '#E91E63' // Pink
  },
  {
    id: '5',
    name: 'Education',
    color: '#9C27B0' // Purple
  },
  {
    id: '6',
    name: 'Fitness',
    color: '#F44336' // Red
  },
  {
    id: '7',
    name: 'Coding',
    color: '#3F51B5' // Indigo
  },
  {
    id: '8',
    name: 'Home',
    color: '#795548' // Brown
  },
  {
    id: '9',
    name: 'Habits',
    color: '#009688' // Teal
  },
  {
    id: '10',
    name: 'Study',
    color: '#FFC107' // Amber
  }
];

// Sample tasks
export const getSampleTasks = (): Task[] => [
  // Work Tasks
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal for the marketing team',
    completed: false,
    category: 'Work',
    dueDate: createDate(2, 10), // Due in 2 days
    createdAt: createDate(-1), // Created yesterday
    priority: 'high' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '2',
    title: 'Team meeting',
    description: 'Weekly team sync-up meeting',
    completed: false,
    category: 'Work',
    dueDate: createDate(1, 9), // Due tomorrow at 9 AM
    createdAt: createDate(-5), // Created 5 days ago
    priority: 'high' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '3',
    title: 'Prepare quarterly report',
    description: 'Compile data and create slides for the quarterly review',
    completed: false,
    category: 'Work',
    dueDate: createDate(5), 
    createdAt: createDate(-2),
    priority: 'medium' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Shopping Tasks
  {
    id: '4',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits, and vegetables',
    completed: false,
    category: 'Shopping',
    dueDate: createDate(0, 5), // Due today in 5 hours
    createdAt: createDate(-2), // Created 2 days ago
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '5',
    title: 'Order office supplies',
    description: 'Notebooks, pens, sticky notes, and printer paper',
    completed: false,
    category: 'Shopping',
    dueDate: createDate(3),
    createdAt: createDate(-1),
    priority: 'low' as Priority,
    recurrence: 'monthly' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Health Tasks
  {
    id: '6',
    title: 'Morning jog',
    description: 'Run for 30 minutes in the park',
    completed: true,
    category: 'Health',
    createdAt: createDate(-3), // Created 3 days ago
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: createDate(-1) // Completed yesterday
  },
  {
    id: '7',
    title: 'Doctor appointment',
    description: 'Annual check-up at Dr. Smith\'s office',
    completed: false,
    category: 'Health',
    dueDate: createDate(7),
    createdAt: createDate(-10),
    priority: 'high' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '8',
    title: 'Take vitamins',
    description: 'Daily vitamin and supplement routine',
    completed: false,
    category: 'Health',
    createdAt: createDate(-5),
    priority: 'low' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Education Tasks
  {
    id: '9',
    title: 'Read chapter 5',
    description: 'Read chapter 5 of "React Native in Action"',
    completed: false,
    category: 'Education',
    dueDate: createDate(3), // Due in 3 days
    createdAt: createDate(-1), // Created yesterday
    priority: 'medium' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '10',
    title: 'Complete online course module',
    description: 'Finish the JavaScript advanced concepts module',
    completed: false,
    category: 'Education',
    dueDate: createDate(4),
    createdAt: createDate(-3),
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Personal Tasks
  {
    id: '11',
    title: 'Call mom',
    description: 'Weekly call with mom to catch up',
    completed: false,
    category: 'Personal',
    dueDate: createDate(1), // Due tomorrow
    createdAt: createDate(-2), // Created 2 days ago
    priority: 'high' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '12',
    title: 'Pay utility bills',
    description: 'Pay electricity, water, and internet bills',
    completed: false,
    category: 'Personal',
    dueDate: createDate(5), // Due in 5 days
    createdAt: createDate(-1), // Created yesterday
    priority: 'medium' as Priority,
    recurrence: 'monthly' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Fitness Tasks
  {
    id: '13',
    title: 'Gym workout',
    description: 'Upper body strength training',
    completed: false,
    category: 'Fitness',
    createdAt: createDate(-1),
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '14',
    title: 'Yoga session',
    description: '30-minute flexibility and mindfulness practice',
    completed: false,
    category: 'Fitness',
    dueDate: createDate(0, 18), // Today evening
    createdAt: createDate(-7),
    priority: 'low' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '15',
    title: 'Track weekly fitness progress',
    description: 'Update measurements and progress photos',
    completed: false,
    category: 'Fitness',
    dueDate: createDate(2),
    createdAt: createDate(-5),
    priority: 'low' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Coding Tasks
  {
    id: '16',
    title: 'Fix app bugs',
    description: 'Address reported issues in the mobile app',
    completed: false,
    category: 'Coding',
    dueDate: createDate(1),
    createdAt: createDate(-1),
    priority: 'high' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '17',
    title: 'Code review',
    description: 'Review pull requests from team members',
    completed: false,
    category: 'Coding',
    dueDate: createDate(0, 3), // Today in 3 hours
    createdAt: createDate(-1),
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '18',
    title: 'Learn new framework',
    description: 'Complete tutorial on Vue.js 3',
    completed: false,
    category: 'Coding',
    dueDate: createDate(10),
    createdAt: createDate(-3),
    priority: 'low' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Home Tasks
  {
    id: '19',
    title: 'Clean kitchen',
    description: 'Deep clean appliances and organize pantry',
    completed: false,
    category: 'Home',
    dueDate: createDate(2),
    createdAt: createDate(-1),
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '20',
    title: 'Laundry day',
    description: 'Wash, dry, fold, and put away clothes',
    completed: false,
    category: 'Home',
    dueDate: createDate(0), // Today
    createdAt: createDate(-3),
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '21',
    title: 'Garden maintenance',
    description: 'Water plants, remove weeds, and trim bushes',
    completed: false,
    category: 'Home',
    dueDate: createDate(3),
    createdAt: createDate(-2),
    priority: 'low' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Habits Tasks
  {
    id: '22',
    title: 'Drink water',
    description: 'Drink 8 glasses of water throughout the day',
    completed: false,
    category: 'Habits',
    createdAt: createDate(-10),
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '23',
    title: 'Morning meditation',
    description: '10 minutes of mindfulness meditation',
    completed: false,
    category: 'Habits',
    createdAt: createDate(-15),
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '24',
    title: 'Journal entry',
    description: 'Write daily reflections and gratitude list',
    completed: false,
    category: 'Habits',
    createdAt: createDate(-20),
    priority: 'low' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '25',
    title: 'Early wake up',
    description: 'Wake up at 6:00 AM',
    completed: false,
    category: 'Habits',
    createdAt: createDate(-5),
    priority: 'high' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  },
  
  // Study Tasks
  {
    id: '26',
    title: 'Study for final exam',
    description: 'Review chapters 7-10 for Computer Science exam',
    completed: false,
    category: 'Study',
    dueDate: createDate(5),
    createdAt: createDate(-3),
    priority: 'high' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '27',
    title: 'Complete assignment',
    description: 'Finish the research paper on machine learning',
    completed: false,
    category: 'Study',
    dueDate: createDate(2),
    createdAt: createDate(-7),
    priority: 'high' as Priority,
    recurrence: 'none' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '28',
    title: 'Group project meeting',
    description: 'Meet with study group to divide tasks',
    completed: false,
    category: 'Study',
    dueDate: createDate(1),
    createdAt: createDate(-2),
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '29',
    title: 'Review lecture notes',
    description: 'Go through this week\'s lecture materials',
    completed: false,
    category: 'Study',
    dueDate: createDate(0, 20), // Today evening
    createdAt: createDate(-1),
    priority: 'medium' as Priority,
    recurrence: 'weekly' as RecurrencePattern,
    lastModified: new Date()
  },
  {
    id: '30',
    title: 'Practice coding problems',
    description: 'Solve 5 algorithm challenges on LeetCode',
    completed: false,
    category: 'Study',
    dueDate: createDate(3),
    createdAt: createDate(-2),
    priority: 'medium' as Priority,
    recurrence: 'daily' as RecurrencePattern,
    lastModified: new Date()
  }
];

// Sample subtasks
export const getSampleSubtasks = (): Subtask[] => [
  // Project proposal subtasks
  {
    id: '101',
    parentId: '1', // For "Complete project proposal"
    title: 'Research market trends',
    completed: true,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '102',
    parentId: '1', // For "Complete project proposal"
    title: 'Create presentation slides',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '103',
    parentId: '1', // For "Complete project proposal"
    title: 'Review with team lead',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '104',
    parentId: '1',
    title: 'Prepare budget estimates',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Team meeting subtasks
  {
    id: '201',
    parentId: '2', // For "Team meeting"
    title: 'Prepare agenda',
    completed: false,
    createdAt: createDate(-3),
    lastModified: new Date()
  },
  {
    id: '202',
    parentId: '2', // For "Team meeting"
    title: 'Send calendar invites',
    completed: true,
    createdAt: createDate(-3),
    lastModified: new Date()
  },
  {
    id: '203',
    parentId: '2',
    title: 'Book meeting room',
    completed: true,
    createdAt: createDate(-3),
    lastModified: new Date()
  },
  
  // Groceries subtasks
  {
    id: '401',
    parentId: '4', // For "Buy groceries"
    title: 'Check pantry inventory',
    completed: true,
    createdAt: createDate(-2),
    lastModified: new Date()
  },
  {
    id: '402',
    parentId: '4', // For "Buy groceries"
    title: 'Make shopping list',
    completed: true,
    createdAt: createDate(-2),
    lastModified: new Date()
  },
  {
    id: '403',
    parentId: '4',
    title: 'Check for coupons',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Reading subtasks
  {
    id: '901',
    parentId: '9', // For "Read chapter 5"
    title: 'Take notes',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '902',
    parentId: '9', // For "Read chapter 5"
    title: 'Complete exercises',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '903',
    parentId: '9',
    title: 'Summarize key concepts',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Fix app bugs subtasks
  {
    id: '1601',
    parentId: '16', // For "Fix app bugs"
    title: 'Reproduce reported issues',
    completed: true,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1602',
    parentId: '16',
    title: 'Fix navigation bug',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1603',
    parentId: '16',
    title: 'Fix data loading issue',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1604',
    parentId: '16',
    title: 'Write unit tests',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Study for final exam subtasks
  {
    id: '2601',
    parentId: '26', // For "Study for final exam"
    title: 'Create study guide',
    completed: true,
    createdAt: createDate(-3),
    lastModified: new Date()
  },
  {
    id: '2602',
    parentId: '26',
    title: 'Review chapter 7',
    completed: false,
    createdAt: createDate(-2),
    lastModified: new Date()
  },
  {
    id: '2603',
    parentId: '26',
    title: 'Review chapter 8',
    completed: false,
    createdAt: createDate(-2),
    lastModified: new Date()
  },
  {
    id: '2604',
    parentId: '26',
    title: 'Review chapter 9',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '2605',
    parentId: '26',
    title: 'Review chapter 10',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '2606',
    parentId: '26',
    title: 'Practice with past exams',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Gym workout subtasks
  {
    id: '1301',
    parentId: '13', // For "Gym workout"
    title: 'Chest exercises',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1302',
    parentId: '13',
    title: 'Back exercises',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1303',
    parentId: '13',
    title: 'Shoulder exercises',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1304',
    parentId: '13',
    title: 'Arm exercises',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Clean kitchen subtasks
  {
    id: '1901',
    parentId: '19', // For "Clean kitchen"
    title: 'Clean refrigerator',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1902',
    parentId: '19',
    title: 'Clean oven',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1903',
    parentId: '19',
    title: 'Wipe countertops',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1904',
    parentId: '19',
    title: 'Organize pantry',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  {
    id: '1905',
    parentId: '19',
    title: 'Mop floor',
    completed: false,
    createdAt: createDate(-1),
    lastModified: new Date()
  },
  
  // Drink water subtasks
  {
    id: '2201',
    parentId: '22', // For "Drink water"
    title: 'Morning glass (8am)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2202',
    parentId: '22',
    title: 'Mid-morning glass (10am)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2203',
    parentId: '22',
    title: 'Lunch glass (12pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2204',
    parentId: '22',
    title: 'Afternoon glass (2pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2205',
    parentId: '22',
    title: 'Late afternoon glass (4pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2206',
    parentId: '22',
    title: 'Dinner glass (6pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2207',
    parentId: '22',
    title: 'Evening glass (8pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  },
  {
    id: '2208',
    parentId: '22',
    title: 'Before bed glass (10pm)',
    completed: false,
    createdAt: createDate(-10),
    lastModified: new Date()
  }
];