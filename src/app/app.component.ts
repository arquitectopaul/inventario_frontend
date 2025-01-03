import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestión de Inventarios';
 /* ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.toggleLoader(true);
    // Simulación de una llamada de servicio
    setTimeout(() => {
      this.toggleLoader(false);
    }, 2000); // Simulación de 2 segundos de tiempo de carga
  }

  toggleLoader(show: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }  */
}
