import { world, system } from "@minecraft/server";
import { stateMachine, getMachineType, getMachineConfig, getBlockId, registerMachineInstance } from "./machineBase.js";

const maquinas = new Map();

export function registrarMaquina(id, data) {
    maquinas.set(id, data);
}

export function removerMaquina(id) {
    maquinas.delete(id);
}

export class MachineManager {
    constructor(block) {
        this.block = block;
        this.blockId = getBlockId(block);
    }

    handleInteraction(player) {
        if (!player || !this.block) return;

        const inventory = player.getComponent("minecraft:inventory")?.container;
        const item = inventory?.getItem(player.selectedSlotIndex);

        player.sendMessage(`§a[DEBUG] item na mão: ${item ? item.typeId : "nenhum"}`);

        if (!item) {
            player.sendMessage("§cNenhum item na mão!");
            return;
        }

        let type = getMachineType(this.block);
        if (!type) {
            if (this.block.typeId === "alp_tec:centrifuga") {
                registerMachineInstance(this.block, "centrifuga");
                type = "centrifuga";
            } else if (this.block.typeId === "alp_tec:chocadeira") {
                registerMachineInstance(this.block, "chocadeira");
                type = "chocadeira";
            }
        }

        if (!type) return;

        const config = getMachineConfig(type);
        if (!config) return;

        const state = stateMachine(this.block);
        config.onInteract({ player, block: this.block, item, blockId: this.blockId, state });
    }
}

system.runInterval(() => {
    for (const [id, maquina] of maquinas) {

        maquina.tempo--;

        if (maquina.tempo <= 0) {
            maquina.onFinish();
            maquinas.delete(id);
        }
    }
}, 20); // roda a cada 1 segundo

