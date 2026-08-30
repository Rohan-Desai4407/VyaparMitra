import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link, useNavigate } from "react-router";

export default function UserDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const initialUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) { return null; }
  })();

  const [userName, setUserName] = useState<string>(initialUser?.name || 'Entrepreneur');
  const [userEmail, setUserEmail] = useState<string>(initialUser?.email || 'user@vyaparmitra.in');
  const [userRole, setUserRole] = useState<string>(initialUser?.role || 'USER');
  const [completionValue, setCompletionValue] = useState<number>(0);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
    closeDropdown();
    navigate("/signin");
  };

  const calculateProgress = (userObj: any) => {
    if (!userObj) return 0;
    let filled = 0;
    let total = 8;
    if (userObj.name) filled++;
    if (userObj.email) filled++;
    if (userObj.personalDetails?.phone) filled++;
    if (userObj.businessDetails?.businessName) filled++;
    if (userObj.locationDetails?.state) filled++;
    if (userObj.financialDetails?.panNumber) filled++;
    if (userObj.kycDetails?.kycStatus === 'VERIFIED') filled += 2;
    return Math.min(100, Math.round((filled / total) * 100));
  };

  useEffect(() => {
    const loadUserData = () => {
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) {
        setAvatarSrc(savedAvatar);
      }

      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
          if (parsed.role) setUserRole(parsed.role);
          if (parsed.email === "admin@vyaparmitra.in" || parsed.email?.includes("admin")) {
            setUserRole("SUPER_ADMIN");
          }
          if (parsed.avatar || parsed.picture) {
            const img = parsed.avatar || parsed.picture;
            setAvatarSrc(img);
          }
          setCompletionValue(calculateProgress(parsed));
        } else {
          setCompletionValue(0);
        }
      } catch (e) {}
    };

    loadUserData();
    window.addEventListener("avatarUpdated", loadUserData);
    window.addEventListener("userUpdated", loadUserData);
    window.addEventListener("storage", loadUserData);

    return () => {
      window.removeEventListener("avatarUpdated", loadUserData);
      window.removeEventListener("userUpdated", loadUserData);
      window.removeEventListener("storage", loadUserData);
    };
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const firstName = userName.trim().split(" ")[0] || "User";

  const isAdminUser = userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userEmail === "admin@vyaparmitra.in" || userEmail.includes("admin");

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <div className="relative mr-3 w-[48px] h-[48px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-100 dark:text-gray-800" />
            <circle 
              cx="24" cy="24" r="22" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              fill="none" 
              strokeDasharray="138" 
              strokeDashoffset={138 - (138 * completionValue) / 100}
              className="text-brand-500 transition-all duration-1000 ease-out" 
            />
          </svg>
          <span className="overflow-hidden rounded-full h-[38px] w-[38px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 relative z-10">
            {avatarSrc ? (
              <img src={avatarSrc} alt="User" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        </div>

        <span className="block mr-1.5 font-medium text-theme-sm text-gray-800 dark:text-gray-200">{userName}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[250px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div className="pb-3 border-b border-gray-100 dark:border-gray-800/60">
          <span className="block font-semibold text-gray-800 text-theme-sm dark:text-gray-200">
            {userName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userEmail}
          </span>
        </div>

        <ul className="flex flex-col gap-1 py-2">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-2.5 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/ai-advisor"
              className="flex items-center gap-3 px-2.5 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Support
            </DropdownItem>
          </li>
          {(userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userEmail === "admin@vyaparmitra.in") && (
            <li>
              <DropdownItem
                onItemClick={closeDropdown}
                tag="a"
                to="/admin"
                className="flex items-center gap-3 px-3 py-2 font-semibold text-emerald-600 rounded-lg group text-theme-sm hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
              >
                Admin Panel
              </DropdownItem>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                closeDropdown();
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("userAvatar");
                window.dispatchEvent(new Event("userUpdated"));
                navigate("/");
              }}
              className="flex w-full items-center gap-3 px-3 py-2 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Sign Out
            </button>
          </li>
        </ul>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-2.5 py-2 font-medium text-red-500 hover:text-red-600 rounded-lg group text-theme-sm hover:bg-red-50/60 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
          >
            <svg className="w-5 h-5 text-red-500 dark:text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>
        </div>
      </Dropdown>
    </div>
  );
}
