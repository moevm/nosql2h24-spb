export class RoutesFilterDto {
    search: string;

    minDate: string;
    maxDate: string;

    minPoiCount: number;
    maxPoiCount: number;

    minLength: number;
    maxLength: number;

    minDuration: number;
    maxDuration: number;

    author: string;

    points: string[]
}
