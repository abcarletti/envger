# Stage 1: Construcción de la aplicación
FROM node:22-slim AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar pnpm de manera global
RUN npm install -g pnpm

# Copiar solo los archivos necesarios para instalar dependencias
COPY pnpm-lock.yaml package.json ./

# Instalar las dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente al contenedor, excluyendo archivos innecesarios
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Construir la aplicación para producción
RUN pnpm run build

# Stage 2: Imagen para correr la aplicación
FROM node:22-slim AS runner

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar pnpm globalmente y configurarlo
RUN npm install -g pnpm@latest && \
	pnpm config set store-dir /root/.local/share/pnpm/store

# Copiar solo las dependencias de producción desde el builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar la carpeta `.next` (build) y `public` desde el builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copiar el cliente de Prisma generado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.20.0_prisma@5.20.0/node_modules/.prisma ./node_modules/.prisma

# Copiar solo configuraciones esenciales
COPY --from=builder /app/next.config.mjs ./

# Eliminar posibles archivos sobrantes
RUN rm -rf /app/*.log

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para correr la aplicación
CMD ["pnpm", "start"]
