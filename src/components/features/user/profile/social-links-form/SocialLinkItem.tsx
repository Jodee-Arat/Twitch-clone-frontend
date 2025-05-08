import { type DraggableProvided } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/common/Form";
import { Input } from "@/components/ui/common/input";

import {
  type FindSocialLinksQuery,
  useFindSocialLinksQuery,
  useRemoveSocialLinkMutation,
  useUpdateSocialLinkMutation,
} from "@/graphql/generated/output";

import {
  SocialLinksSchema,
  TypeSocialLinksSchema,
} from "@/schemas/user/social-links.schema";

interface SocialLinkItemProps {
  socialLink: FindSocialLinksQuery["findSocialLinks"][0];
  provided: DraggableProvided;
}

const SocialLinkItem = ({ provided, socialLink }: SocialLinkItemProps) => {
  const t = useTranslations("dashboard.settings.profile.socialLinks.editForm");

  const [editingId, setEditingId] = useState<string | null>(null);

  const { refetch } = useFindSocialLinksQuery();

  const form = useForm<TypeSocialLinksSchema>({
    resolver: zodResolver(SocialLinksSchema),
    values: {
      title: socialLink.title ?? "",
      url: socialLink.url ?? "",
    },
  });

  const { isDirty, isValid } = form.formState;

  function toggleEditing(id: string | null) {
    setEditingId(id);
  }

  const [update, { loading: isLoadingUpdateSocialLink }] =
    useUpdateSocialLinkMutation({
      onCompleted() {
        toggleEditing(null);
        refetch();
        toast.success(t("successUpdateMessage"));
      },
      onError() {
        toast.error(t("errorUpdateMessage"));
      },
    });

  const [remove, { loading: isLoadingRemoveSocialLink }] =
    useRemoveSocialLinkMutation({
      onCompleted() {
        refetch();
        toast.success(t("successRemoveMessage"));
      },
      onError() {
        toast.error(t("errorRemoveMessage"));
      },
    });

  const onSubmit = (data: TypeSocialLinksSchema) => {
    update({
      variables: {
        id: socialLink.id,
        data,
      },
    });
  };

  return (
    <div
      className="border-border bg-background mb-4 flex items-center gap-x-2 rounded-md border text-sm"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div
        className="border-r-border text-foreground rounded-l-md border-r px-2 py-9 transition"
        {...provided.dragHandleProps}
      >
        <GripVertical className="size-5" />
      </div>
      <div className="space-y-1 px-2">
        {editingId === socialLink.id ? (
          <Form {...form}>
            <form
              className="flex gap-x-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="w-96 space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="youtube"
                          disabled={
                            isLoadingUpdateSocialLink ||
                            isLoadingRemoveSocialLink
                          }
                          className="h-8"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/JodeeAratxd"
                          disabled={
                            isLoadingUpdateSocialLink ||
                            isLoadingRemoveSocialLink
                          }
                          className="h-8"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-x-4">
                <Button onClick={() => toggleEditing(null)} variant="secondary">
                  {t("cancelButton")}
                </Button>
                <Button
                  disabled={
                    isLoadingUpdateSocialLink ||
                    isLoadingRemoveSocialLink ||
                    !isDirty ||
                    !isValid
                  }
                >
                  {t("submitButton")}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <h2 className="text-foreground text-[17px] font-semibold tracking-wide">
              {socialLink.title}
            </h2>
            <p className="text-muted-foreground">{socialLink.url}</p>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-x-2 pr-4">
        {editingId !== socialLink.id && (
          <>
            <Button
              onClick={() => toggleEditing(socialLink.id)}
              variant="ghost"
              size="lgIcon"
            >
              <Pencil className="text-muted-foreground size-4" />
            </Button>
            <Button
              onClick={() => remove({ variables: { id: socialLink.id } })}
              variant="ghost"
              size="lgIcon"
            >
              <Trash2 className="text-muted-foreground size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialLinkItem;
