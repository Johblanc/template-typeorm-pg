import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, Validate } from 'class-validator';
import { IsRoles } from 'src/validators/IsRoles';

export class PromoteDto {
  @ApiProperty()
  @IsUUID()
  user_id: string;

  @ApiProperty()
  @IsArray()
  @Validate(IsRoles,{each : true})
  sub_roles: string[];
}
