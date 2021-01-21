# Patching the Cypress binary to remove any references to /dev/shm
echo "Attempting to patch Cypress 1"
position=$(strings -t d /function/.cache/6.0.0/Cypress/Cypress | grep '/dev\/shm' -m 1 | cut -d' ' -f1)
echo -n '/tmp/shm' | dd bs=1 of=/function/.cache/6.0.0/Cypress/Cypress seek="$position" conv=notrunc || echo "Nothing to change"


echo "Attempting to patch Cypress 2"
position=$(strings -t d /function/.cache/6.0.0/Cypress/Cypress | grep '/dev\/shm\/' | cut -d' ' -f1)
echo -n '/tmp/shm/' | dd bs=1 of=/function/.cache/6.0.0/Cypress/Cypress seek="$position" conv=notrunc || echo "Nothing to change"