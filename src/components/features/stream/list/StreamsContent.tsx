"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import Heading from "@/components/ui/elements/Heading";

import {
  type FindAllStreamsQuery,
  useFindAllStreamsQuery,
} from "@/graphql/generated/output";

import { StreamCardSkeleton } from "./StreamCard";
import StreamsList from "./StreamList";

interface StreamsContentProps {
  streams: FindAllStreamsQuery["findAllStreams"];
}
const StreamsContent = ({ streams }: StreamsContentProps) => {
  const t = useTranslations("streams");

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("searchTerm");

  const [streamList, setStreamList] = useState<
    FindAllStreamsQuery["findAllStreams"]
  >(streams ?? []);
  const [hasMore, setHasMore] = useState(true);

  const { data, fetchMore } = useFindAllStreamsQuery({
    variables: {
      filters: {
        searchTerm,
        take: 12,
        skip: 0,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.findAllStreams) {
      setStreamList(data.findAllStreams);
      setHasMore(data.findAllStreams.length === 12);
    } else {
      setStreamList([]);
      setHasMore(false);
    }
  }, [data]);
  useEffect(() => {
    setStreamList([]);
    setHasMore(true);
  }, [searchTerm]);

  const fetchMoreStreams = async () => {
    if (!hasMore) return;

    setTimeout(async () => {
      const { data: newData } = await fetchMore({
        variables: {
          filters: {
            searchTerm,
            take: 12,
            skip: streamList.length,
          },
        },
      });
      if (newData?.findAllStreams) {
        setStreamList((prev) => [...prev, ...newData.findAllStreams]);
        setHasMore(newData.findAllStreams.length === 12);
      } else {
        setHasMore(false);
      }
    }, 300);
  };

  return (
    <>
      <Heading
        title={
          searchTerm ? `${t("searchHeading")} "${searchTerm}"` : t("heading")
        }
      />
      <InfiniteScroll
        dataLength={streamList.length}
        next={fetchMoreStreams}
        hasMore={hasMore}
        loader={
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <StreamCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <StreamsList streams={streamList} />
      </InfiniteScroll>
    </>
  );
};

export default StreamsContent;
