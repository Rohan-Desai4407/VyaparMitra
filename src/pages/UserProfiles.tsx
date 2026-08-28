import { useTranslation } from "react-i18next";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  const { t } = useTranslation();
  return (
    <>
      <PageMeta
        title={`${t("profile.pageTitle")} | VyaparMitra`}
        description="VyaparMitra user profile."
      />
      <PageBreadcrumb pageTitle={t("profile.pageTitle")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </>
  );
}
