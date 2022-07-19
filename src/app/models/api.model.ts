// NETWORK

import {Network} from "./network.model";
import {TrainingDatum} from "./training-datum.model";

// create network
export interface CreateNetworkRequest {
  neuronMap: Array<number>;
  activationFunction: string;
  inputLabels: Array<string>;
  outputLabels: Array<string>;
}

export type CreateNetworkResponse = "Created";

// search network
export type SearchNetworkRequest = null;

export interface SearchNetworksResponse {
  networks: Array<Network>;
}

// get network
export type GetNetworkRequest = null;

export type GetNetworkResponse = Network;

// update network
export type UpdateNetworkRequest = undefined;

export type UpdateNetworkResponse = undefined;

// patch network
export type PatchNetworkRequest = undefined;

export type PatchNetworkResponse = undefined;

// delete network
export type DeleteNetworkRequest = null;

export type DeleteNetworkResponse = "";

// activate network
export type ActivateNetworkRequest = null;

export type ActivateNetworkResponse = "";

// deactivate network
export type DeactivateNetworkRequest = null

export type DeactivateNetworkResponse = "";

// TRAINING DATUM

// add training data
export interface AddTrainingDataRequest {
  trainingData: Array<TrainingDatum>;
}

export interface AddTrainingDataResponse {
  ids: Array<string>;
}

// search training data
export type SearchTrainingDataRequest = null;

export interface SearchTrainingDataResponse {
  trainingData: Array<TrainingDatum>;
}

// delete all training data
export type DeleteAllTrainingDataRequest = null;

export type DeleteAllTrainingDataResponse = "";

// get training datum
export type GetTrainingDatumRequest = null;

export type GetTrainingDatumResponse = TrainingDatum;

// update training datum
export type UpdateTrainingDatumRequest = undefined;

export type UpdateTrainingDatumResponse = undefined;

// patch training datum
export type PatchTrainingDatumRequest = undefined;

export type PatchTrainingDatumResponse = undefined;

// delete training datum
export type DeleteTrainingDatumRequest = null;

export type DeleteTrainingDatumResponse = "";

// TRAIN

// train network
export interface TrainNetworkRequest {
  learningRate: number;
  miniBatchSize: number;
  averageLossCutoff: number;
  minLossCutoff: number;
  maxIterations: number;
}

export type TrainNetworkResponse = "Accepted";

// training status
export type TrainingStatusRequest = undefined;

export type TrainingStatusResponse = undefined;

// halt training
export type HaltTrainingRequest = undefined;

export type HaltTrainingResponse = undefined;

// reset network
export type ResetNetworkRequest = undefined;

export type ResetNetworkResponse = undefined;

// stream training progress
export type StreamTrainingProgressRequest = null;

export type StreamTrainingProgressResponse = string;

// TEST

// test network
export interface TestNetworkRequest {
  input: Array<number>;
}

export interface TestNetworkResponse {
  output: string;
  confidence: number;
}

// HEALTH CHECK

// health check
export type HealthCheckRequest = null;

export type HealthCheckResponse = "OK";
