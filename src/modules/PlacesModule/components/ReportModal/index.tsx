import React, {
	ChangeEvent,
	Dispatch,
	useCallback,
	useMemo,
	useState,
} from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ENTITY_REVIEW, reportReasons } from "@/shared/constants/place";
import zIndex from "@mui/material/styles/zIndex";

interface ReportModalProps {
	open: boolean;
	entityId: string;
	entityType: number;
	setShowReportDialog: Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportModal({
	open,
	entityId,
	entityType,
	setShowReportDialog,
}: ReportModalProps) {
	const [selectedReportReason, setSelectedReportReason] = useState<
		string | undefined
	>(undefined);
	const [reportDetails, setReportDetails] = useState("");

	const handleCloseDialog = useCallback(() => setShowReportDialog(false), []);

	const handleSendReport = useCallback(() => {
		console.log("ID: ", entityId);
		console.log("entityType: ", entityType);
		console.log("selectedReportReason: ", selectedReportReason);
		if (entityId && entityType && selectedReportReason !== undefined) {
			const reasonValue = parseInt(selectedReportReason);
			// handleReport(
			// 	reportingEntityId,
			// 	entityType,
			// 	reasonValue,
			// 	reportDetails,
			// );
		}
		handleCloseDialog();
	}, [
		entityId,
		entityType,
		selectedReportReason,
		reportDetails,
		handleCloseDialog,
	]);

	const changeReportDetails = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) =>
			setReportDetails(e.target.value),
		[],
	);

	const handleOpenChange = useCallback((open: boolean) => {
		setShowReportDialog(open);
	}, []);

	const selectedReasonLabel = useMemo(
		() =>
			selectedReportReason
				? reportReasons.find(
						(r) => r.value.toString() === selectedReportReason,
				  )?.label
				: "Select a reason",
		[selectedReportReason],
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="w-500">
				<DialogHeader>
					<DialogTitle>
						Report
						{entityType === ENTITY_REVIEW ? " Review" : " Reply"}
					</DialogTitle>
					<DialogDescription>
						Please select a reason for your report and provide more
						details if necessary.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4 ">
						<Label htmlFor="reportReason" className="text-right">
							Reason
						</Label>
						<Select
							onValueChange={setSelectedReportReason}
							value={selectedReportReason}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Select a reason">
									{selectedReasonLabel}
								</SelectValue>
							</SelectTrigger>
							<SelectContent>
								{reportReasons.map((reason) => (
									<SelectItem
										key={reason.value}
										value={reason.value.toString()}
									>
										{reason.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="reportDetails" className="text-right">
							Details
						</Label>
						<Textarea
							id="reportDetails"
							placeholder="Provide more details about the issue..."
							className="col-span-3"
							value={reportDetails}
							onChange={changeReportDetails}
							rows={4}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={handleCloseDialog}>
						Cancel
					</Button>
					<Button
						onClick={handleSendReport}
						disabled={selectedReportReason === undefined}
					>
						Send Report
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
