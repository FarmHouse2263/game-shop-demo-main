import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, doc, docData, Timestamp } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.html',
  styleUrls: ['./game-detail.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class GameDetail implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);
  route = inject(ActivatedRoute);

  gameId: string | null = null;
  game: any = null;

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      const gameRef = doc(this.firestore, 'games', this.gameId);
      docData(gameRef, { idField: 'id' })
        .pipe(
          map((g: any) => ({
            ...g,
            imageUrl: g.imageFilename ? `http://202.28.34.203:30000/upload/${g.imageFilename}` : null,
            createdAt: g.createdAt instanceof Timestamp ? g.createdAt.toDate() : new Date(g.createdAt)
          }))
        )
        .subscribe(data => this.game = data);
    }
  }

  goBack() {
    this.router.navigate(['/dashboarduser']);
  }

  addToCart() {
    if (!this.game) return;

    let cart = [];
    const cartData = localStorage.getItem('cart');
    if (cartData) cart = JSON.parse(cartData);

    const exists = cart.some((item: any) => item.id === this.game.id);
    if (!exists) {
      cart.push(this.game);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`เพิ่ม "${this.game.title}" ลงตะกร้าเรียบร้อย`);
    } else {
      alert(`"${this.game.title}" อยู่ในตะกร้าแล้ว`);
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
