import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/user.entity.js";

export class AssociationInput {

    @ApiProperty({
        description: 'The name of the association',
        example: "Association RAHMA ",
        type: String,   
    })
    public name: string;

    @ApiProperty({
        description: 'The users ids in the association',
        example: "[1, 2, 3]",
        type: [Number],
    })
    public idUsers: number[];  
}