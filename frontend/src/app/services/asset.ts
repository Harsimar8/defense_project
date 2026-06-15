import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(private http: HttpClient) {}

 
  addAsset(data: any) {
  return this.http.post('http://localhost:3000/assets', data);
}

   getAssets() {
  return this.http.get<any[]>(
    `http://localhost:3000/assets?t=${Date.now()}`
  );
}

updateAsset(id: any, data: any) {
    return this.http.put(`http://localhost:3000/assets/${id}`, data);
  }

  // ✅ NEW: Delete an asset from the database using its ID
  deleteAsset(id: any) {
    return this.http.delete(`http://localhost:3000/assets/${id}`);
  }


}
