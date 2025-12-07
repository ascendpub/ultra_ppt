
export enum SlideType {
  TITLE = 'TITLE',
  CONTENT_TEXT = 'CONTENT_TEXT',
  CONTENT_TEXT_IMAGE = 'CONTENT_TEXT_IMAGE',
  CONTENT_VIDEO = 'CONTENT_VIDEO',
  TABLE = 'TABLE',
  BIG_NUMBER = 'BIG_NUMBER',
  QUOTE = 'QUOTE',
  CHART = 'CHART',
  TIMELINE = 'TIMELINE',
  PROCESS = 'PROCESS',
  CLOSING = 'CLOSING'
}

export interface ChartData {
  type: 'BAR' | 'PIE' | 'LINE';
  title: string;
  labels: string[];
  values: number[];
  dataLabel: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string; // Used in Title/Closing slides
  bullets?: string[]; // Used in Content slides
  imageKeyword?: string; // Used for fetching relevant placeholder images
  videoUrl?: string; // Used for Video slides
  tableHeaders?: string[]; // Used in Table slides
  tableRows?: string[][]; // Used in Table slides
  bigNumber?: string; // Used in Big Number slide
  bigNumberLabel?: string;
  quoteText?: string;
  quoteAuthor?: string;
  chart?: ChartData;
  timeline?: TimelineEvent[];
  processSteps?: ProcessStep[]; // Used in Process slide
  speakerNotes?: string;
  sourceUrl?: string; // Used for hyperlinks
}

export interface PresentationData {
  topic: string;
  themeColor: string;
  slides: SlideData[];
}
