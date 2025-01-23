import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private collapseBtn: HTMLElement | null = null; 
  private sidebar: HTMLElement | null = null; 
  private menuLinks: HTMLElement | null = null; 
  private collapsedClass = 'collapsed';

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
  
  constructor(private renderer: Renderer2, private el: ElementRef, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.collapseBtn = this.el.nativeElement.querySelector('.collapse-btn');  
    this.sidebar = this.el.nativeElement.querySelector('.sidebar');   
    this.menuLinks = this.el.nativeElement.querySelector('.admin-menu a');  

    // for (const link of this.menuLinks) {
    //   link.addEventListener("mouseenter", function () {
    //     if (
    //       this.sidebar.classList.contains(this.collapsedClass) &&
    //       window.matchMedia("(min-width: 768px)").matches
    //     ) {
    //       const tooltip = this.querySelector("span").textContent;
    //       this.setAttribute("title", tooltip);
    //     } else {
    //       this.removeAttribute("title");
    //     }
    //   });
    // }

  }
  

  toggleMenu(): void {
    if(!this.collapseBtn) {
      return;
    }

    if(this.sidebar?.classList.contains(this.collapsedClass)){
        this.renderer.removeClass(this.sidebar, this.collapsedClass);
    }else {
        this.renderer.addClass(this.sidebar, this.collapsedClass);
    }

    const ariaExpanded = this.collapseBtn.getAttribute('aria-expanded') === 'true';
    const ariaLabel = this.collapseBtn.getAttribute('aria-label');

    this.renderer.setAttribute(this.collapseBtn, 'aria-expanded', String(!ariaExpanded));
    this.renderer.setAttribute(this.collapseBtn, 'aria-label', ariaLabel === 'collapse menu' ? 'expand menu' : 'collapse menu');
    this.cdr.detectChanges()
  }
}
