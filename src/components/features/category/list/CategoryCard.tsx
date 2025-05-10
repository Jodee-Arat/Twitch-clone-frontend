"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { type FindRandomCategoriesQuery } from "@/graphql/generated/output";

import { useSidebar } from "@/hooks/useSidebar";

import { getRandomColor } from "@/utils/color";
import { getMediaSource } from "@/utils/get-media-source";
import { cn } from "@/utils/tw-merge";

interface CategoryCardProps {
  category: FindRandomCategoriesQuery["findRandomCategories"][0];
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const [randomColor, setRandomColor] = useState("");
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    setRandomColor(getRandomColor());
  }, []);
  return (
    <Link
      href={`categories/${category.slug}`}
      className="h-full w-full space-y-4"
    >
      <div
        className={cn(
          "group relative cursor-pointer rounded-lg",
          isCollapsed ? "h-70" : "h-60"
        )}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
          style={{ backgroundColor: randomColor }}
        />
        <Image
          src={getMediaSource(category.thumbnailUrl)}
          alt={category.title}
          fill
          className="rounded-lg object-cover transition-transform group-hover:-translate-y-2 group-hover:translate-x-2"
        />
      </div>
      <div className="text-foreground hover:text-primary truncate text-base font-semibold">
        {category.title}
      </div>
    </Link>
  );
};

export default CategoryCard;
