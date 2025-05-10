import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/common/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/common/Form";
import { Textarea } from "@/components/ui/common/Textarea";
import EmojiPicker from "@/components/ui/elements/EmojiPicker";

import {
  type FindChannelByUsernameQuery,
  useSendChatMessageMutation,
} from "@/graphql/generated/output";

import {
  type TypeSendMessageSchema,
  sendMessageSchema,
} from "@/schemas/chat/send-message.schema";

interface SendMessageFormProps {
  channel: FindChannelByUsernameQuery["findChannelByUsername"];
  isDisabled: boolean;
}

const SendMessageForm = ({ channel, isDisabled }: SendMessageFormProps) => {
  const t = useTranslations("stream.chat.sendMessage");

  const form = useForm<TypeSendMessageSchema>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      text: "",
    },
  });

  const [sendMessage, { loading: isLoadingSendMessage }] =
    useSendChatMessageMutation({
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  const onSubmit = (data: TypeSendMessageSchema) => {
    sendMessage({
      variables: {
        data: {
          streamId: channel.stream.id,
          text: data.text,
        },
      },
    });
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-3 flex items-center gap-x-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-60">
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder={t("placeholder")}
                    rows={1}
                    disabled={isDisabled}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    className="min-h-[40px] resize-none pr-8"
                    {...field}
                  />
                  <div className="absolute right-2 top-2 cursor-pointer">
                    <EmojiPicker
                      isDisabled={isDisabled}
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button size="lgIcon" type="submit" disabled={isDisabled || !isValid}>
          <SendHorizonal className="size-4" />
        </Button>
      </form>
    </Form>
  );
};

export default SendMessageForm;
