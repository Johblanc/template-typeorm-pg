import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsSortKeyUsers } from "src/validators/IsSortKeyUsers";
import { IsSortOrders } from "src/validators/IsSortOrders";
import { IsStringIntOptionnal } from "src/validators/IsStringIntOptionnal";
import { IsStringIntPositiveOptionnal } from "src/validators/IsStringIntPositiveOptionnal";
import { IsStringTypeOptional } from "src/validators/IsStringTypeOptional";



export class GetUsersQueryDto {

  @ApiProperty()
  @Validate(IsStringIntPositiveOptionnal)
  itemsByPage?: string;

  @ApiProperty()
  @Validate(IsStringIntPositiveOptionnal)
  page?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  pseudo?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  first_name?: string;

  @ApiProperty()
  @Validate(IsStringTypeOptional)
  last_name?: string;

  @ApiProperty()
  @Validate(IsStringIntOptionnal)
  actif_from? : string;

  @ApiProperty()
  @Validate(IsSortKeyUsers)
  sort_keys? : string;

  @ApiProperty()
  @Validate(IsSortOrders)
  sort_orders? : string;

}