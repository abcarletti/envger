<h1 align="center" style="border-bottom: none;">🔐 Envger</h1>
<!-- <h3 align="center">Fully automated version management and package publishing</h3> -->
<p align="center">
  <a href="https://github.com/abcarletti/envger/actions/workflows/production-release.yml">
    <img alt="Build states" src="https://github.com/abcarletti/envger/actions/workflows/production-release.yml/badge.svg">
  </a>
  <a href="[https://www.npmjs.com/package/semantic-release](https://github.com/semantic-release/semantic-release)">
    <img alt="semantic-release: Next.js" src="https://img.shields.io/badge/semantic--release-Next.js-58c4dc?logo=semantic-release">
  </a>
</p>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migrations

To create a migration, run:

```bash
npx prisma migrate dev --name [migration_name]
```

To apply a migration, run:

```bash
npx prisma db push
```

To generate a client, run:

```bash
npx prisma generate
```

To execute seed scripts, run:

```bash
npx prisma db seed
```

## Generate image

To generate image, run:

```bash
docker build -t carletti/secret-notes:[VERSION] .
```

To publish image, run:

```bash
docker push carletti/secret-notes:[VERSION]
```
