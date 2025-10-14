#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}   Voleibol Valencia Store${NC}"
echo -e "${BLUE}   Setup Script${NC}"
echo -e "${BLUE}==================================${NC}"
echo ""

# Verificar Node.js
echo -e "${YELLOW}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js no está instalado${NC}"
    echo "Por favor, instala Node.js desde https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version) encontrado${NC}"
echo ""

# Verificar npm
echo -e "${YELLOW}Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version) encontrado${NC}"
echo ""

# Instalar dependencias del frontend
echo -e "${YELLOW}Instalando dependencias del frontend...${NC}"
cd front
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}✗ Error al instalar dependencias${NC}"
    exit 1
fi
echo ""

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}Por favor, edita el archivo .env con tu configuración de PocketBase${NC}"
else
    echo -e "${BLUE}ℹ Archivo .env ya existe${NC}"
fi
echo ""

# Verificar PocketBase
cd ..
echo -e "${YELLOW}Verificando PocketBase...${NC}"
if [ ! -f pocketbase ]; then
    echo -e "${YELLOW}PocketBase no encontrado. ¿Deseas descargarlo? (s/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        echo -e "${YELLOW}Descargando PocketBase...${NC}"
        
        # Detectar sistema operativo
        OS="$(uname -s)"
        case "${OS}" in
            Linux*)
                POCKETBASE_URL="https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip"
                ;;
            Darwin*)
                # Detectar arquitectura en macOS
                ARCH="$(uname -m)"
                if [[ "$ARCH" == "arm64" ]]; then
                    POCKETBASE_URL="https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_arm64.zip"
                else
                    POCKETBASE_URL="https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_darwin_amd64.zip"
                fi
                ;;
            *)
                echo -e "${RED}Sistema operativo no soportado: ${OS}${NC}"
                echo "Por favor, descarga PocketBase manualmente desde https://pocketbase.io/docs/"
                exit 1
                ;;
        esac
        
        wget $POCKETBASE_URL -O pocketbase.zip
        unzip pocketbase.zip
        rm pocketbase.zip
        chmod +x pocketbase
        echo -e "${GREEN}✓ PocketBase descargado${NC}"
    fi
else
    echo -e "${GREEN}✓ PocketBase encontrado${NC}"
fi
echo ""

# Resumen
echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}   Setup completado!${NC}"
echo -e "${BLUE}==================================${NC}"
echo ""
echo -e "${GREEN}Próximos pasos:${NC}"
echo ""
echo -e "1. ${YELLOW}Iniciar PocketBase:${NC}"
echo -e "   ${BLUE}./pocketbase serve${NC}"
echo -e "   Abre http://127.0.0.1:8090/_/ y configura las colecciones"
echo ""
echo -e "2. ${YELLOW}Iniciar el frontend:${NC}"
echo -e "   ${BLUE}cd front${NC}"
echo -e "   ${BLUE}npm run dev${NC}"
echo -e "   Abre http://localhost:3000"
echo ""
echo -e "3. ${YELLOW}Configurar PocketBase:${NC}"
echo -e "   Lee el archivo POCKETBASE_SETUP.md para instrucciones detalladas"
echo ""
echo -e "${GREEN}¡Buena suerte con tu tienda! 🏐${NC}"
