"use client";

import { Message, continueConversation } from "@/app/api/conversation/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserGardens } from "@/types/garden";
import { PlantCardData } from "@/types/plant";
import { Tip } from "@/types/Tip";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import PlantResultsDisplay from "./RelatedPlantsDisplay";
import RelatedTipsDisplay from "./RelatedTipsDisplay";
import LoadingEntertainment from "./LoadingEntertainment";

// Export the ParsedIntent type so it can be imported in other files
export type ParsedIntent = {
	intent: string;
	entities: Record<string, unknown>;
};

// Add a type for our chat state
export type ChatState = "idle" | "processing" | "reasoning";

type ResponseDisplayProps = {
	question: string;
	parsedIntents: ParsedIntent[];
	plantResults: PlantCardData[];
	relatedTips: Tip[];
	useRscStreaming?: boolean;
	userGarden?: UserGardens | null;
	gardenRecommendations?: PlantCardData[];
	processingState?: ChatState;
};

export default function ResponseDisplay({
	question,
	parsedIntents,
	plantResults,
	relatedTips,
	userGarden = null,
	gardenRecommendations = [],
	processingState,
}: ResponseDisplayProps) {
	const { user } = useUser();
	const [error, setError] = useState<string | null>(null);
	const [streamStarted, setStreamStarted] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isResponseComplete, setIsResponseComplete] = useState(false);
	const responseRef = useRef<HTMLDivElement>(null);

	const generateResponse = useCallback(async () => {
		if (streamStarted || messages.length > 0 || processingState !== "reasoning")
			return;

		setStreamStarted(true);
		setError(null);
		setIsResponseComplete(false);

		try {
			const userMessage: Message = { role: "user", content: question };
			setMessages([userMessage]);

			// Create assistant message placeholder with empty content
			const assistantMessage: Message = { role: "assistant", content: "" };
			setMessages((prev) => [...prev, assistantMessage]);

			const response = await continueConversation([userMessage], {
				question,
				parsedIntents,
				plantResults,
				relatedTips,
				userGarden,
				gardenRecommendations,
			});

			// Process the text stream
			let fullText = "";
			try {
				for await (const chunk of response.textStream) {
					fullText += chunk;
					setMessages((prev) => [prev[0], { ...prev[1], content: fullText }]);
				}
			} catch (err) {
				console.error("Error in text stream:", err);
			}

			setIsResponseComplete(true);
		} catch (err) {
			console.error("Error in conversation:", err);
			setError(
				"An error occurred while generating a response. Please try again."
			);
		}
	}, [
		question,
		parsedIntents,
		plantResults,
		relatedTips,
		userGarden,
		gardenRecommendations,
		streamStarted,
		messages.length,
		processingState,
	]);

	// Effect to handle response generation when state changes to 'reasoning'
	useEffect(() => {
		if (processingState === "reasoning" && !streamStarted) {
			generateResponse();
		}
	}, [processingState, streamStarted, generateResponse]);

	// Use gardenRecommendations directly if provided by parent
	// This prevents the need to make additional API calls
	useEffect(() => {
		if (
			gardenRecommendations &&
			gardenRecommendations.length > 0 &&
			userGarden
		) {
			// We already have garden recommendations from props, so no need to fetch them
		}
	}, [gardenRecommendations, userGarden]);

	return (
		<div className="w-full">
			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-4 text-red-500 bg-red-50 rounded-md"
				>
					{error}
				</motion.div>
			)}

			{/* Display user message immediately when processing starts */}
			{processingState && (
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<AnimatePresence mode="wait">
						{/* User message - always show when in processing or reasoning state */}
						<motion.div
							key="user-message"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="p-3 rounded-lg shadow-sm bg-cream-50 dark:bg-cream-700/50"
						>
							<div className="flex items-start gap-3">
								<Avatar className="h-8 w-8 border border-brand-200 bg-cream-50 dark:border-cream-600">
									{user?.imageUrl ? (
										<AvatarImage
											src={user.imageUrl}
											alt={user.fullName || "User"}
										/>
									) : (
										<AvatarFallback className="bg-brand-100 text-brand-800 dark:bg-cream-800 dark:text-cream-200">
											<User className="h-4 w-4" />
										</AvatarFallback>
									)}
								</Avatar>
								<div className="space-y-1 flex-1">
									<p className="font-medium text-sm text-cream-700 dark:text-cream-200">
										{user?.fullName || "You"}
									</p>
									<div className="prose prose-sm dark:prose-invert">
										<p>{question}</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Show loading entertainment component during processing or reasoning states */}
						{(processingState === "processing" ||
							processingState === "reasoning") &&
							!messages[1]?.content && (
								<LoadingEntertainment processingState={processingState} />
							)}

						{/* Assistant message - show "Thinking..." during processing state */}
						<motion.div
							key="assistant-message"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.2 }}
							className="p-3 rounded-lg shadow-sm bg-brand-50 dark:bg-brand-900/30 assistant-message"
						>
							<div className="flex items-start gap-3">
								<Avatar className="h-8 w-8">
									<AvatarImage src="/logo.png" alt="GreenThumb Logo" />
									<AvatarFallback className="bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
										<Leaf className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
								<div className="space-y-1 flex-1">
									<p className="font-medium text-sm text-brand-800 dark:text-brand-200">
										GreenThumb
									</p>

									{/* Display different content based on state */}
									{processingState === "processing" &&
										!messages[1]?.content && (
											<div className="flex items-center space-x-2 text-brand-700 dark:text-brand-300">
												<span className="text-sm text-muted-foreground">
													Please wait while I analyze your question...
												</span>
											</div>
										)}

									{processingState === "reasoning" && !messages[1]?.content && (
										<div className="flex items-center space-x-2 text-brand-700 dark:text-brand-300">
											<span className="text-sm text-muted-foreground">
												Finalizing your personalized response...
											</span>
										</div>
									)}

									{messages[1]?.content && (
										<div
											className="prose prose-sm dark:prose-invert"
											ref={responseRef}
										>
											<Markdown>{messages[1].content}</Markdown>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			)}

			{/* Plant results section - only shown when response is complete */}
			{isResponseComplete && plantResults.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-6"
				>
					<PlantResultsDisplay plantResults={plantResults} />
				</motion.div>
			)}

			{/* Tips section - only shown when response is complete */}
			{isResponseComplete && relatedTips.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="mt-6"
				>
					<RelatedTipsDisplay relatedTips={relatedTips} />
				</motion.div>
			)}
		</div>
	);
}
