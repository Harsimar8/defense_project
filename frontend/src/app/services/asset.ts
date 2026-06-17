import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private apiUrl = 'http://localhost:3000/assets';

  constructor(private http: HttpClient) {}

  getAssets(): Observable<{ assets: any[]; logs: any[] }> {
  return this.http.get<{ assets: any[]; logs: any[] }>(
    `http://localhost:3000/assets?t=${Date.now()}`
  );
}

  addAsset(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateAsset(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteAsset(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}