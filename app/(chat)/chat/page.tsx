"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, X, Leaf } from "lucide-react";
import ResponseDisplay from "@/components/Chat/ResponseDisplay";
import { cn } from "@/lib/utils";
import { PlantCardData } from "@/types/plant";
import { useUser } from "@clerk/nextjs";
import { Tip } from "@/types/Tip";
import ProjectDescription from "@/components/Chat/ProjectDescription";
import { UserGardens } from "@/types/garden";
import { ChatSkeleton } from "@/components/Chat/ChatSkeleton";
import { ParsedIntent, ChatState } from "@/components/Chat/ResponseDisplay";
import GardenInfoDisplay from "@/components/Chat/GardenInfoDisplay";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import useSWR from "swr";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch garden settings");
  }
  const data = await response.json();
  return data.settings;
};

// Logger utility for consistent logging
const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[Chat Info] ${message}`, data ? data : "");
  },
  error: (message: string, error?: unknown) => {
    console.error(`[Chat Error] ${message}`, error ? error : "");
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[Chat Warning] ${message}`, data ? data : "");
  },
  debug: (message: string, data?: unknown) => {
    console.debug(`[Chat Debug] ${message}`, data ? data : "");
  },
};

export default function Chat() {
  const { user, isLoaded } = useUser();
  const [question, setQuestion] = useState("");
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [error, setError] = useState<string | null>(null);

  // These states are still needed to pass data to ResponseDisplay
  const [parsedIntents, setParsedIntents] = useState<ParsedIntent[]>([]);
  const [plantResults, setPlantResults] = useState<PlantCardData[]>([]);
  const [relatedTips, setRelatedTips] = useState<Tip[]>([]);
  const [showMobileGardenInfo, setShowMobileGardenInfo] = useState(false);

  // Use SWR for garden data fetching
  const { data: userGarden, isLoading: isLoadingGarden } = useSWR<UserGardens>(
    isLoaded && user ? "/api/user-gardens" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  const processQuestion = async () => {
    if (!question) return;

    logger.info("Processing new question:", { question });
    setChatState("processing");
    setError(null);
    setParsedIntents([]);
    setPlantResults([]);
    setRelatedTips([]);

    try {
      // Step 1: Parse question
      logger.debug("Parsing question");
      const parseResponse = await fetch("/api/parse-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!parseResponse.ok) {
        const errorText = await parseResponse.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.error ||
            errorData.message ||
            `Failed to parse question (${parseResponse.status})`;
        } catch {
          errorMessage =
            errorText || `Failed to parse question (${parseResponse.status})`;
        }
        throw new Error(errorMessage);
      }

      const parsedQuestion = await parseResponse.json();

      // Extract intents for processing
      const processedIntents = Array.isArray(parsedQuestion)
        ? parsedQuestion.map((item) => ({
            intent: item.object?.intent || item.intent,
            entities: item.object?.entities || item.entities || {},
          }))
        : parsedQuestion.intents || [];

      setParsedIntents(processedIntents);

      const extractedEntities =
        Array.isArray(parsedQuestion) && parsedQuestion.length > 0
          ? parsedQuestion[0].entities ||
            parsedQuestion[0].object?.entities ||
            {}
          : parsedQuestion.intents && parsedQuestion.intents.length > 0
            ? parsedQuestion.intents[0].entities
            : {};

      // Step 2: Make parallel API calls for tips and query
      logger.info("Making parallel API calls");
      const [tipsResponse, queryResponse] = await Promise.all([
        fetch("/api/search-tips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            entities: extractedEntities,
            userGarden: userGarden,
          }),
        }),
        fetch("/api/query-builder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intents: processedIntents,
            userGarden: userGarden,
          }),
        }),
      ]);

      // Process tips
      let tips: Tip[] = [];
      if (tipsResponse.ok) {
        const relatedTipsData = await tipsResponse.json();
        tips = relatedTipsData.tips || [];
        setRelatedTips(tips);
      }

      // Process query results
      if (!queryResponse.ok) {
        const errorData = await queryResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.details ||
            `Failed to execute query (${queryResponse.status})`
        );
      }

      const queryResultData = await queryResponse.json();
      setPlantResults(
        (queryResultData.data as unknown as PlantCardData[])?.map((plant) => ({
          ...plant,
          id: plant.id,
        })) || []
      );

      // Step 3: Move to reasoning state (assistant will analyze and respond)
      setChatState("reasoning");
    } catch (err) {
      logger.error("Chat process failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
      setChatState("idle");
    }
  };

  // Show skeleton until we have the garden name
  if (isLoadingGarden || !userGarden?.name) {
    return <ChatSkeleton />;
  }

  return (
    <div className="container mx-auto p-4 my-12">
      <div className="flex flex-col lg:flex-row justify-center gap-6 max-w-7xl mx-auto">
        {/* Main chat area - given more width proportionally */}
        <div className="w-full lg:w-2/3 max-w-3xl mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div className="w-full mx-auto">
              <ProjectDescription userGarden={userGarden} />
            </motion.div>

            <motion.div
              animate={{
                minHeight: "auto",
                padding: 16,
              }}
              transition={{
                type: "spring",
                bounce: 0.3,
                duration: 0.5,
              }}
              className={cn(
                "rounded-lg w-full shadow-sm bg-cream-100 dark:bg-cream-800"
              )}
            >
              <div className="flex flex-col w-full justify-between gap-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    processQuestion();
                  }}
                  className="flex space-x-2"
                >
                  <Input
                    className="bg-cream-50 text-base w-full text-neutral-700 dark:bg-cream-700 dark:placeholder:text-cream-400 dark:text-cream-300 focus-visible:ring-brand-500"
                    value={question}
                    placeholder="Ask a question (e.g., 'What zones can roses grow in?')"
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && processQuestion()
                    }
                    minLength={3}
                    required
                  />
                  {question && chatState === "idle" && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setQuestion("")}
                      className="px-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear input</span>
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={!question || chatState !== "idle"}
                    className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-cream-700 dark:text-cream-200 dark:hover:bg-cream-600"
                  >
                    {chatState === "reasoning" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : chatState === "processing" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>

                {chatState === "idle" && !error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-cream-600 dark:text-cream-400"
                  >
                    <p>Type your gardening question above and press Enter</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-md flex items-start gap-2"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Something went wrong</p>
                      <p className="text-sm">{error}</p>
                      <Button
                        variant="link"
                        className="text-red-600 dark:text-red-300 p-0 h-auto mt-1 text-sm"
                        onClick={() => setError(null)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </motion.div>
                )}

                {chatState !== "idle" && (
                  <div className="mt-4">
                    <ResponseDisplay
                      question={question}
                      parsedIntents={parsedIntents}
                      plantResults={plantResults}
                      relatedTips={relatedTips}
                      userGarden={userGarden}
                      processingState={chatState}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Garden info side panel - fixed width but proportionally smaller */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block w-full lg:w-1/3 max-w-xs lg:sticky top-20 self-start h-fit"
        >
          <GardenInfoDisplay userGarden={userGarden} className="shadow-sm" />
        </motion.div>
      </div>

      {/* Mobile garden info dialog - only visible on small screens */}
      <Dialog
        open={showMobileGardenInfo}
        onOpenChange={setShowMobileGardenInfo}
      >
        <DialogTrigger asChild>
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Button
              variant="default"
              size="sm"
              className="rounded-full h-12 w-12 bg-brand-500 hover:bg-brand-600 p-0 shadow-lg transition-all hover:scale-105 active:scale-95 border-2 border-white dark:border-brand-700"
            >
              <Leaf className="h-5 w-5 text-white" />
              <span className="sr-only">View Garden Profile</span>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0 h-[50vh] max-h-[700px] overflow-hidden">
          <DialogTitle className="sr-only">Garden Profile</DialogTitle>
          <GardenInfoDisplay
            userGarden={userGarden}
            className="h-full"
            isMobile={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
