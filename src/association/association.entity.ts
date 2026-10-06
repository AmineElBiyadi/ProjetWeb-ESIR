export class Association {
    id: number;
    name: string;
    idUsers: number[];  

    constructor(id: number, name: string, idUsers: number[]) {
        this.id = id;
        this.name = name;
        this.idUsers = idUsers;
    }
}