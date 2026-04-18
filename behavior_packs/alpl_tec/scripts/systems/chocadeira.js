import { world, system, ItemStack } from "@minecraft/server";
import { consumeItem } from "../utils/consumeItem.js";

world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source ?? world.getPlayers()[0];
    const item = event.itemStack;

    if (item.typeId === "alp_tec:liquido_gerador") {

        const inv = player.getComponent("minecraft:inventory").container;

        let temOvo = false;

        // verifica ovo
        for (let i = 0; i < inv.size; i++) {
            const slot = inv.getItem(i);

            if (slot && slot.typeId === "minecraft:egg") {
                if (slot.amount > 1) {
                    slot.amount -= 1;
                    inv.setItem(i, slot);
                } else {
                    inv.setItem(i, undefined);
                }
                temOvo = true;
                break;
            }
        }

        if (!temOvo) {
            player?.sendMessage("§cVocê precisa de um ovo!");
            return;
        }

        const entityId = item.getDynamicProperty("alp_mob");
        if (!entityId) {
            player?.sendMessage("§cDNA inválido!");
            return;
        }

        // remove liquido
        consumeItem(player);

        player?.sendMessage("§e[Chocadeira] Incubando...");

        // delay (10 segundos)
        system.runTimeout(() => {
            const ovoGerador = new ItemStack("alp_tec:ovo_gerador", 1);
            ovoGerador.setDynamicProperty("alp_mob", entityId);

            player.getComponent("minecraft:inventory").container.addItem(ovoGerador);

            player?.sendMessage("§a[Chocadeira] Ovo pronto!");
        }, 200);
    }
});