# Stage 1: Construcción de la aplicación
FROM node:20-slim AS builder

WORKDIR /app

# Instalar pnpm de manera global
RUN npm install -g pnpm

# Copiar solo los archivos de configuración primero para aprovechar el caché
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar dependencias con caché de pnpm
RUN pnpm install --frozen-lockfile

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN pnpm run build

# Stage 2: Imagen de producción
FROM node:20-slim AS runner

WORKDIR /app

# Instalar pnpm y solo las dependencias de producción
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/prisma ./prisma

# Copiar el cliente de Prisma generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Limpiar caché y archivos temporales
RUN rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache

# Variables de entorno para producción
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Healthcheck para monitoreo
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]
