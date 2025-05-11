"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import { Card } from "@/components/ui/common/Card";
import { Form, FormField } from "@/components/ui/common/Form";
import ChannelAvatar from "@/components/ui/elements/ChannelAvatar";
import ConfirmModal from "@/components/ui/elements/ConfirmModal";

import {
  type FindChannelByUsernameQuery,
  useChangeThumbnailStreamMutation,
  useRemoveThumbnailStreamMutation,
} from "@/graphql/generated/output";

import { useCurrent } from "@/hooks/useCurrent";

import {
  type TypeUploadFileSchema,
  uploadFileSchema,
} from "@/schemas/upload-file.schema";

import { getMediaSource } from "@/utils/get-media-source";

interface ChangeThumbnailFormProps {
  stream: FindChannelByUsernameQuery["findChannelByUsername"]["streams"];
}

export function ChangeThumbnailForm({ stream }: ChangeThumbnailFormProps) {
  const t = useTranslations("stream.settings.thumbnail");
  const { user } = useCurrent();
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(
    stream.thumbnailUrl ? getMediaSource(stream.thumbnailUrl) : null
  );

  const form = useForm<TypeUploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    values: {
      file: stream?.thumbnailUrl!,
    },
  });

  const [update, { loading: isLoadingUpdate }] =
    useChangeThumbnailStreamMutation({
      onCompleted() {
        toast.success(t("successUpdateMessage"));
      },
      onError() {
        toast.error(t("errorUpdateMessage"));
      },
    });

  const [remove, { loading: isLoadingRemove }] =
    useRemoveThumbnailStreamMutation({
      onCompleted() {
        toast.success(t("successRemoveMessage"));
        setPreview(null);
      },
      onError() {
        toast.error(t("errorRemoveMessage"));
      },
    });

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      form.setValue("file", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      update({ variables: { thumbnail: file } });
    }
  }

  useEffect(() => {
    setPreview(
      stream.thumbnailUrl ? getMediaSource(stream.thumbnailUrl) : null
    );
  }, [stream.thumbnailUrl]);

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <>
            <div className="flex items-center space-x-6">
              {preview ? (
                <Image
                  src={preview}
                  alt={stream.title}
                  width={190}
                  height={80}
                  className="aspect-video rounded-lg"
                />
              ) : (
                <Card className="flex h-28 w-full flex-col items-center justify-center rounded-lg">
                  <ChannelAvatar
                    channel={{
                      username: user?.username!,
                      avatar: user?.avatar,
                    }}
                    size="lg"
                  />
                </Card>
              )}
              <div className="flex w-full items-center gap-x-3">
                <input
                  className="hidden"
                  type="file"
                  ref={inputRef}
                  onChange={handleImageChange}
                />
                <Button
                  variant="secondary"
                  onClick={() => inputRef.current?.click()}
                  disabled={isLoadingUpdate || isLoadingRemove}
                >
                  {t("updateButton")}
                </Button>
                {preview && (
                  <ConfirmModal
                    heading={t("confirmModal.heading")}
                    message={t("confirmModal.message")}
                    onConfirm={() => {
                      remove();
                      setPreview(null);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="lgIcon"
                      disabled={isLoadingUpdate || isLoadingRemove}
                    >
                      <Trash className="size-4" />
                    </Button>
                  </ConfirmModal>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{t("info")}</p>
          </>
        )}
      />
    </Form>
  );
}
