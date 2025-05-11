import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ChatSettings from "@/components/features/chat/settings/ChatSettings";

import { NO_INDEX_PAGE } from "@/libs/constants/seo.constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard.chat.header");

  return {
    title: t("heading"),
    description: t("description"),
    ...NO_INDEX_PAGE,
  };
}
const ChatPage = () => {
  return <ChatSettings />;
};

export default ChatPage;
