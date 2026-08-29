import React, { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";
import { useNavigate } from "react-router";

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount?: (account: { name: string; email: string; avatar?: string }) => void;
}

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const sampleAccounts = [
    {
      name: "Rohan Desai",
      email: "rohandesai.entrepreneur@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Musharof Chowdhury",
      email: "musharof.vyapar@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const handleAccountClick = (account: { name: string; email: string; avatar?: string }) => {
    setSelectedEmail(account.email);
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("token", `google_oauth_token_${Date.now()}`);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: account.name,
          email: account.email,
          avatar: account.avatar,
          authProvider: "Google",
        })
      );
      window.dispatchEvent(new Event("storage"));
      if (onSelectAccount) onSelectAccount(account);
      setIsLoading(false);
      onClose();
      navigate("/dashboard");
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in font-sans">
      {/* Outer Window Chrome simulating browser window */}
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-xl bg-[#1f1f1f] text-white shadow-2xl border border-gray-800">
        
        {/* Fake Window Title Bar */}
        <div className="flex items-center justify-between bg-[#111111] px-4 py-2.5 border-b border-gray-800 text-xs text-gray-400 select-none">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-semibold text-gray-300">Sign in - Google Accounts</span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Inner Content matching Google Account Chooser dark theme */}
        <div className="bg-[#18181b] p-8">
          
          {/* Header Banner */}
          <div className="flex items-center gap-3 mb-6">
            <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-base font-semibold text-gray-200">Sign in with Google</span>
          </div>

          <div className="mb-6 space-y-1">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Choose an account
            </h2>
            <p className="text-sm font-medium text-gray-300">
              to continue to <span className="text-[#8ab4f8] hover:underline cursor-pointer">vyaparmitra.in</span>
            </p>
          </div>

          <div className="w-full h-[1px] bg-gray-800 mb-4" />

          {/* Account Chooser Items */}
          <div className="divide-y divide-gray-800/80 border-t border-b border-gray-800/80">
            {sampleAccounts.map((account) => {
              const isSelected = selectedEmail === account.email;
              return (
                <button
                  key={account.email}
                  onClick={() => handleAccountClick(account)}
                  disabled={isLoading}
                  className="flex w-full items-center justify-between py-3.5 px-2 hover:bg-gray-800/60 rounded-lg transition text-left group"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-700"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-white">
                        {account.name}
                      </p>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">
                        {account.email}
                      </p>
                    </div>
                  </div>

                  {isLoading && isSelected ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#8ab4f8] border-t-transparent" />
                  ) : isSelected ? (
                    <Check size={18} className="text-[#8ab4f8]" />
                  ) : null}
                </button>
              );
            })}

            {/* Use another account button */}
            <button
              onClick={() => handleAccountClick({ name: "Google Entrepreneur", email: "new.entrepreneur@gmail.com" })}
              disabled={isLoading}
              className="flex w-full items-center gap-3.5 py-3.5 px-2 hover:bg-gray-800/60 rounded-lg transition text-left group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Use another account</p>
              </div>
            </button>
          </div>

          <div className="mt-8 text-xs text-gray-400 leading-relaxed">
            To continue, Google will share your name, email address, language preference, and profile picture with VyaparMitra. Before using this app, review VyaparMitra's <a href="#" className="text-[#8ab4f8] hover:underline">privacy policy</a> and <a href="#" className="text-[#8ab4f8] hover:underline">terms of service</a>.
          </div>
        </div>
      </div>
    </div>
  );
};
