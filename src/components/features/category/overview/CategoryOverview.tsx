"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

import Heading from "@/components/ui/elements/Heading";

import { FindCategoryBySlugQuery } from "@/graphql/generated/output";

import { getMediaSource } from "@/utils/get-media-source";

import StreamsList from "../../stream/list/StreamList";

interface CategoryOverviewProps {
  category: FindCategoryBySlugQuery["findCategoryBySlug"];
}
const CategoryOverview = ({ category }: CategoryOverviewProps) => {
  const t = useTranslations("categories.overview");

  return (
    <div className="space-y-8">
      <div className="gap-x-6 lg:flex lg:items-center lg:space-y-6">
        <Image
          src={getMediaSource(category.thumbnailUrl)}
          alt={category.title}
          width={192}
          height={256}
          className="rounded-lg object-cover"
        />
        <Heading
          title={category.title}
          description={category.description ?? ""}
          size="xl"
        />
      </div>
      <StreamsList streams={category.streams} heading={t("heading")} />
    </div>
  );
};

export default CategoryOverview;
