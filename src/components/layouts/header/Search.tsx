"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/common/Button";
import { Input } from "@/components/ui/common/input";

const Search = () => {
  const t = useTranslations("layout.header.search");

  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/streams?searchTerm=${searchTerm}`);
    } else {
      router.push("/streams");
    }
  };

  return (
    <div className="ml-auto hidden lg:block">
      <form className="relative flex items-center" onSubmit={onSubmit}>
        <Input
          placeholder={t("placeholder")}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-full pl-4 pr-10 lg:w-[400px]"
        />
        <Button className="absolute right-0.5 h-10" type="submit">
          <SearchIcon className="absolute" />
        </Button>
      </form>
    </div>
  );
};

export default Search;
