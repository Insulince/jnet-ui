export interface Network {
  id?: string;
  updateKey?: string;
  neuronMap: Array<number>;
  inputLabels: Array<string>;
  outputLabels: Array<string>;
  activationFunction: string;
  blueprint: string;
}
