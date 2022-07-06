//декоратор и хук жизненного цикла
import { Component, AfterViewInit } from "@angular/core";

//карта OpenLayers
import Map from "ol/Map";
//обозреваемая часть
import View from "ol/View";

//слой сетки изображений
import TileLayer from "ol/layer/Tile";
//источник изображений OpenStreetMap
import OSM from "ol/source/OSM";

//слой векторных элементов
import VectorLayer from "ol/layer/Vector";
//источник данных меток
import Vector from "ol/source/Vector";
//метка
import Feature from "ol/Feature";
//вид метки
import Style from "ol/style/Style";
//значок метки
import Icon from "ol/style/Icon";
//расположение метки
import Point from "ol/geom/Point";

//перевод координат между проекциями
import { fromLonLat, toLonLat } from "ol/proj";
//отправка запросов OnWater.io
import { OnWaterService } from "./onwater.service";

//метаданные компонента
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})

//класс компонента
export class AppComponent implements AfterViewInit {
    //карта
    map: Map;
    //метки
    source = new Vector();
    //корабли
    ships = [];

    //отправка запросов OnWater.io
    constructor(private onWaterService: OnWaterService) {}

    //инициализация компонента
    ngAfterViewInit() {
        //создание и размещение карты OpenLayers
        this.map = new Map({
            target: "map",
            view: new View({
                center: fromLonLat([30.32, 59.95]),
                zoom: 11,
                maxZoom: 19
            }),
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: this.source,
                    style: new Style({
                        //создание значка метки
                        image: new Icon({
                            anchor: [0.5, 1],
                            anchorXUnits: "fraction",
                            anchorYUnits: "fraction",
                            opacity: 0.75,
                            //https://www.flaticon.com/premium-icon/boat_5695213
                            src: "assets/ship.png"
                        })
                    })
                })
            ]
        });
        //выбор координат нажатием на карту
        this.map.on("singleclick", (event) => {
            let lonLat = toLonLat(event.coordinate);
            (<HTMLInputElement>document.getElementById("lat")).value = String(
                lonLat[1]
            );
            (<HTMLInputElement>document.getElementById("lon")).value = String(
                lonLat[0]
            );
        });
        //добавление корабля и очистка полей ввода нажатием на кнопку
        document.getElementById("add").onclick = () =>
            this.addShip(
                (<HTMLInputElement>document.getElementById("name")).value,
                +(<HTMLInputElement>document.getElementById("lat")).value,
                +(<HTMLInputElement>document.getElementById("lon")).value,
                () =>
                    ((<HTMLInputElement>(
                        document.getElementById("name")
                    )).value = (<HTMLInputElement>(
                        document.getElementById("lat")
                    )).value = (<HTMLInputElement>(
                        document.getElementById("lon")
                    )).value = "")
            );
    }

    //добавление корабля со введёнными названием и координатами
    addShip(name: string, lat: number, lon: number, callback?: Function) {
        //проверка введённых значений
        if (name.length === 0) alert("Введите название корабля, пожалуйста!");
        else if (lat < -90 || lat > 90)
            alert("Введите широту от -90 до 90, пожалуйста!");
        else if (lon < -180 || lon > 180)
            alert("Введите долготу от -180 до 180, пожалуйста!");
        //замена сервера WFS для проверки принадлежности введённых координат воде
        else
            this.onWaterService.isOnWater(lat, lon).subscribe({
                //сервис вернул данные
                next: (data) => {
                    if (data.water) {
                        //обратный вызов, если задан
                        if (callback) callback();
                        //создание и размещение метки
                        let feature = new Feature({
                            geometry: new Point(fromLonLat([lon, lat]))
                        });
                        this.source.addFeature(feature);
                        //добавление корабля в таблицу
                        this.ships.push({
                            name: name,
                            lat: lat,
                            lon: lon,
                            feature: feature
                        });
                    } else
                        alert(
                            "Введите координаты точки, принадлежащей воде, пожалуйста!"
                        );
                },
                //сервис вернул ошибку
                error: (error) => {
                    alert(
                        "Ошибка проверки координат! Повторите попытку позже, пожалуйста."
                    );
                }
            });
    }

    //убирание метки и корабля
    removeShip(index: number) {
        if (window.confirm(`Удалить корабль "${this.ships[index].name}"?`)) {
            this.source.removeFeature(this.ships[index].feature);
            this.ships.splice(index, 1);
        }
    }
}
