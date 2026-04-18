import {world, ItemStack, system} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";
import {registrarMaquina} from "./machineManager.js";

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const block = event.block;

    if (block.typeId === "minecraft:brewing_stand") {
        block.setDynamicProperty("alp_machine", "centrifuga");
    }
});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const player = event.player ?? world.getPlayers()[0];
    const block = event.block;

    if (!player || !block) return;
    if (block.typeId !== "minecraft:brewing_stand") return;
    if (block.getDynamicProperty("alp_machine") !== "centrifuga") return;

    const itemStack = player.getComponent("minecraft:equippable")
        ?.getEquipment("Mainhand");
    if (!itemStack) return;

    const entityId = itemStack.getDynamicProperty("alp_mob");
    if (!entityId) {
        player?.sendMessage("§cEsse item não contém um DNA válido!");
        return;
    }

    if (itemStack.typeId !== "alp_tec:liquido_incompleto") {
        player?.sendMessage("§cUse líquido incompleto!");
        return;
    }

    consumeItem(player);

    player?.sendMessage("§7[Centrífuga] Iniciando processo...");
    const id = `${block.location.x},${block.location.y},${block.location.z}`;

    registrarMaquina(id, {
        tempo: 5,
        onFinish: () => {
            const inv = player.getComponent("minecraft:inventory").container;

            const itemGerador = new ItemStack("alp_tec:liquido_gerador", 1);
            itemGerador.setDynamicProperty("alp_mob", entityId);
            inv.addItem(itemGerador);

            player?.sendMessage("§a[Centrífuga] Processo concluído!");
        }
    });
});
