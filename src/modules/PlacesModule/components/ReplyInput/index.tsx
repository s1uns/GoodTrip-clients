import { memo, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReplyInputProps {
	replyText: string;
	setReplyText: (text: string) => void;
	handleSendReply: () => void;
	setReplyingTo: Dispatch<SetStateAction<string | null>>;
}

const ReplyInput = memo<ReplyInputProps>(
	({ replyText, setReplyText, handleSendReply, setReplyingTo }) => {
		const { t } = useTranslation();

		return (
			<div className="flex gap-2 mb-3">
				<Textarea
					placeholder={t("replyInput.placeholder")}
					value={replyText}
					onChange={(e) => setReplyText(e.target.value)}
				/>
				<Button
					size="sm"
					onClick={handleSendReply}
					disabled={!replyText}
				>
					<Send className="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setReplyingTo(null)}
				>
					<X className="w-4 h-4" />
				</Button>
			</div>
		);
	},
);

export default ReplyInput;
