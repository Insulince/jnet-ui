import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {
  ActivateNetworkRequest,
  ActivateNetworkResponse,
  AddTrainingDataRequest,
  AddTrainingDataResponse,
  CreateNetworkRequest,
  DeactivateNetworkRequest,
  DeactivateNetworkResponse,
  DeleteAllTrainingDataRequest,
  DeleteAllTrainingDataResponse,
  DeleteNetworkRequest,
  DeleteNetworkResponse,
  DeleteTrainingDatumRequest,
  DeleteTrainingDatumResponse,
  GetNetworkRequest,
  GetNetworkResponse,
  GetTrainingDatumRequest,
  GetTrainingDatumResponse,
  HaltTrainingRequest,
  HaltTrainingResponse,
  HealthCheckRequest,
  HealthCheckResponse,
  PatchNetworkRequest,
  PatchNetworkResponse,
  PatchTrainingDatumRequest,
  PatchTrainingDatumResponse,
  ResetNetworkRequest,
  ResetNetworkResponse,
  SearchNetworkRequest,
  SearchNetworksResponse,
  SearchTrainingDataRequest,
  SearchTrainingDataResponse,
  StreamTrainingProgressRequest,
  StreamTrainingProgressResponse,
  TestNetworkRequest,
  TestNetworkResponse,
  TrainingStatusRequest,
  TrainingStatusResponse,
  TrainNetworkRequest,
  TrainNetworkResponse,
  UpdateNetworkRequest,
  UpdateNetworkResponse,
  UpdateTrainingDatumRequest,
  UpdateTrainingDatumResponse
} from "../models/api.model";
import {Observable} from "rxjs";
import {webSocket, WebSocketSubjectConfig} from "rxjs/webSocket";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly host: string = `localhost:8080`;
  private readonly url: string = `http://${this.host}`;

  public constructor(private http: HttpClient) {
  }

  // NETWORK

  // POST /networks
  public createNetwork(request: CreateNetworkRequest): Observable<CreateNetworkRequest> {
    return this.http.post<CreateNetworkRequest>(`${this.url}/networks`, request, {responseType: "text" as any});
  }

  // GET /networks
  public searchNetworks(request: SearchNetworkRequest, hideBluePrints: boolean = false): Observable<SearchNetworksResponse> {
    const headers: any = {};
    if (hideBluePrints) {
      headers["X-JNet-Hide-Blueprints"] = "true";
    }
    return this.http.get<SearchNetworksResponse>(`${this.url}/networks`, {headers: headers});
  }

  // GET /networks/{networkId}
  public getNetwork(_: GetNetworkRequest, networkId: string): Observable<GetNetworkResponse> {
    return this.http.get<GetNetworkResponse>(`${this.url}/networks/${networkId}`);
  }

  // PUT /networks/{networkId}
  public updateNetwork(request: UpdateNetworkRequest, networkId: string): Observable<UpdateNetworkResponse> {
    return this.http.put<UpdateNetworkResponse>(`${this.url}/networks/${networkId}`, request);
  }

  // PATCH /networks/{networkId}
  public patchNetwork(request: PatchNetworkRequest, networkId: string): Observable<PatchNetworkResponse> {
    return this.http.patch<PatchNetworkResponse>(`${this.url}/networks/${networkId}`, request);
  }

  // DELETE /networks/{networkId}
  public deleteNetwork(_: DeleteNetworkRequest, networkId: string): Observable<DeleteNetworkResponse> {
    return this.http.delete<DeleteNetworkResponse>(`${this.url}/networks/${networkId}`, {responseType: "text" as any});
  }

  // GET /networks/{networkId}/activate
  public activateNetwork(_: ActivateNetworkRequest, networkId: string): Observable<ActivateNetworkResponse> {
    return this.http.get<ActivateNetworkResponse>(`${this.url}/networks/${networkId}/activate`, {responseType: "text" as any});
  }

  // GET /networks/{networkId}/deactivate
  public deactivateNetwork(_: DeactivateNetworkRequest, networkId: string): Observable<DeactivateNetworkResponse> {
    return this.http.get<DeactivateNetworkResponse>(`${this.url}/networks/${networkId}/deactivate`, {responseType: "text" as any});
  }

  // TRAINING DATA

  // POST /networks/{networkId}/training-data
  public addTrainingData(request: AddTrainingDataRequest, networkId: string): Observable<AddTrainingDataResponse> {
    return this.http.post<AddTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`, request);
  }

  // GET /networks/{networkId}/training-data
  public searchTrainingData(_: SearchTrainingDataRequest, networkId: string): Observable<SearchTrainingDataResponse> {
    return this.http.get<SearchTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`);
  }

  // DELETE /networks/{networkId}/training-data
  public deleteAllTrainingData(_: DeleteAllTrainingDataRequest, networkId: string): Observable<DeleteAllTrainingDataResponse> {
    return this.http.delete<DeleteAllTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`, {responseType: "text" as any});
  }

  // GET /networks/-/training-data/{trainingDatumId}
  public getTrainingDatum(_: GetTrainingDatumRequest, trainingDatumId: string): Observable<GetTrainingDatumResponse> {
    return this.http.get<GetTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`);
  }

  // PUT /networks/-/training-data/{trainingDatumId}
  public updateTrainingDatum(request: UpdateTrainingDatumRequest, trainingDatumId: string): Observable<UpdateTrainingDatumResponse> {
    return this.http.put<UpdateTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, request);
  }

  // PATCH /networks/-/training-data/{trainingDatumId}
  public patchTrainingDatum(request: PatchTrainingDatumRequest, trainingDatumId: string): Observable<PatchTrainingDatumResponse> {
    return this.http.patch<PatchTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, request);
  }

  // DELETE /networks/-/training-data/{trainingDatumId}
  public deleteTrainingDatum(request: DeleteTrainingDatumRequest, trainingDatumId: string): Observable<DeleteTrainingDatumResponse> {
    return this.http.delete<DeleteTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, {responseType: "text" as any});
  }

  // TRAIN

  // POST /networks/{networkId}/train
  public trainNetwork(request: TrainNetworkRequest, networkId: string): Observable<TrainNetworkResponse> {
    return this.http.post<TrainNetworkResponse>(`${this.url}/networks/${networkId}/train`, request);
  }

  // GET /networks/{networkId}/train/status
  public trainingStatus(request: TrainingStatusRequest, networkId: string): Observable<TrainingStatusResponse> {
    return this.http.get<TrainingStatusResponse>(`${this.url}/networks/${networkId}/status`);
  }

  // GET /networks/{networkId}/train/halt
  public haltTraining(request: HaltTrainingRequest, networkId: string): Observable<HaltTrainingResponse> {
    return this.http.get<HaltTrainingResponse>(`${this.url}/networks/${networkId}/halt`);
  }

  // GET /networks/{networkId}/train/reset
  public resetNetwork(request: ResetNetworkRequest, networkId: string): Observable<ResetNetworkResponse> {
    return this.http.get<ResetNetworkResponse>(`${this.url}/networks/${networkId}/reset`);
  }

  // GET /networks/{networkId}/train/socket
  public streamTrainingProgress(_: StreamTrainingProgressRequest, networkId: string): Observable<StreamTrainingProgressResponse> {
    const wsConfig: WebSocketSubjectConfig<StreamTrainingProgressResponse> = {
      url: `ws://${window.location.host}/ws/networks/${networkId}/train/socket`,
      deserializer: (event: MessageEvent): StreamTrainingProgressResponse => event.data
    };
    return webSocket<StreamTrainingProgressResponse>(wsConfig).asObservable();
  }

  // TEST

  // POST /networks/{networkId}/test
  public testNetwork(request: TestNetworkRequest, networkId: string): Observable<TestNetworkResponse> {
    return this.http.post<TestNetworkResponse>(`${this.url}/networks/${networkId}/test`, request);
  }

  // HEALTH CHECK

  // GET /health
  public healthCheck(_: HealthCheckRequest): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(`${this.url}/health`, {responseType: "text" as any});
  }
}
