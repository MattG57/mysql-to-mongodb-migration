export type UsageType = {
      org: string;
      team?: string;
      day: string;
      totalSuggestionsCount: number;
      totalAcceptancesCount: number;
      totalLinesSuggested: number;
      totalLinesAccepted: number;
      totalActiveUsers: number;
      totalChatAcceptances: number;
      totalChatTurns: number;
      totalActiveChatUsers: number;
    }
    
    export type UsageBreakdownType = {
      id?: number;
      usage_day: string;
      language: string;
      editor: string;
      suggestionsCount: number;
      acceptancesCount: number;
      linesSuggested: number;
      linesAccepted: number;
      activeUsers: number;
    }