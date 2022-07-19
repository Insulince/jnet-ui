export interface TrainingDatum {
  id?: string;
  networkId?: string;
  data: Array<number>;
  truth: Array<number>;
}
