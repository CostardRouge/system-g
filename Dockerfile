# =========================================================================
# Système G — image Docker multi-étapes
#
#   • cible `dev`   : serveur de développement Astro avec rechargement à chaud
#   • cible `build` : compilation du site statique
#   • cible `prod`  : Nginx servant le site statique compilé (léger, sans Node)
#
# Construire le dev   : docker build --target dev  -t systeme-g:dev  .
# Construire la prod  : docker build --target prod -t systeme-g:prod .
# (Voir docker-compose.yml pour l'usage courant.)
# =========================================================================

# --- Base commune -------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install

# --- Développement (hot reload) ----------------------------------------
FROM base AS dev
COPY . .
EXPOSE 4321
# --host expose le serveur hors du conteneur
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- Compilation --------------------------------------------------------
FROM base AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build

# --- Production (Nginx statique) ---------------------------------------
FROM nginx:1.27-alpine AS prod
# Configuration Nginx adaptée à un site statique
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
