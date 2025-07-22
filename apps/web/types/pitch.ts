export type PitchResult = {
  reasoning: string;
  pitch: string;
};

export type PitchFeedback = {
  fitSummary: string;
  adjustments: string[];
  ratings: {
    strength: number;
    clarity: number;
    uniqueness: number;
  };
  tags: string[];
};
