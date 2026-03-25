import { CommonModule } from '@angular/common';
import { Component ,OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
slides = [
    {
      title: 'We Provide Best Technology Solutions',
      text: 'We are passionate about bringing enterprise-level productivity and security.',
      img:  'https://www.dreamjob.ma/wp-content/uploads/2024/12/Coficab-1.png'
    },
    {
      title: 'Advanced Cyber Security Monitoring',
      text: 'Protecting your digital assets with 24/7 SOC digitalization and response.',
      img: 'https://tse1.mm.bing.net/th/id/OIP.2fzPq2sBz7k_sjfxd6FxUAHaEz?w=1200&h=779&rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
      title: 'Cloud Infrastructure Management',
      text: 'Scale your business with our enterprise-level cloud and IT support.',
      img: 'https://media.licdn.com/dms/image/v2/C4E22AQEDg4Mu9uVEnQ/feedshare-shrink_800/feedshare-shrink_800/0/1663096812591?e=2147483647&v=beta&t=d6cfH5-vhc4NvWKnN1pr0_j3DxkWkzh-b4FF1m1WpXM'
    }
  ];

 currentIndex = 0;
  intervalId: any; // Beich n-khabbiw fih el timer

  ngOnInit() {
    // Kallem el fonction bech d-dawar el slides kol 5 thwani (5000ms)
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); 
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
    // Ki l-user i-cliqui b-yeddou, n-rasetiw el timer bech may-jiich "double-jump"
    clearInterval(this.intervalId);
    this.startAutoPlay();
  }

  ngOnDestroy() {
    // Mhemma barcha: fassa5 el timer ki yokhroj mel page bech el site ma i-th9alch
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
