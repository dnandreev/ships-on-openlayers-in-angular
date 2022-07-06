//структура ответа OnWater.io
export interface Result {
    query: string;
    request_id: string;
    lat: number;
    lon: number;
    water: boolean;
}
