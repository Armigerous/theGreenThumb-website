export type ParsedIntent = {
  intent: string;
  entities: Record<string, any>;
};

export type ParsedQuestion = {
  intents: ParsedIntent[];
};
