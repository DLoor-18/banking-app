import { Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { UserComponent } from './views/user/user.component';
import { CustomerComponent } from './views/customer/customer.component';
import { AccountComponent } from './views/account/account.component';
import { TransactionTypeComponent } from './views/transaction-type/transaction-type.component';
import { TransactionComponent } from './views/transaction/transaction.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "transaction",
                component: TransactionComponent
            },
            {
                path: "transaction-type",
                component: TransactionTypeComponent
            },
            {
                path: "account",
                component: AccountComponent
            },
            {
                path: "customer",
                component: CustomerComponent
            },
            {
                path: "user",
                component: UserComponent
            }
        ]
    },
    {
        path: "header",
        component: HeaderComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "not-found",
        component: NotFoundComponent
    },
    {
        path: "**",
        redirectTo: "not-found"
    }
];
