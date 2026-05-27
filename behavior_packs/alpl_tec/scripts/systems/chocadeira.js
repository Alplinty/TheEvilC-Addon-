import {world, ItemStack} from "@minecraft/server";
import {consumeItem} from "../utils/consumeItem.js";
import {registerMachine, registerMachineInstance} from "../utils/machineBase.js";
import {registrarMaquina} from "../utils/machineManager.js";

registerMachine("chocadeira", {
    onInteract: ({player, block, item, blockId, state}) => {
        if (item.typeId !== "alp_tec:liquido_gerador") {
            player.sendMessage("§c[Chocadeira] Use líquido gerador!");
            return;
        }

        const entityId = item.getDynamicProperty("alp_mob");
        if (!entityId) {
            player.sendMessage("§c[Chocadeira] Esse item não contém um DNA válido!");
            return;
        }

        if (state.state === "processando") {
            player.sendMessage("§c[Chocadeira] Já está em uso!");
            return;
        }

        consumeItem(player);

        player.sendMessage("§e[Chocadeira] Incubando...");
        state.setState("processando");
        registrarMaquina(blockId, {
            tempo: 10,
            onFinish: () => {
                const ovoGerador = new ItemStack("alp_tec:ovo_gerador", 1);
                ovoGerador.setDynamicProperty("alp_mob", entityId);

                block.dimension.playSound("random.orb", block.location);
                block.dimension.spawnItem(ovoGerador, block.location);
                state.setState("idle");
            }
        });
    }
});

// Machine instances are registered lazily by `MachineManager` when a player
// interacts with a block that contains the machine custom component.
