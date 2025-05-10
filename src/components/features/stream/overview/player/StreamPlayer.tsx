import { TrackReference } from "@livekit/components-react";
import { RemoteParticipant, Track } from "livekit-client";
import { Pause } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

import { Button } from "@/components/ui/common/Button";
import { Card } from "@/components/ui/common/Card";

import { FindChannelByUsernameQuery } from "@/graphql/generated/output";

import { getMediaSource } from "@/utils/get-media-source";

import FullscreenControl from "./FullscreenControl";
import PauseControl from "./PauseControl";
import VolumeControl from "./VolumeControl";

interface StreamPlayerProps {
  participant: RemoteParticipant;
  tracks: TrackReference[];
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
}

const StreamPlayer = ({ participant, tracks, channel }: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [volume, setVolume] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const backgroundStyle: CSSProperties = channel.streams.thumbnailUrl
    ? {
        backgroundImage: `url(${getMediaSource(channel.streams.thumbnailUrl)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  const videoTrack = tracks.find(
    (track) => track.source === Track.Source.Camera
  )?.publication.track;

  const audioTrack = tracks.find(
    (track) => track.source === Track.Source.Microphone
  )?.publication.track;

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      videoTrack.attach(videoRef.current);
    }

    if (audioTrack) {
      audioTrack.attach(videoRef.current);
    }

    return () => {
      if (videoTrack) {
        videoTrack.detach(videoRef.current);
      }
      if (audioTrack) {
        audioTrack.detach(videoRef.current);
      }
    };
  }, [videoTrack, audioTrack]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPaused) {
      if (videoTrack) videoTrack.attach(videoRef.current);
      if (audioTrack) audioTrack.attach(videoRef.current);
      setIsPaused(false);
    } else {
      if (videoTrack) videoTrack.detach(videoRef.current);
      if (audioTrack) audioTrack.detach(videoRef.current);
      setIsPaused(true);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen?.();
    } else if (wrapperRef.current) {
      wrapperRef.current?.requestFullscreen?.();
    }
  };

  function handleFullscreenChange() {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;

    setIsFullscreen(isCurrentlyFullscreen);
  }

  useEventListener(
    "fullscreenchange" as keyof WindowEventMap,
    handleFullscreenChange
  );

  const onVolumeChange = (value: number) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
      videoRef.current.muted = value === 0;
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex h-full">
      {isPaused && (
        <Card
          className="absolute flex h-full w-full flex-col items-center justify-center"
          style={backgroundStyle}
        >
          {channel.streams.thumbnailUrl && (
            <div className="absolute inset-0 z-0 rounded-lg bg-black opacity-60" />
          )}
          <Button
            disabled={!isPaused}
            onClick={togglePlay}
            className="absolute z-10 flex size-20 items-center justify-center opacity-50"
            variant="ghost"
            size="lgIcon"
          ></Button>
          <Pause className="text-muted-foreground size-12" />
        </Card>
      )}
      <video ref={videoRef} autoPlay playsInline />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100">
        <div className="absolute bottom-0 flex h-16 w-full items-center justify-between px-4">
          <div className="flex items-center gap-x-1">
            <PauseControl isPaused={isPaused} onToggle={togglePlay} />
            <VolumeControl
              value={volume}
              onChange={onVolumeChange}
              onToggle={() => onVolumeChange(volume === 0 ? 50 : 0)}
            />
          </div>
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamPlayer;
