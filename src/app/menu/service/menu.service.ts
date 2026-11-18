import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment  } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
    apiURl = environment .apiURl;
  constructor(private http : HttpClient) { }
  getMenus(projectId: number) {
    const params = {
  id: projectId
};

    return this.http.get<any>(`${this.apiURl}/Menu`, { params });
  }
}
