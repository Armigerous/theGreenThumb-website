type DebugInfo = {
  operation: string;
  query?: string;
  params?: Record<string, unknown>;
  duration?: number;
  result?: unknown;
  error?: Error;
};

export const debugDB = (info: DebugInfo) => {
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔍 Database Operation:", info.operation);
    if (info.query) console.log("📝 Query:", info.query);
    if (info.params)
      console.log("🎯 Parameters:", JSON.stringify(info.params, null, 2));
    if (info.duration) console.log("⏱️ Duration:", `${info.duration}ms`);
    if (info.result)
      console.log("📊 Result:", JSON.stringify(info.result, null, 2));
    if (info.error) console.error("❌ Error:", info.error);
    console.log("-------------------\n");
  }
};
