import {world, ItemStack} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";
import {registerMachine, registerMachineInstance} from "../utils/machineBase.js";
import {registrarMaquina} from "../utils/machineManager.js";

registerMachine("centrifuga", {
    onInteract: ({player, block, item, blockId, state}) => {
        if (item.typeId !== "alp_tec:liquido_incompleto") {
            player.sendMessage("§c[Centrífuga] Use líquido incompleto!");
            return;
        }

        const entityId = item.getDynamicProperty("alp_mob");
        if (!entityId) {
            player.sendMessage("§c[Centrífuga] Esse item não contém um DNA válido!");
            return;
        }

        if (state.state === "processando") {
            player.sendMessage("§c[Centrífuga] Já está em uso!");
            return;
        }

        consumeItem(player);

        player.sendMessage("§7[Centrífuga] Iniciando processo...");
        state.setState("processando");

        registrarMaquina(blockId, {
            tempo: 5,
            onFinish: () => {
                const itemGerador = new ItemStack("alp_tec:liquido_gerador", 1);
                itemGerador.setDynamicProperty("alp_mob", entityId);

                block.dimension.playSound("random.orb", block.location);
                block.dimension.spawnItem(itemGerador, block.location);
                state.setState("idle");
            }
        });
    }
});

// Machine instances are registered lazily by `MachineManager` when a player
// interacts with a block that contains the machine custom component.
