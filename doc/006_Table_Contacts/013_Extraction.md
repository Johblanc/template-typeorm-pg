# Extraction

## ContactsExtractor

new ```src\extractor\extractor.contacts.service.ts```

```ts
import { Injectable } from '@nestjs/common';
import { Contact } from 'src/contacts/entities/contact.entity';

@Injectable()
export class ContactsExtractor {

  async extract() {
    const contacts = await Contact.find({
      select: {
        status_a: true,
        status_b: true,
        user_a: {
          id: true,
        },
        user_b: { id: true },
      },
      relations: {
        user_a: true,
        user_b: true,
      },
    });

    return contacts.map((item) => {
      return {
        status_a: item.status_a,
        status_b: item.status_b,
        user_a: { id: item.user_a.id },
        user_b: { id: item.user_b.id },
      };
    });
  }

  async clear() {
    return await Contact.remove(await Contact.find());
  }

  async reset(contacts: Contact[]) {
    return await Promise.all(
      contacts.map(async (item) => {
        const newContact = Contact.create(item);
        return await newContact.save();
      }),
    );
  }
}
```

## ExtractorModule

update ```src\extractor\extractor.module.ts```

```ts
/* ... */
import { ContactsExtractor } from "./extractor.contacts.service";

@Module({
  /* ... */
  providers: [
    /* ... */
    ContactsExtractor,
  ],
  /* ... */
})
export class ExtractorModule {}
```

## ExtractorController

update ```src\extractor\extractor.controller.ts```

```ts
/* ... */
import { ContactsExtractor } from './extractor.contacts.service';

/* ... */
export class ExtractorController {
  constructor(
    /* ... */
    private readonly contactsExtractor: ContactsExtractor,
  ) {}
  
  /* ... */
  async extract(@Res() res: Response) {
    /* ... */
    fs.writeFileSync(
      `${process.env.DATA_PATH}/data/archive.json`,
      JSON.stringify({
        images : await this.imagesExtractor.extract(),
        contacts : await this.contactsExtractor.extract(),
        users: await this.usersExtractor.extract(),
      }),
    );
    /* ... */
  }

  /* ... */
  async reset(@UploadedFiles() savedFiles: Express.Multer.File[] = []) {
    /* ... */
    await this.contactsExtractor.clear();
    await this.usersExtractor.clear();
    await this.imagesExtractor.clear();
    await this.rolesExtractor.clear();

    /* ... */
    if (savedFiles.length > 0) {
      /* ... */
      if (fs.existsSync(`${process.env.DATA_PATH}/data/archive.json`)) {
        let tables = require(`${process.env.DATA_PATH}/data/archive.json`);

        await this.rolesExtractor.reset();
        if (tables.images) await this.imagesExtractor.reset(tables.images);
        if (tables.users) await this.usersExtractor.reset(tables.users);
        if (tables.contacts) await this.contactsExtractor.reset(tables.contacts);
      }
    }
    /* ... */
  }
}
```