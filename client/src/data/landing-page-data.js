import { MoveHorizontal, Users, BarChart3, Bell, MessageSquare, Cloud } from "lucide-react";
import React from "react";

// Demo components for feature backgrounds - with reduced height
const DragDropDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="flex gap-1 h-full text-[8px]">
        <div className="bg-blue-50/80 rounded p-1 flex-1 flex flex-col">
          <div className="font-medium mb-0.5">To Do</div>
          <div className="bg-white shadow rounded p-0.5 mb-0.5 border-l-2 border-blue-400 group-hover:animate-pulse cursor-grab">
            Task #1
          </div>
          <div className="bg-white shadow rounded p-0.5 border-l-2 border-red-400 cursor-grab">
            Bug Fix
          </div>
        </div>
        <div className="bg-blue-50/80 rounded p-1 flex-1 flex flex-col">
          <div className="font-medium mb-0.5">In Progress</div>
          <div className="bg-white shadow rounded p-0.5 border-l-2 border-yellow-400 cursor-grab">
            Feature
          </div>
        </div>
        <div className="bg-blue-50/80 rounded p-1 flex-1 flex flex-col">
          <div className="font-medium mb-0.5">Done</div>
        </div>
      </div>
    </div>
  </div>
);

const CollaborationDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="bg-white/80 rounded-lg p-1.5 h-full flex flex-col">
        <div className="flex space-x-1 mb-1">
          <div className="h-3 w-3 rounded-full bg-blue-400 border-2 border-white"></div>
          <div className="h-3 w-3 rounded-full bg-green-400 border-2 border-white -ml-1 group-hover:animate-pulse"></div>
          <div className="h-3 w-3 rounded-full bg-purple-400 border-2 border-white -ml-1"></div>
        </div>
        <div className="flex-1 bg-gray-50 rounded p-1 text-[6px] relative">
          <div className="mb-0.5 flex items-center">
            <div className="h-2 w-2 rounded-full bg-blue-400 mr-0.5"></div>
            <span>Just updated Task #3</span>
          </div>
          <div className="mb-0.5 flex items-center">
            <div className="h-2 w-2 rounded-full bg-purple-400 mr-0.5"></div>
            <span>Added a comment</span>
          </div>
          <div className="mb-0.5 flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-0.5"></div>
            <span>Assigned Task #5</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="bg-white/80 rounded-lg p-1.5 h-full flex flex-col">
        <div className="text-[8px] font-medium mb-0.5">Task Completion</div>
        <div className="flex-1 flex items-end gap-0.5">
          <div className="bg-blue-300 w-1/7 h-[30%] rounded-t group-hover:h-[40%] transition-all duration-700"></div>
          <div className="bg-blue-400 w-1/7 h-[45%] rounded-t group-hover:h-[55%] transition-all duration-700"></div>
          <div className="bg-blue-500 w-1/7 h-[60%] rounded-t group-hover:h-[70%] transition-all duration-700"></div>
          <div className="bg-blue-600 w-1/7 h-[75%] rounded-t group-hover:h-[85%] transition-all duration-700"></div>
          <div className="bg-blue-700 w-1/7 h-[65%] rounded-t group-hover:h-[75%] transition-all duration-700"></div>
          <div className="bg-blue-800 w-1/7 h-[80%] rounded-t group-hover:h-[90%] transition-all duration-700"></div>
          <div className="bg-blue-900 w-1/7 h-[70%] rounded-t group-hover:h-[80%] transition-all duration-700"></div>
        </div>
        <div className="flex justify-between text-[5px] text-gray-500 mt-0.5">
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
          <span>S</span>
          <span>S</span>
        </div>
      </div>
    </div>
  </div>
);

const ChatDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="bg-white/80 rounded-lg p-1.5 h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-0.5"></div>
            <span className="text-[6px] font-medium">Team Chat</span>
          </div>
          <MessageSquare className="h-2 w-2 text-gray-400" />
        </div>
        <div className="flex-1 bg-gray-50 rounded p-0.5 text-[5px] flex flex-col justify-end">
          <div className="bg-blue-100 self-start rounded-lg p-0.5 mb-0.5 max-w-[80%]">
            How's the progress?
          </div>
          <div className="bg-gray-100 self-end rounded-lg p-0.5 mb-0.5 max-w-[80%]">
            Almost done!
          </div>
          <div className="bg-blue-100 self-start rounded-lg p-0.5 max-w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            Great! Let's review.
          </div>
          <div className="text-gray-400 text-center text-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
            Alex is typing...
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CloudSyncDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="bg-white/80 rounded-lg p-1.5 h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[6px] font-medium">Cloud Storage</span>
          <Cloud className="h-2 w-2 text-blue-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-blue-50 rounded p-0.5 mb-0.5 text-[5px] flex items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-0.5 group-hover:animate-pulse"></div>
            <span>Documents (23 files)</span>
          </div>
          <div className="bg-blue-50 rounded p-0.5 mb-0.5 text-[5px] flex items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-0.5"></div>
            <span>Images (7 files)</span>
          </div>
          <div className="mt-auto text-[5px] text-center">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full w-[45%] group-hover:w-[100%] transition-all duration-1000"></div>
            </div>
            <span className="text-gray-500">
              Storage: <span className="group-hover:hidden">45%</span>
              <span className="hidden group-hover:inline">100%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NotificationDemo = () => (
  <div className="absolute inset-0 top-0 h-[150px] group-hover:blur-none blur-xs transition-all duration-300">
    <div className="h-full w-full bg-white/30 backdrop-blur-xs rounded-lg p-1.5">
      <div className="bg-white/80 rounded-lg p-1.5 h-full flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[6px] font-medium">Notifications</span>
          <Bell className="h-2 w-2 text-amber-500" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
          {/* Priority notification */}
          <div className="bg-red-50 rounded p-0.5 text-[5px] flex items-start group-hover:animate-pulse">
            <div className="h-2 w-2 rounded-full bg-red-400 mr-0.5 shrink-0 mt-0.5"></div>
            <div>
              <div className="font-medium">Urgent Task</div>
              <div className="text-gray-500">Bug fix needed for login page</div>
            </div>
          </div>

          {/* Mention notification */}
          <div className="bg-blue-50 rounded p-0.5 text-[5px] flex items-start">
            <div className="h-2 w-2 rounded-full bg-blue-400 mr-0.5 shrink-0 mt-0.5"></div>
            <div>
              <div className="font-medium">Alex mentioned you</div>
              <div className="text-gray-500">Can you review PR #42?</div>
            </div>
          </div>

          {/* Assignment notification */}
          <div className="bg-green-50 rounded p-0.5 text-[5px] flex items-start">
            <div className="h-2 w-2 rounded-full bg-green-400 mr-0.5 shrink-0 mt-0.5"></div>
            <div>
              <div className="font-medium">New Assignment</div>
              <div className="text-gray-500">You've been assigned to "Landing Page"</div>
            </div>
          </div>

          {/* Hidden notification that appears on hover */}
          <div className="bg-purple-50 rounded p-0.5 text-[5px] flex items-start opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="h-2 w-2 rounded-full bg-purple-400 mr-0.5 shrink-0 mt-0.5"></div>
            <div>
              <div className="font-medium">Reminder</div>
              <div className="text-gray-500">Team meeting in 15 minutes</div>
            </div>
          </div>

          {/* Small badge counter at bottom */}
          <div className="mt-auto self-end">
            <div className="bg-amber-500 text-white rounded-full px-1 text-[5px] group-hover:animate-bounce">
              <span className="group-hover:hidden">3</span>
              <span className="hidden group-hover:inline">4</span> new
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const featureCards = [
  {
    Icon: MoveHorizontal,
    name: "Intuitive Drag & Drop",
    description:
      "Move tasks across your workflow with a simple gesture. Our intuitive interface makes task management effortless, letting you focus on what matters most.",
    href: "/features/drag-drop",
    cta: "Learn more",
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-2 group relative",
    background: <DragDropDemo />
  },
  {
    Icon: Users,
    name: "Real-time Collaboration",
    description:
      "See updates instantly without refreshing. Keep your entire team in sync with live changes that ensure everyone stays on the same page.",
    href: "/features/collaboration",
    cta: "Learn more",
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3 group relative",
    background: <CollaborationDemo />
  },
  {
    Icon: BarChart3,
    name: "Powerful Analytics",
    description:
      "Identify bottlenecks and optimize productivity through visual data insights. Make informed decisions with charts that reveal the health of your projects.",
    href: "/features/analytics",
    cta: "Learn more",
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-3 lg:col-end-4 group relative",
    background: <AnalyticsDemo />
  },
  {
    Icon: Bell,
    name: "Smart Notifications",
    description:
      "Efficient notification system ensures nothing falls through the cracks, keeping everyone accountable. Get notified about task updates and mentions without the noise.",
    href: "/features/notifications",
    cta: "Learn more",
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2 group relative",
    background: <NotificationDemo />
  },
  {
    Icon: MessageSquare,
    name: "Integrated Chat",
    description:
      "Stay connected with your team through built-in messaging across all project spaces. Discuss tasks without ever leaving your workflow.",
    href: "/features/chat",
    cta: "Learn more",
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-3 group relative",
    background: <ChatDemo />
  },
  {
    Icon: Cloud,
    name: "Cloud Sync",
    description:
      "Secure cloud storage keeps your data safe and accessible anywhere. Collaborate seamlessly across devices with real-time synchronization.",
    href: "/features/cloud-sync",
    cta: "Learn more",
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-3 lg:col-end-4 group relative",
    background: <CloudSyncDemo />
  }
];

export const stats = [
  { value: 30, label: "Uptime" },
  { value: 1578, label: "Active Users" },
  { value: 12434, label: "Tasks Completed" },
  { value: 2, label: "Integrations" }
];

export const testimonials = [
  {
    quote:
      "Kanbask has completely transformed how our team collaborates. The real-time updates and intuitive interface have boosted our productivity by 30%.",
    author: "Sarah Johnson",
    title: "Product Manager, Acme Inc.",
    avatar: "/images/sarah.jpg"
  },
  {
    quote:
      "The analytics features alone are worth the price. We've identified and eliminated multiple workflow bottlenecks that were costing us hours each week.",
    author: "Michael Chen",
    title: "CTO, TechStart",
    avatar: "/images/michael.jpg"
  },
  {
    quote:
      "Our remote team stays perfectly in sync thanks to Kanbask. The integrated chat and task management is a game-changer for cross-functional projects.",
    author: "Elena Rodriguez",
    title: "Team Lead, Global Solutions",
    avatar: "/images/elena.jpg"
  }
];

export const quotes = [
  "Simplify your workflow, amplify your productivity",
  "Organize. Prioritize. Accomplish",
  "Focus on what matters. Let Kanbask handle the rest",
  "Your tasks, your way"
];

export const subQuotes = [
  "The elegant task management solution for teams and individuals",
  "Kanbask makes project management effortless",
  "A simple, elegant solution for managing projects and teams"
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Up to 5 users",
      "Basic features",
      "Limited integrations",
      "Community support",
      "1 GB storage"
    ],
    cta: "Get Started",
    href: "/signup/free"
  },
  {
    name: "Pro",
    price: "$10/month",
    features: [
      "Up to 50 users",
      "All features",
      "Unlimited integrations",
      "Priority support",
      "10 GB storage"
    ],
    cta: "Get Started",
    href: "/signup/pro"
  },
  {
    name: "Enterprise",
    price: "$30/month",
    features: [
      "Unlimited users",
      "All features",
      "Custom integrations",
      "Dedicated support",
      "100 GB storage"
    ],
    cta: "Contact Us",
    href: "/contact/enterprise"
  }
];
