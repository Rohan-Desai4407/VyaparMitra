import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  useNotifications,
  AppNotification,
  NotificationType,
} from "../context/NotificationContext";
import {
  Bell,
  CheckCheck,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  ExternalLink,
  Landmark,
  TrendingUp,
  Sparkles,
  Building2,
  AlertCircle,
  Info,
  X,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function Notifications() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedNotif, setSelectedNotif] = useState<AppNotification | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(6);

  const filterOptions: { key: string; label: string }[] = [
    { key: "all", label: t("notifications.filterAll", "All") },
    { key: "unread", label: t("notifications.filterUnread", "Unread") },
    { key: "important", label: t("notifications.filterImportant", "Important") },
    { key: "business", label: t("notifications.filterBusiness", "Business") },
    { key: "finance", label: t("notifications.filterFinance", "Finance") },
    { key: "scheme", label: t("notifications.filterScheme", "Government Schemes") },
    { key: "ai", label: t("notifications.filterAi", "AI Recommendations") },
    { key: "system", label: t("notifications.filterSystem", "System") },
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category / Type filter
      let matchesFilter = true;
      if (activeFilter === "unread") {
        matchesFilter = !item.read;
      } else if (activeFilter === "important") {
        matchesFilter = item.importance === "high" || item.type === "important";
      } else if (activeFilter !== "all") {
        matchesFilter = item.type === activeFilter;
      }

      // Search query filter
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          Boolean(item.fullMessage && item.fullMessage.toLowerCase().includes(query));
      }

      return matchesFilter && matchesSearch;
    });
  }, [notifications, activeFilter, searchQuery]);

  const visibleNotifications = filteredNotifications.slice(0, displayCount);
  const hasMore = displayCount < filteredNotifications.length;

  const handleCardClick = (notification: AppNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotif(notification);
  };

  const handleActionClick = (e: React.MouseEvent, notification: AppNotification) => {
    e.stopPropagation();
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "scheme":
        return {
          icon: <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
          text: t("notifications.typeScheme", "Government Scheme"),
        };
      case "finance":
        return {
          icon: <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />,
          bg: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800",
          text: t("notifications.typeFinance", "Finance"),
        };
      case "ai":
        return {
          icon: <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bg: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
          text: t("notifications.typeAi", "AI Advisor"),
        };
      case "business":
        return {
          icon: <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
          text: t("notifications.typeBusiness", "Business"),
        };
      case "market":
        return {
          icon: <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
          bg: "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800",
          text: t("notifications.typeMarket", "Local Market"),
        };
      case "important":
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          bg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
          text: t("notifications.typeImportant", "Important"),
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />,
          bg: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
          text: t("notifications.typeSystem", "System"),
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-700 dark:text-emerald-400">
              <Bell className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("notifications.headerTitle", "Notifications")}
            </h1>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                {unreadCount} {t("notifications.unreadCount", "unread")}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {t(
              "notifications.headerDesc",
              "Stay updated with important information, recommendations, and activity related to your business."
            )}
          </p>
        </div>

        {/* Header Action: Mark All as Read */}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-xl border border-emerald-200/60 dark:border-emerald-800/60 transition-all shadow-sm shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            {t("notifications.markAllAsRead", "Mark all as read")}
          </button>
        )}
      </div>

      {/* ── CONTROLS: SEARCH & FILTER PILLS ── */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("notifications.searchPlaceholder", "Search notifications...")}
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-emerald-600 dark:focus:border-emerald-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0 mr-1" />
          {filterOptions.map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveFilter(tab.key);
                  setDisplayCount(6);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? "bg-[#0A4222] dark:bg-emerald-600 text-white border-[#0A4222] dark:border-emerald-600 shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── NOTIFICATION CARDS LIST ── */}
      {visibleNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {activeFilter === "unread"
              ? t("notifications.noUnreadTitle", "No unread notifications")
              : searchQuery
              ? t("notifications.noMatchTitle", "No notifications found")
              : t("notifications.emptyTitle", "You're all caught up!")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {activeFilter === "unread"
              ? t("notifications.noUnreadDesc", "You have read all your business notifications.")
              : searchQuery
              ? t("notifications.noMatchDesc", "Try modifying your search term or active filter.")
              : t("notifications.emptyDesc", "You don't have any new notifications right now.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleNotifications.map((item) => {
            const badge = getTypeBadge(item.type);
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                  !item.read
                    ? "bg-white dark:bg-gray-900 border-emerald-300 dark:border-emerald-800/80 shadow-md ring-1 ring-emerald-500/20"
                    : "bg-white/80 dark:bg-gray-900/60 border-gray-200/80 dark:border-gray-800/80 hover:bg-white dark:hover:bg-gray-900"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Icon & Unread Dot */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badge.bg}`}
                    >
                      {badge.icon}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
                        >
                          {badge.text}
                        </span>
                        {item.importance === "high" && (
                          <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            {t("notifications.importantBadge", "HIGH PRIORITY")}
                          </span>
                        )}
                        {!item.read && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            {t("notifications.unreadDot", "UNREAD")}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.timestamp}</span>
                      </div>
                    </div>

                    <h4
                      className={`text-base tracking-tight mb-1 ${
                        !item.read
                          ? "font-extrabold text-gray-900 dark:text-white"
                          : "font-bold text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium line-clamp-2">
                      {item.description}
                    </p>

                    {/* Bottom Toolbar & Action */}
                    <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/80">
                      <div>
                        {item.actionUrl && (
                          <button
                            onClick={(e) => handleActionClick(e, item)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          >
                            <span>{item.actionText || t("notifications.viewDetails", "View Details")}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Mark read / unread toggle */}
                        <button
                          onClick={() => (item.read ? markAsUnread(item.id) : markAsRead(item.id))}
                          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          title={item.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle className={`w-4 h-4 ${item.read ? "text-gray-400" : "text-emerald-500"}`} />
                        </button>

                        {/* Delete / Dismiss */}
                        <button
                          onClick={() => deleteNotification(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LOAD MORE BUTTON ── */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setDisplayCount((prev) => prev + 6)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            <span>{t("notifications.loadMore", "Load More Notifications")}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── NOTIFICATION DETAILS MODAL ── */}
      {selectedNotif && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    getTypeBadge(selectedNotif.type).bg
                  }`}
                >
                  {getTypeBadge(selectedNotif.type).icon}
                </div>
                <div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      getTypeBadge(selectedNotif.type).bg
                    }`}
                  >
                    {getTypeBadge(selectedNotif.type).text}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {selectedNotif.timestamp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                {selectedNotif.title}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {selectedNotif.fullMessage || selectedNotif.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {t("notifications.close", "Close")}
              </button>
              {selectedNotif.actionUrl && (
                <button
                  onClick={(e) => {
                    setSelectedNotif(null);
                    handleActionClick(e, selectedNotif);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A4222] dark:bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-green-900 dark:hover:bg-emerald-500 transition-colors shadow-md"
                >
                  <span>{selectedNotif.actionText || t("notifications.exploreFeature", "Explore Feature")}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
