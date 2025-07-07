export type CaptionInsight = {
  caption: string;
  tone: string;
  contentType: string;
  themes: string[];
};

export type CaptionInsightsResponse = {
  summary: string;
  insights: CaptionInsight[];
};
