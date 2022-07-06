//зависимость
import { Injectable } from "@angular/core";
//отправка запросов HTTP
import { HttpClient } from "@angular/common/http";
//структура ответа OnWater.io
import { Result } from "./result.type";

//класс сервиса
@Injectable()
export class OnWaterService {
    //инициализация клиента HTTP
    constructor(private http: HttpClient) {}

    //определение принадлежности координат воде
    isOnWater(lat: number, lon: number) {
        return this.http.get<Result>(
            `https://api.onwater.io/api/v1/results/${lat},${lon}`
        );
    }
}
