import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menu = [
    {
      section: true,
      item: "Bank"
    },
    {
      section: false,
      item: "Transactions",
      href: "#",
      svg: "assets/svgs/transaction.svg"
    },
    {
      section: false,
      item: "Transaction Types",
      href: "#",
      svg: "assets/svgs/transaction-type.svg"
    },
    {
      section: false,
      item: "Accounts",
      href: "#",
      svg: "assets/svgs/account.svg"
    },
    {
      section: false,
      item: "Customers",
      href: "#",
      svg: "assets/svgs/customer.svg"
    },
    {
      section: true,
      item: "Auth"
    },
    {
      section: false,
      item: "Users",
      href: "#",
      svg: "assets/svgs/user.svg"
    }
  ];
  

}