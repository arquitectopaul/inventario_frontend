import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsableComponent } from '../responsable/components/responsable/responsable.component';
import { TipoBienComponent } from '../tipobien/components/tipobien/tipobien.component';
import { GrupoComponent } from '../grupo/components/grupo/grupo.component';
import { ArticuloComponent } from '../articulo/components/articulo/articulo.component';
import { ProveedorComponent } from '../proveedor/components/proveedor/proveedor.component';
import { HomeComponent } from './components/home/home.component';
import { MaestroComponent } from '../maestro/components/maestro/maestro.component';
import { AtributoComponent } from '../atributo/atributo/atributo.component';
import { AtributosComponent } from '../atributos/atributos/atributos.component';
import { ActivoComponent } from '../activo/activo/activo.component';
import { EspecificacionesComponent } from '../especificaciones/especificaciones/especificaciones.component';
import { ParametroComponent } from '../parametro/parametro/parametro.component';
import { MarcaComponent } from '../marca/components/marca/marca.component';

const childRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'activo', component: ActivoComponent },
    { path: 'especificaciones', component: EspecificacionesComponent },
    { path: 'responsable', component: ResponsableComponent },
    { path: 'tipobien', component: TipoBienComponent },
    { path: 'grupo', component: GrupoComponent },
    { path: 'articulo', component: ArticuloComponent },
    { path: 'activo', component: ActivoComponent },
    { path: 'proveedor', component: ProveedorComponent },
    { path: 'maestro', component: MaestroComponent },
    { path: 'marca', component: MarcaComponent },
    { path: 'atributo', component: AtributoComponent },
    { path: 'atributos', component: AtributosComponent },
    { path: 'parametro', component: ParametroComponent }
]

@NgModule({
    imports: [RouterModule.forChild(childRoutes)],
    exports: [RouterModule]
})
export class RouterChildModule { }