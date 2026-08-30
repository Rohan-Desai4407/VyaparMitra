import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { Bell, HelpCircle } from "lucide-react";

// Assume these icons are imported from an icon library
import { Sliders, Wallet } from "lucide-react";
import {
  CalenderIcon,
  ChatIcon,
  ChevronDownIcon,
  DollarLineIcon,
  GridIcon,
  ListIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  } from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: t("nav.dashboard"),
      path: "/dashboard",
    },
    {
      icon: <ListIcon />,
      name: t("nav.assessment"),
      path: "/assessment",
    },
    {
      icon: <PieChartIcon />,
      name: t("nav.marketAnalysis"),
      path: "/market-analysis",
    },
    
    {
      icon: <DollarLineIcon />,
      name: t("nav.financialPlanner"),
      path: "/financial-planner",
    },
    {
      icon: <TableIcon />,
      name: t("nav.schemeRouter"),
      path: "/scheme-router",
    },
    {
      icon: <CalenderIcon />,
      name: t("nav.repaymentSchedule"),
      path: "/repayment-schedule",
    },
    {
      icon: <ChatIcon />,
      name: t("nav.aiAdvisor"),
      path: "/ai-advisor",
    },
    {
      icon: <Sliders className="w-5 h-5" />,
      name: t("nav.whatIfSimulator", "What-if Simulator"),
      path: "/what-if-simulator",
    },
    {
      icon: <PageIcon />,
      name: t("nav.finalReport"),
      path: "/final-report",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      name: t("nav.notifications", "Notifications"),
      path: "/notifications",
    },
  ];

  const othersItems: NavItem[] = [
    {
      icon: <HelpCircle className="w-5 h-5" />,
      name: t("nav.aboutUs", "About Us"),
      path: "/about",
    }
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              title={(!isExpanded && !isHovered && !isMobileOpen) ? nav.name : undefined}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                title={(!isExpanded && !isHovered && !isMobileOpen) ? nav.name : undefined}
                aria-current={isActive(nav.path) ? "page" : undefined}
                className={`menu-item group ${
                  isActive(nav.path) 
                    ? menuType === 'others'
                      ? "menu-item-active !bg-amber-50 !text-amber-600 dark:!bg-amber-500/[0.15] dark:!text-amber-400"
                      : "menu-item-active" 
                    : "menu-item-inactive"
                }`}
              >
                {isActive(nav.path) && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/5 rounded-r-full transition-opacity duration-200 ${
                    menuType === 'others' 
                      ? 'bg-amber-500 dark:bg-amber-400' 
                      : 'bg-brand-500 dark:bg-brand-400'
                  }`} />
                )}
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? menuType === 'others'
                        ? "menu-item-icon-active !text-amber-600 dark:!text-amber-400"
                        : "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      aria-current={isActive(subItem.path) ? "page" : undefined}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex items-center ${
          !isExpanded && !isHovered ? "lg:justify-center px-0" : "justify-start px-2"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 w-full">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center shrink-0">
                <img
                  src="/images/logo/vyapar-mitra-icon.png"
                  alt="VyaparMitra Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                  Vyapar<span className="text-emerald-600 dark:text-emerald-400">Mitra</span>
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-emerald-300/90 tracking-wider uppercase mt-1">
                  {t("common.appTagline")}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center shrink-0 w-full">
              <img
                src="/images/logo/vyapar-mitra-icon.png"
                alt="VyaparMitra Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6 flex flex-col flex-1">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
          
          <div className="mt-auto flex flex-col gap-4 pt-4">
            {/* Divider */}
            <div className={`h-[1px] bg-gray-200 dark:bg-gray-800 mx-2 transition-all duration-300 ${!isExpanded && !isHovered && !isMobileOpen ? 'opacity-50' : 'opacity-100'}`} />

            {/* Others Items */}
            <div>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;


