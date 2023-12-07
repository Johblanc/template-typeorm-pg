# Cors


## Environnement de l'API

Dans le ```.env``` :

```conf
SITE_URL = 'http://localhost:3000'
```

### SITE_URL

Adresse du site


## Configuration de l'api

Dans ```main.ts```

```ts
app.enableCors({
  origin: [process.env.SITE_URL!],              // Adresses autorisées à interroger l'API
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],  // Methodes de requete autorisées
  credentials: true,                            // Transmition du header de la requete
});
```