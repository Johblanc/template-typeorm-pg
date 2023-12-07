# Helmet

Pour la securité

## Installation Complémentaire

```Shell
npm install helmet
```

## Configuration de l'api

Dans ```main.ts``` :

```ts
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  }),
);
```

