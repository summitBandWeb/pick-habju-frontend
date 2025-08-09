export enum SearchPhase {
  BeforeSearch = 'BeforeSearch',
  Loading = 'Loading',
  NoResult = 'NoResult',
  Default = 'Default',
}

export type SearchState = {
  phase: SearchPhase;
  setPhase: (phase: SearchPhase) => void;
};
