import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IncidentListComponent } from './pages/incident-list/incident-list.component';
import { AuditLogComponent } from './pages/admin/audit-log/audit-log.component';
import { AiChatComponent } from './pages/ai-chat/ai-chat/ai-chat.component';
import { CatComponent } from './pages/messanger/cat/cat.component';
import { UserComponent } from './pages/user-profile/user/user.component';

export const routes: Routes = [
   {path:'',component:HomeComponent},
   {path:'login',component:LoginComponent},
   {path:'app',
    children:[
        {path:'dashboard',component:DashboardComponent},
        {path:'incidents',component:IncidentListComponent},
        {path:'admin/logs',component:AuditLogComponent},
        {path:'ai-chat',component:AiChatComponent},
        {path:'messanger',component:CatComponent},
        {path:'Profile',component:UserComponent},
    ]
   },
   {path:'**',redirectTo:''}


];
