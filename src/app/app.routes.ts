import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { First } from './pages/first/first';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { DashboardUser } from './pages/dashboard-user/dashboard-user';
import { Profile } from './pages/profile/profile';
import { AddGame } from './pages/add-game/add-game';
import { EditGame } from './pages/edit-game/edit-game';
import { GameDetail } from './pages/game-detail/game-detail';
import { CartComponent } from './pages/cart/cart';
import { TopUpComponent } from './pages/topup/topup';
import { History } from './pages/history/history';
import { AdminHistoryComponent } from './pages/admin-history/admin-history';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: First },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  // { path: 'dashboarduser', component: DashboardUser },
  // { path: 'dashboardadmin', component: DashboardAdmin },
  { path: 'profile', component: Profile },
  { path: 'add-game', component: AddGame },  // แยกเป็นหน้าเต็ม
  { path: 'dashboardadmin/edit-game/:id', component: EditGame },
    // หน้า DashboardUser ต้อง login
  { path: 'dashboarduser', component: DashboardUser, canActivate: [AuthGuard] },

  // หน้า DashboardAdmin ต้อง login
  { path: 'dashboardadmin', component: DashboardAdmin, canActivate: [AuthGuard] },

  { path: 'game-detail/:id', component: GameDetail}, // lazy load
  { path: 'cart', component: CartComponent},
  { path: 'topup', component: TopUpComponent},
  { path: 'history',component: History},
  { path: 'history-admin', component: AdminHistoryComponent}, // เพิ่มเส้นทางสำหรับประวัติธุรกรรมผู้ดูแลระบบ
];
