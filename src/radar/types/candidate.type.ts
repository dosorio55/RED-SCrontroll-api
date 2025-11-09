interface Candidate {
  coordinates: [number, number];
  distance: number;
  allies?: number;
  enemies?: {
    type: string;
    number: number;
  };
}

export default Candidate;
