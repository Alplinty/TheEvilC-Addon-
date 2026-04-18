import {world, ItemStack} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";

world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (!player || !item) return;

    if (item.typeId === "alp_tec:dna") {
        const mob = item.getDynamicProperty("alp_mob");

        if (!mob) {
            player.sendMessage("DNA inválido");
            return;
        }

        const inventory = player.getComponent("minecraft:inventory").container;

        // procurar soro
        let hasSoro = false;
        let soroSlot = -1;

        for (let i = 0; i < inventory.size; i++) {
            const invItem = inventory.getItem(i);

            if (invItem && invItem.typeId === "alp_tec:soro_estabilizador") {
                hasSoro = true;
                soroSlot = i;
                break;
            }
        }

        if (hasSoro === true) {
            // remover itens
            consumeItem(player); 
            inventory.setItem(soroSlot, undefined);

            // criar líquido incompleto
            const liquido = new ItemStack("alp_tec:liquido_incompleto", 1);
            liquido.setDynamicProperty("alp_mob", item.getDynamicProperty("alp_mob"));

            inventory.addItem(liquido);
            return;
        }
        player.sendMessage("Você precisa de um Soro Estabilizador para processar este DNA!");
    }
});