import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Separator } from "@/components/ui/common/Separator";

import {
  useFindSocialLinksQuery,
  useReorderSocialLinksMutation,
} from "@/graphql/generated/output";

import SocialLinkItem from "./SocialLinkItem";

const SocialLinksList = () => {
  const t = useTranslations("dashboard.settings.profile.socialLinks");

  const { data, refetch } = useFindSocialLinksQuery();
  const items = data?.findSocialLinks ?? [];

  const [socialLinks, setSocialLinks] = useState(items);

  useEffect(() => {
    setSocialLinks(items);
  }, [items]);

  const [reorder, { loading: isLoadingReorder }] =
    useReorderSocialLinksMutation({
      onCompleted() {
        refetch();
        toast.success(t("successReorderMessage"));
      },
      onError() {
        toast.error(t("errorReorderMessage"));
      },
    });

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const itemsCopy = Array.from(socialLinks);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    const bulkUpdateData = itemsCopy.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    setSocialLinks(itemsCopy);

    reorder({
      variables: {
        list: bulkUpdateData,
      },
    });
  }

  return socialLinks ? (
    <>
      <Separator />
      <div className="mt-5 px-5">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="socialLinks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {socialLinks.map((socialLink, index) => (
                  <Draggable
                    key={socialLink.id}
                    draggableId={socialLink.id}
                    isDragDisabled={isLoadingReorder}
                    index={index}
                  >
                    {(provided) => (
                      <SocialLinkItem
                        key={index}
                        socialLink={socialLink}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  ) : null;
};

export default SocialLinksList;
