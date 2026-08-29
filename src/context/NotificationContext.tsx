import React, { createContext, useContext, useState, useEffect } from "react";

export type NotificationType =
  | "business"
  | "finance"
  | "scheme"
  | "market"
  | "ai"
  | "important"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  fullMessage?: string;
  timestamp: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  importance?: "normal" | "high";
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    type: "scheme",
    title: "PMEGP Loan Subsidy Match Found",
    description: "Your business profile matches 3 government subsidy schemes up to ₹25 Lakhs.",
    fullMessage: "Based on your retail business assessment in Odisha, you qualify for the Prime Minister Employment Generation Programme (PMEGP). Margin money subsidy up to 35% is available for rural micro-enterprises.",
    timestamp: "10 min ago",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/scheme-router",
    actionText: "Explore Schemes",
    importance: "high",
  },
  {
    id: "notif-2",
    type: "ai",
    title: "AI Advisor Recommendation Ready",
    description: "New optimization strategy generated for reducing initial inventory overhead.",
    fullMessage: "VyaparMitra AI has analyzed your market feasibility data. We recommend vendor consolidation and seasonal batch ordering to improve working capital by 18%.",
    timestamp: "45 min ago",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/ai-advisor",
    actionText: "View AI Advice",
    importance: "high",
  },
  {
    id: "notif-3",
    type: "finance",
    title: "Monthly Cash Flow Projection Updated",
    description: "Financial planner estimates break-even point in month 7 of operation.",
    fullMessage: "Your updated financial planner report indicates a projected 24% gross profit margin with peak ROI projected at Month 14.",
    timestamp: "2 hours ago",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionUrl: "/financial-planner",
    actionText: "Open Financial Planner",
    importance: "normal",
  },
  {
    id: "notif-4",
    type: "market",
    title: "Local Demand Surge Detected",
    description: "Increased consumer demand for organic groceries detected in your target area.",
    fullMessage: "Hyper-local market analysis shows a 32% increase in consumer search volume for fresh organic produce within a 5km radius.",
    timestamp: "5 hours ago",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/market-analysis",
    actionText: "View Market Analysis",
    importance: "normal",
  },
  {
    id: "notif-5",
    type: "business",
    title: "Feasibility Assessment Score: 88/100",
    description: "Your business plan exhibits high viability and low financial risk.",
    fullMessage: "Congratulations! Your business assessment form completion score is 88/100, indicating strong market viability, clear target demographics, and solid unit economics.",
    timestamp: "Yesterday",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/assessment",
    actionText: "Review Assessment",
    importance: "normal",
  },
  {
    id: "notif-6",
    type: "important",
    title: "Repayment Schedule Reminder",
    description: "First installment milestone due date approaching in 14 days.",
    fullMessage: "Your projected loan repayment schedule shows your initial EMI due date on the 15th of next month. Review your repayment planner for early repayment incentives.",
    timestamp: "Yesterday",
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/repayment-schedule",
    actionText: "View Schedule",
    importance: "high",
  },
  {
    id: "notif-7",
    type: "system",
    title: "VyaparMitra Profile 100% Completed",
    description: "Your business details and location preferences have been verified.",
    fullMessage: "Your profile information, business type, location coordinates, and financial targets are fully verified. All AI recommendation models are active.",
    timestamp: "2 days ago",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionUrl: "/profile",
    actionText: "View Profile",
    importance: "normal",
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("vyapar_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse notifications", e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem("vyapar_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (
    data: Omit<AppNotification, "id" | "createdAt" | "read">
  ) => {
    const newNotif: AppNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
