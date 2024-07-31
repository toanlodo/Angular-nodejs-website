import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
url = "http://localhost:8000/v1";

constructor(private httpClient:HttpClient) { }


login(body:any):any{
  return this.httpClient.post<any>(`${this.url}/account/login`,body);
}
register(body:any):any{
  return this.httpClient.post<any>(`${this.url}/account/register`,body);
}

checkLogin(){
  let jsonData = localStorage.getItem('login')
  if(jsonData){
    return JSON.parse(jsonData).user
  }
  return false
}

checkADM(){
  let jsonData = localStorage.getItem('login')
  if(jsonData){
    if(JSON.parse(jsonData).user.admin == true)
      return JSON.parse(jsonData)
  }
}

loggedIn = false;
isAuthenticated(){
  const promise = new Promise<boolean>((resolve,reject)=>{
    let jsonData = localStorage.getItem('login');
    if(jsonData){
      this.loggedIn = true;
      resolve(this.loggedIn);
    }else{
      resolve(this.loggedIn);
    }
  });
  return promise;
}

isAdmin(){
  const promise = new Promise<boolean>((resolve,reject)=>{
    let jsonData = localStorage.getItem('login');
    if(jsonData){
      if(JSON.parse(jsonData).user.admin == true){
        this.loggedIn = true;
        resolve(this.loggedIn);
      }
    }else{
      resolve(this.loggedIn);
    }
  });
  return promise;
}

getToken(){
  let jsonData = localStorage.getItem('login')
  if(jsonData){
    return JSON.parse(jsonData).accessToken;
  }
  return false;
}

getRefreshToken(){
  let jsonData = localStorage.getItem('login')
  if(jsonData){
    return JSON.parse(jsonData).refreshToken;
  }
  return false;
}

refreshToken(refreshToken:any):any{
  return this.httpClient.post<any>(`${this.url}/refresh`,refreshToken)
}

}
