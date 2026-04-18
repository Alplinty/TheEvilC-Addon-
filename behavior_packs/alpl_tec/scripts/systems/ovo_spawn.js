import {world} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (!player || !item || item.typeId !== "alp_tec:ovo_gerador") return;

    const mob = item.getDynamicProperty("alp_mob");
    if (!mob) {
        player.sendMessage("Ovo Gerador inválido!");
        return;
    }
    
    const dimension = player.dimension;
    const location = player.location;

    dimension.spawnEntity(mob, location);
    player.sendMessage(`Criatura gerada: ${mob}`);
    consumeItem(player);
});