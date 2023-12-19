import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsPromoteWord } from "src/validators/IsPromoteWord";


export class PromoteToAdminDto {

  @ApiProperty()
  @Validate(IsPromoteWord)
  promote_word : string
}