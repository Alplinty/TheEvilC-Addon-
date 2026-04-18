import {world, ItemStack} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";
world.afterEvents.entityHitEntity.subscribe((event) => {
    const player = event.damagingEntity;
    const target = event.hitEntity;

    if (!player || !target || player.typeId !== "minecraft:player") return;

    const item = player.getComponent("minecraft:equippable")
        ?.getEquipment("Mainhand");

    if (!item) {return;}

    if (item.typeId === "alp_tec:seringa") {
            const inventory = player.getComponent("minecraft:inventory").container;

            // cria DNA e adiciona ao inventário antes de definir dynamic property
            const dnaItem = new ItemStack("alp_tec:dna", 1);

            const leftover = inventory.addItem(dnaItem);
            if (leftover) {
                player.sendMessage("§cInventário cheio! DNA não pôde ser adicionado.");
                return;
            }

            let dnaSlot = -1;
            for (let i = 0; i < inventory.size; i++) {
                const invItem = inventory.getItem(i);
                if (invItem && invItem.typeId === "alp_tec:dna" && !invItem.getDynamicProperty("alp_mob")) {
                    dnaSlot = i;
                    break;
                }
            }

            if (dnaSlot < 0) {
                player.sendMessage("§cErro ao localizar o DNA criado no inventário.");
                return;
            }

            const insertedDna = inventory.getItem(dnaSlot);
            if (!insertedDna) {
                player.sendMessage("§cErro interno ao acessar o DNA criado.");
                return;
            }

            try {
                insertedDna.setDynamicProperties({ alp_mob: target.typeId });
            } catch (error) {
                player.sendMessage("§cErro ao gravar DNA após inserir no inventário.");
                player.sendMessage(`§cDetalhe: ${error}`);
                return;
            }

            inventory.setItem(dnaSlot, insertedDna);
            consumeItem(player);
            player.sendMessage("§aDNA criado!");
    }
});
