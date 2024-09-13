# Stage 1: Construcción de la aplicación
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar pnpm de manera global
RUN npm install -g pnpm

# Copiar archivos de pnpm y del proyecto para instalar las dependencias
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instalar solo las dependencias de producción
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente al contenedor
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación para producción
RUN pnpm run build

# Stage 2: Imagen para correr la aplicación
FROM node:18-alpine AS runner

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias de producción desde el builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar la carpeta `.next` (build) y `public` desde el builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copiar el archivo `next.config.js` si existe
COPY --from=builder /app/next.config.mjs ./

# Copiar el cliente de Prisma generado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.18.0_prisma@5.18.0/node_modules/.prisma ./node_modules/.prisma

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para correr la aplicación
CMD ["pnpm", "run", "start"]
