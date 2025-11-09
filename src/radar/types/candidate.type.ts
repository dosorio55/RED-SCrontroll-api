export default interface Candidate {
  coordinates: [number, number];
  distance: number;
  allies?: number;
  enemies?: {
    type: string;
    number: number;
  };
}
