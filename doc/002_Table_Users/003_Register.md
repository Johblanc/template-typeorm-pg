# Enregistrement d'un nouvel Utilisateur

Requête de création d'un nouvel utilisateur.

## Réflexion

```
              Requête_______________
              |                     |
              | Demande de création |
              |_____________________|
                         :
    DTO__________________V_______________________                Reponse_______
    |                                            |  Incorrecte   |             |
    | Vérification du Typage des données du body |---------------> Bad Request |
    |____________________________________________|               |_____________|
                  :
                  : Valide             Services________________________________
Controllers_______V__________          |                                       |
|                            |         | Récupération d'un élément en fonction |
| Vérification de toutes les <---------> de chaque colonne à valeur unique     |
| colonnes à valeur unique   |         |_______________________________________|
|      :               :     |               
|      :               :     |               Reponse____
|      : Unique        :     |  Doublon      |          |
|      :               '---------------------> Conflict |
|      :                     |               |__________|
|      :                     |               
|      V                     |         Services________________
| Préparation de la réponse  <--------->                       |
|____________________________|         | Création d'un élément |
            :                          |_______________________|
Reponse_____V_______
|                   |
| Le nouvel élément |
|___________________|
```

En résumé, une DTO utilisateur, une methode service pour chaque colonne unique, une methode service de création d'utilisateur et pour finir une methode controle pour renvoyer les données.

## Installation

### Bcrypt

Pour encoder les mots de passe

```Shell
npm install bcrypt
```

bcrypt avec typeScript

```Shell
npm install --save @types/bcrypt
```

## DTO

Il faut s'assurer que les données entrantes sont correctement typées. Pour cela, on peut utiliser les validateurs de Class-validator, mais il ne couvre pas toujours toutes les solutions. Il est également possible de créer nos propres validators.

### Validator IsPseudo

Ce Validator doit vérifier, pour la propriété ```pseudo``` de la DTO, si il s'agit bien d'un texte d'au moins 5 charactères. Pour cela, créer un fichier ```src/validators/IsPseudo.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPseudo', async: false })
export class IsPseudo implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) : boolean {
    return typeof value === "string" && value.length > 4;
  }

  defaultMessage(args: ValidationArguments) : string {
    return (
      `${args.property} doit être du texte d'au moins 5 charactères`
    );
  }
}
```

Le décorateur ```@ValidatorConstraint()``` permet de configurer les paramètres du Validator.

La class validateur doit ```implements ValidatorConstraintInterface```. Cela permet de s'assurer du typage des methodes.

Les methodes ```validate(value: any, args: ValidationArguments) : boolean {}``` et ```defaultMessage(args: ValidationArguments) : string {}``` sont toujours typés de cette façon. 

```value``` contient la valeur de la propriété controlée

```args``` contient divers informations sur la provenance de la demande de validation. Le nom de la propriété par exemple est ```args.property```.

La methode ```validate()``` decrit la validation et renvoi un ```boolean```, ```true``` si la valeur est valide.

La methode ```defaultMessage()``` decrit le message renvoyé par l'API en cas de donnée invalide.


### Validator IsPass

Ce Validator doit vérifier, pour la propriété ```password``` de la DTO, si il s'agit bien d'un texte d'au moins 8 charactères avec un caractère special ```@$!%*?&```, un nombre, une minuscule et une Majuscule. Pour cela, créer un fichier ```src/validators/IsPass.ts```:

```ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsPass', async: false })
export class IsPass implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return typeof value === "string" && Boolean(
      value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    );
  }

  defaultMessage(args: ValidationArguments) {
    return (
      `${args.property} doit contenir au moins 8 caractères dont une minuscule,` +
      ` une majuscule, un chiffre et un symbole parmi : @ $ ! % * ? &.`
    )
  }
}
```

Utilisation d'un RegExp pour vla vérification


### DTO RegisterDto

La DTO est la description de la structure du body de la requête entrante.

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Validate } from "class-validator";
import { IsPass } from "../../../validators/IsPass";
import { IsPseudo } from "validators/IsPseudo";

export class RegisterDto {

  @ApiProperty()
  @Validate(IsPseudo)
  pseudo : string ;

  @ApiProperty()
  @Validate(IsPass)
  password : string ;
  
}
```
Utilisation du décorateur ```@Validate()``` pour associer les validator avec les propriétés


## Service pour colonne unique

Ce service doit permetre de trouvé un élément en fonction d'une colonne à valeur unique.

Pour cette route, dans ```src/users/users.service.ts``` ajouter la methode ```findOneByPseudo()``` : 

```ts
/* ... */
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async findOneByPseudo(pseudo: string): Promise<User | null> {
    return await User.findOneBy({ pseudo });
  }
}

```


## Service de création

Ce service doit permetre de créer un nouvel élément.

Dans ```src/users/users.service.ts``` ajouter la methode ```register()``` : 

```ts
/* ... */
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  async register(dto: Pick<User, "pseudo" | "password">): Promise<User> {
    return await User.create({ ...dto, actif_at: new Date().toISOString() }).save();
  }
  /* ... */
}

```

## Control de création

Dans ```src/users/users.controller.ts``` ajouter la methode ```register()``` : 

```ts
import * as bcrypt from 'bcrypt';
import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  /* ... */
  
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const pseudoExist = await this.usersService.findOneByPseudo(dto.pseudo);

    if (pseudoExist) {
      throw new ConflictException('Ce Pseudo est déjà enregistré');
    }

    const salt = await bcrypt.genSalt(10)

    dto.password = await bcrypt.hash(dto.password, salt);

    const newUser = await this.usersService.register(dto);
    return {
      message: `${dto.pseudo} bien enregistré`,
      data: newUser,
    };
  }
}

```
 Les Methode de Controler sont décorés par un décorateur de Methode de Requete, ici ```@Post()```. Le texte dans les parenthèses indique le routage.

 Utilisation de ```bcrypt``` pour le hashage du mot de passe.

 La réponse prend la forme d'un objet avec un message et les donnéees.

 
