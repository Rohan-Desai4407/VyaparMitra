import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";

export default function UserDropdown() {
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
  const [completionValue, setCompletionValue] = useState<number>(0);

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

        <span className="block mr-1 font-medium text-theme-sm">{firstName}</span>
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
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {userName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {userEmail}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Profile
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
