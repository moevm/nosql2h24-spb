
export default class Walk {
    id: string;
    startTime: string;
    endTime: string;
    length: number;

    constructor(id: string, startTime: string, endTime: string, length: number) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.length = length;
    }

}
