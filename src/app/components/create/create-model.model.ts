import {Model} from "../../models/model.model";

export interface CreateModel extends Model {
  neuronMap: Array<number>;
  inputLabelMode: string;
  inputLabelFunction: string;
  inputLabels: Array<string>;
  outputLabelMode: string;
  outputLabelFunction: string;
  outputLabels: Array<string>;
  activationFunction: string;
}
