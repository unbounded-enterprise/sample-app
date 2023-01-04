import axios from 'axios';
import jwt_decode from "jwt-decode";
import { parseError } from 'src/pages/api/validate';

class AuthApi {
  getEnvironmentRedirect(environment){
    return new Promise((resolve, reject) => {
      const errorHandling = (err)=>{ 
        console.log(err);
        const e = parseError(err);
        console.log('[Auth Api]: ', e.message);
        reject(e);
      };
      try { 
        axios.post('/api/getEnvironmentRedirect', { environment }).then((res)=>{
          if (!res.data) {
            reject(new Error('Failed to fetch path'));
            return;
        } 
  
          resolve(res.data);
        }).catch(errorHandling)

        
       
      } catch (err) {
        errorHandling(err);
      } 

    });
  }

  getToken(handcashToken){
    return new Promise((resolve, reject) => {
      const errorHandling = (err)=>{ 
        console.log(err);
        const e = parseError(err);
        console.log('[Auth Api]: ', e.message);
        reject(e);
      };
      try { 
        axios.get('/api/handcash/getToken', { headers: { handcashToken } }).then((tokenRes)=>{
          if (!tokenRes.data) {
            reject(new Error('Invalid authorization token'));
            return;
        } 
  
          resolve(tokenRes.data);
        }).catch(errorHandling)

        
       
      } catch (err) {
        errorHandling(err);
      } 

    });
  }

  getFriends(handcashToken) {
    return new Promise((resolve, reject) => {
      const errorHandling = (err)=>{ 
        console.log(err);
        const e = parseError(err);
        console.log('[Auth Api]: ', e.message);
        reject(e);
      };
      try { 
        axios.get('/api/handcash/getFriends', { headers: { handcashToken } }).then((res)=>{
          if (!res.data) {
            reject(new Error('Invalid authorization token'));
            return;
          } 
          resolve(res.data);
        }).catch(errorHandling)
      } catch (err) {
        errorHandling(err);
      } 
    });
  }

  getProfile(handcashToken) {
    return new Promise((resolve, reject) => {
      const errorHandling = (err)=>{ 
        console.log(err);
        const e = parseError(err);
        console.log('[Auth Api]: ', e.message);
        reject(e);
      };

      try { 
        axios.get('/api/handcash/getProfile', { headers: { handcashToken } }).then((res)=>{
          if (!res.data) {
            reject(new Error('Invalid authorization token'));
            return;
          } 
          resolve(res.data);
        }).catch(errorHandling)
      } catch (err) {
        errorHandling(err);
      } 
    });
  }

  me(accessToken) {
    return new Promise((resolve, reject) => {
      // resolve({ id: 'test', avatar: '', email: 'test@test.com', name: 'tester', teams: ['no teams'] });
      try {
        // Decode access token
        const user = jwt_decode(accessToken);
        if (user?.exp < new Date().getTime()) {
          reject(new Error('token expired, log back in'));
        }
        
        resolve({
          handle: user.handle,
          displayName: user.displayName || user.handle,
          avatarUrl: user.avatarUrl,
        });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      } 
    }); 
  }
}

export const authApi = new AuthApi();
