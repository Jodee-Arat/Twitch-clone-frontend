"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const t = useTranslations("layout.header.logo");
  return (
    <Link
      href="/"
      className="flex items-center gap-x-4 transition-opacity hover:opacity-75"
    >
      <Image src="/images/favicon.ico" alt="Arat" width={35} height={35} />
      <div className="hidden leading-tight lg:block">
        <h2 className="text-accent-foreground text-lg font-semibold tracking-wider">
          Arat
        </h2>
        <p className="text-muted-foreground text-sm">{t("platform")}</p>
      </div>
    </Link>
  );
};

export default Logo;
