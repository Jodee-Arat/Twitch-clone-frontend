import { MEDIA_URL } from "@/libs/constants/url.constant";

export function getMediaSource(path: string | undefined | null) {
  return MEDIA_URL + path;
}
