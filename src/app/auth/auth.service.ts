import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private isAuthenicated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private tokenTimer: any;
    constructor(private httpClient: HttpClient, private router: Router ) {

    }

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getAuthStatus() {
        return this.isAuthenicated;
    }

    createUser(email: string, password: string ) {
        const authData: AuthData = { email: email, password: password };
        this.httpClient.post('http://localhost:3000/api/user/signup', authData).subscribe((res) => {
            console.log('resres', res);
        })
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        const now = new Date();
        if(!authInformation) {
            return;
        }

        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        console.log('authInformation', authInformation);
        if(expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenicated = true;
            this.setAuthTimer(expiresIn / 1000)
            this.authStatusListener.next(true);
        }
    }

    login(email: string, password: string   ) {
        const authData: AuthData = { email: email, password: password };
        this.httpClient.post<{ message: string, token: string, expiresIn: number }>('http://localhost:3000/api/user/login', authData).subscribe((res) => {
            const token = res.token;
            this.token = token;
            if(token) {
                const expiresInDuration = res.expiresIn;
                console.log('expiresInDuration', expiresInDuration);
                this.setAuthTimer(expiresInDuration)
                this.isAuthenicated = true;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate);
                console.log('expirationDate', expirationDate);
                this.router.navigate(['/'])
            }
        })
    }

    logout() {
        this.token = null;
        this.isAuthenicated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        this.clearAuthData();
        clearTimeout(this.tokenTimer);
    }

    private saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }

    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        
        if(!token || !expirationDate) {
            return;
        }
        return { token, expirationDate: new Date(expirationDate)}
    };

    private setAuthTimer(duration: number) {
        console.log('Setting timer', duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000 );
    }
}