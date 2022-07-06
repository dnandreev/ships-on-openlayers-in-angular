//декоратор
import { NgModule } from "@angular/core";
//инфраструктура приложений Angular
import { BrowserModule } from "@angular/platform-browser";
//создание сервисов HTTP
import { HttpClientModule } from "@angular/common/http";
//отправка запросов OnWater.io
import { OnWaterService } from "./onwater.service";
//компонент
import { AppComponent } from "./app.component";

//метаданные модуля
@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [OnWaterService],
    bootstrap: [AppComponent]
})

//класс модуля
export class AppModule {}
