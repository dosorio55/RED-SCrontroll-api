import Candidate from '../types/candidate.type';
import { Protocol } from '../types/protocol.enum';

export interface ProtocolStrategy {
  readonly key: Protocol;
  apply(candidates: Candidate[]): Candidate[];
}
