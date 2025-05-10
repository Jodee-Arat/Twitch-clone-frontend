import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PlansTable from "@/components/features/sponsorship/plan/table/PlansTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.plans.header");

  return {
    title: t("heading"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}
const PlansPage = () => {
  return <PlansTable />;
};

export default PlansPage;
