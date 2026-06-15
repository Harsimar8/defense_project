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


}
