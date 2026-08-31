import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link, useNavigate } from "react-router";
import { useNotifications, AppNotification } from "../../context/NotificationContext";
import {
  Landmark,
  TrendingUp,
  Sparkles,
  Building2,
  AlertCircle,
  Info,
  Bell,
} from "lucide-react";

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleNotificationClick = (item: AppNotification) => {
    markAsRead(item.id);
    closeDropdown();
    if (item.actionUrl) {
      navigate(item.actionUrl);
    } else {
      navigate("/notifications");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "scheme":
        return <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "finance":
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "ai":
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "business":
      case "market":
        return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "important":
        return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  const latestNotifications = notifications.slice(0, 4);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={() => {
          closeDropdown();
          navigate("/notifications");
        }}
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[361px] lg:right-0 z-9999"
      >
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-bold text-gray-900 dark:text-white">
              {t("notifications.title", "Notifications")}
            </h5>
            {unreadCount > 0 && (
              <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} {t("notifications.unread", "new")}
              </span>
            )}
          </div>
          <button
            onClick={closeDropdown}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            ✕
          </button>
        </div>

        <ul className="flex flex-col flex-1 overflow-y-auto custom-scrollbar divide-y divide-gray-100 dark:divide-gray-800/60">
          {latestNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("notifications.noNotifications", "No notifications yet")}
              </p>
            </div>
          ) : (
            latestNotifications.map((item) => (
              <li key={item.id}>
                <DropdownItem
                  onItemClick={() => handleNotificationClick(item)}
                  className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors ${
                    !item.read ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span
                        className={`text-xs truncate ${
                          !item.read
                            ? "font-bold text-gray-900 dark:text-white"
                            : "font-medium text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="block mt-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                      {item.timestamp}
                    </span>
                  </div>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        <Link
          to="/notifications"
          onClick={closeDropdown}
          className="block w-full px-4 py-2.5 mt-2 text-xs font-bold text-center text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-xl transition-colors border border-emerald-200/50 dark:border-emerald-800/40"
        >
          {t("notifications.viewAll", "View All Notifications")} →
        </Link>
      </Dropdown>
    </div>
  );
}
