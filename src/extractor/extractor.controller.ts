import { Controller } from '@nestjs/common';
import { UsersExcractor } from './extractor.users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('setup')
@Controller()
export class ExtractorController {
  constructor(private readonly usersExtractor: UsersExcractor) {}
}
