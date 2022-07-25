import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {
  ActivateNetworkRequest,
  ActivateNetworkResponse,
  AddTrainingDataRequest,
  AddTrainingDataResponse,
  CreateNetworkRequest,
  CreateNetworkResponse,
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
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private readonly url: string = environment.api.url();

  public constructor(private http: HttpClient) {
  }

  // NETWORK

  // POST /networks
  public createNetwork(request: CreateNetworkRequest): Observable<HttpResponse<CreateNetworkResponse>> {
    return this.http.post<CreateNetworkResponse>(`${this.url}/networks`, request, {observe: "response"});
  }

  // GET /networks
  public searchNetworks(request: SearchNetworkRequest, hideBluePrints: boolean = false): Observable<HttpResponse<SearchNetworksResponse>> {
    const headers: any = {};
    if (hideBluePrints) {
      headers["X-JNet-Hide-Blueprints"] = "true";
    }
    return this.http.get<SearchNetworksResponse>(`${this.url}/networks`, {observe: "response", headers: headers});
  }

  // GET /networks/{networkId}
  public getNetwork(_: GetNetworkRequest, networkId: string): Observable<HttpResponse<GetNetworkResponse>> {
    return this.http.get<GetNetworkResponse>(`${this.url}/networks/${networkId}`, {observe: "response"});
  }

  // PUT /networks/{networkId}
  public updateNetwork(request: UpdateNetworkRequest, networkId: string): Observable<HttpResponse<UpdateNetworkResponse>> {
    return this.http.put<UpdateNetworkResponse>(`${this.url}/networks/${networkId}`, request, {observe: "response"});
  }

  // PATCH /networks/{networkId}
  public patchNetwork(request: PatchNetworkRequest, networkId: string): Observable<HttpResponse<PatchNetworkResponse>> {
    return this.http.patch<PatchNetworkResponse>(`${this.url}/networks/${networkId}`, request, {observe: "response"});
  }

  // DELETE /networks/{networkId}
  public deleteNetwork(_: DeleteNetworkRequest, networkId: string): Observable<HttpResponse<DeleteNetworkResponse>> {
    return this.http.delete<DeleteNetworkResponse>(`${this.url}/networks/${networkId}`, {observe: "response"});
  }

  // GET /networks/{networkId}/activate
  public activateNetwork(_: ActivateNetworkRequest, networkId: string): Observable<HttpResponse<ActivateNetworkResponse>> {
    return this.http.get<ActivateNetworkResponse>(`${this.url}/networks/${networkId}/activate`, {observe: "response"});
  }

  // GET /networks/{networkId}/deactivate
  public deactivateNetwork(_: DeactivateNetworkRequest, networkId: string): Observable<HttpResponse<DeactivateNetworkResponse>> {
    return this.http.get<DeactivateNetworkResponse>(`${this.url}/networks/${networkId}/deactivate`, {observe: "response"});
  }

  // TRAINING DATA

  // POST /networks/{networkId}/training-data
  public addTrainingData(request: AddTrainingDataRequest, networkId: string): Observable<HttpResponse<AddTrainingDataResponse>> {
    return this.http.post<AddTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`, request, {observe: "response"});
  }

  // GET /networks/{networkId}/training-data
  public searchTrainingData(_: SearchTrainingDataRequest, networkId: string): Observable<HttpResponse<SearchTrainingDataResponse>> {
    return this.http.get<SearchTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`, {observe: "response"});
  }

  // DELETE /networks/{networkId}/training-data
  public deleteAllTrainingData(_: DeleteAllTrainingDataRequest, networkId: string): Observable<HttpResponse<DeleteAllTrainingDataResponse>> {
    return this.http.delete<DeleteAllTrainingDataResponse>(`${this.url}/networks/${networkId}/training-data`, {observe: "response"});
  }

  // GET /networks/-/training-data/{trainingDatumId}
  public getTrainingDatum(_: GetTrainingDatumRequest, trainingDatumId: string): Observable<HttpResponse<GetTrainingDatumResponse>> {
    return this.http.get<GetTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, {observe: "response"});
  }

  // PUT /networks/-/training-data/{trainingDatumId}
  public updateTrainingDatum(request: UpdateTrainingDatumRequest, trainingDatumId: string): Observable<HttpResponse<UpdateTrainingDatumResponse>> {
    return this.http.put<UpdateTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, request, {observe: "response"});
  }

  // PATCH /networks/-/training-data/{trainingDatumId}
  public patchTrainingDatum(request: PatchTrainingDatumRequest, trainingDatumId: string): Observable<HttpResponse<PatchTrainingDatumResponse>> {
    return this.http.patch<PatchTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, request, {observe: "response"});
  }

  // DELETE /networks/-/training-data/{trainingDatumId}
  public deleteTrainingDatum(request: DeleteTrainingDatumRequest, trainingDatumId: string): Observable<HttpResponse<DeleteTrainingDatumResponse>> {
    return this.http.delete<DeleteTrainingDatumResponse>(`${this.url}/networks/-/training-data/${trainingDatumId}`, {observe: "response"});
  }

  // TRAIN

  // POST /networks/{networkId}/train
  public trainNetwork(request: TrainNetworkRequest, networkId: string): Observable<HttpResponse<TrainNetworkResponse>> {
    return this.http.post<TrainNetworkResponse>(`${this.url}/networks/${networkId}/train`, request, {observe: "response"});
  }

  // GET /networks/{networkId}/train/status
  public trainingStatus(request: TrainingStatusRequest, networkId: string): Observable<HttpResponse<TrainingStatusResponse>> {
    return this.http.get<TrainingStatusResponse>(`${this.url}/networks/${networkId}/status`, {observe: "response"});
  }

  // GET /networks/{networkId}/train/halt
  public haltTraining(request: HaltTrainingRequest, networkId: string): Observable<HttpResponse<HaltTrainingResponse>> {
    return this.http.get<HaltTrainingResponse>(`${this.url}/networks/${networkId}/halt`, {observe: "response"});
  }

  // GET /networks/{networkId}/train/reset
  public resetNetwork(request: ResetNetworkRequest, networkId: string): Observable<HttpResponse<ResetNetworkResponse>> {
    return this.http.get<ResetNetworkResponse>(`${this.url}/networks/${networkId}/reset`, {observe: "response"});
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
  public testNetwork(request: TestNetworkRequest, networkId: string): Observable<HttpResponse<TestNetworkResponse>> {
    return this.http.post<TestNetworkResponse>(`${this.url}/networks/${networkId}/test`, request, {observe: "response"});
  }

  // HEALTH CHECK

  // GET /health
  public healthCheck(_: HealthCheckRequest): Observable<HttpResponse<HealthCheckResponse>> {
    return this.http.get<HealthCheckResponse>(`${this.url}/health`, {observe: "response"});
  }
}
