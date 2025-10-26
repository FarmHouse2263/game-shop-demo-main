import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userId = sessionStorage.getItem('userId'); // เช็คว่า login แล้วหรือยัง
    if (userId) {
      return true; // เข้าถึงหน้าได้
    } else {
      alert('กรุณาเข้าสู่ระบบก่อน!');
      this.router.navigate(['/login']); // ถ้าไม่ได้ login จะไปหน้า login
      return false;
    }
  }
}
