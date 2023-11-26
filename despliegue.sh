#!/bin/bash

# Arrays para almacenar enlaces de exploradores de bloques
declare -a goerli_links
declare -a mumbai_links

# Colores usando tput
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
RESET=$(tput sgr0)

echo "${BLUE}"
echo "█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ G O E R L I  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█"
echo "${YELLOW}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ INICIO COMPILACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "
echo " "

# Migrar en la red Ethereum Goerli Testnet y capturar la salida
truffle migrate --network ethereum_goerli_testnet | tee migration_output_goerli.txt

# Extraer las direcciones de los contratos para Goerli
ADDRESS_MemoriaUrbanaToken_goerli=$(sed -n '/MemoriaUrbanaToken/,/contract address:/p' migration_output_goerli.txt | grep 'contract address:' | awk '{print $4}')
ADDRESS_Market_Place_goerli=$(sed -n '/Market_Place/,/contract address:/p' migration_output_goerli.txt | grep 'contract address:' | awk '{print $4}')

echo "${GREEN}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ FIN COMPILACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "
echo "${MAGENTA}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ INICIO VERIFICACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "

# Comprobar si las direcciones se extrajeron correctamente
if [ -z "$ADDRESS_MemoriaUrbanaToken_goerli" ] || [ -z "$ADDRESS_Market_Place_goerli" ]; then
    echo "${RED}Error: No se pudo extraer las direcciones para Goerli.${RESET}"
else
    # Verificar los contratos en Goerli y almacenar enlaces
    truffle run verify MemoriaUrbanaToken@$ADDRESS_MemoriaUrbanaToken_goerli --network ethereum_goerli_testnet
    goerli_links+=("MemoriaUrbanaToken: https://goerli.etherscan.io/address/$ADDRESS_MemoriaUrbanaToken_goerli")
    echo "${CYAN}${goerli_links[0]}${RESET}"

    echo " "

    truffle run verify Market_Place@$ADDRESS_Market_Place_goerli --network ethereum_goerli_testnet
    goerli_links+=("Market_Place: https://goerli.etherscan.io/address/$ADDRESS_Market_Place_goerli")
    echo "${CYAN}${goerli_links[1]}${RESET}"
fi

echo "${GREEN}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ FIN VERIFICACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "

# Repetir el proceso para Polygon Mumbai Testnet
echo "${BLUE}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ P O L Y G O N  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█${RESET}"
echo "${YELLOW}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ INICIO COMPILACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "

truffle migrate --network polygon_mumbai_testnet | tee migration_output_mumbai.txt

# Extraer las direcciones de los contratos para Mumbai
ADDRESS_MemoriaUrbanaToken_mumbai=$(sed -n '/MemoriaUrbanaToken/,/contract address:/p' migration_output_mumbai.txt | grep 'contract address:' | awk '{print $4}')
ADDRESS_Market_Place_mumbai=$(sed -n '/Market_Place/,/contract address:/p' migration_output_mumbai.txt | grep 'contract address:' | awk '{print $4}')

echo "${GREEN}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ FIN COMPILACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "
echo "${MAGENTA}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ INICIO VERIFICACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "

# Comprobar si las direcciones se extrajeron correctamente
if [ -z "$ADDRESS_MemoriaUrbanaToken_mumbai" ] || [ -z "$ADDRESS_Market_Place_mumbai" ]; then
    echo "${RED}Error: No se pudo extraer las direcciones para Mumbai.${RESET}"
else
    # Verificar los contratos en Mumbai y almacenar enlaces
    truffle run verify MemoriaUrbanaToken@$ADDRESS_MemoriaUrbanaToken_mumbai --network polygon_mumbai_testnet
    mumbai_links+=("MemoriaUrbanaToken: https://mumbai.polygonscan.com/address/$ADDRESS_MemoriaUrbanaToken_mumbai")
    echo "${CYAN}${mumbai_links[0]}${RESET}"

    echo " "
    truffle run verify Market_Place@$ADDRESS_Market_Place_mumbai --network polygon_mumbai_testnet
    mumbai_links+=("Market_Place: https://mumbai.polygonscan.com/address/$ADDRESS_Market_Place_mumbai")
    echo "${CYAN}${mumbai_links[1]}${RESET}"
fi

echo "${GREEN}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ FIN VERIFICACION  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓${RESET}"
echo " "

# Imprimir todos los enlaces al final
echo " "
echo "${YELLOW}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ G O E R L I  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█${RESET}"
echo "Enlaces al explorador de bloques Goerli:"
for link in "${goerli_links[@]}"; do
    echo " "
    echo "${YELLOW}$link${RESET}"
    echo " "
done

echo " "
echo "${CYAN}█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓ P O L Y G O N  █▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█▓█${RESET}"
echo "Enlaces al explorador de bloques Mumbai:"
for link in "${mumbai_links[@]}"; do
    echo " "
    echo "${CYAN}$link${RESET}"
    echo " "
done


