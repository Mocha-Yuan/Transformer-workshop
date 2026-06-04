export interface DemoToken {
  text: string;
  embedding: number[];
  position: number;
}

export interface DemoResult {
  sentence: string;
  tokens: DemoToken[];
}
