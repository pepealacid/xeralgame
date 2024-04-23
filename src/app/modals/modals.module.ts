import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { OpeningModalComponent } from "./opening-modal/opening-modal.modal";

@NgModule({
    declarations: [
        OpeningModalComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
    ],
})
export class ModalsModule {}