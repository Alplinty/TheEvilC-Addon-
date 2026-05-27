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
        player?.sendMessage("§a[DEBUG] MachineManager.handleInteraction start");
        if (!player) {
            return;
        }
        if (!this.block) {
            player.sendMessage("§c[DEBUG] MachineManager: bloco indefinido");
            return;
        }

        let type = getMachineType(this.block);
        player.sendMessage(`§a[DEBUG] MachineManager tipo atual: ${type ?? "null"}`);
        player.sendMessage(`§a[DEBUG] MachineManager block.typeId: ${this.block.typeId}`);

        if (!type) {
            if (this.block.typeId === "alp_tec:centrifuga") {
                player.sendMessage("§a[DEBUG] MachineManager inferiu tipo centrífuga por typeId");
                registerMachineInstance(this.block, "centrifuga");
                type = "centrifuga";
            } else if (this.block.typeId === "alp_tec:chocadeira") {
                player.sendMessage("§a[DEBUG] MachineManager inferiu tipo chocadeira por typeId");
                registerMachineInstance(this.block, "chocadeira");
                type = "chocadeira";
            } else {
                player.sendMessage("§c[DEBUG] MachineManager não conseguiu inferir tipo por typeId");
            }
        }

        if (!type) {
            player.sendMessage("§c[DEBUG] MachineManager sem tipo de máquina definido");
            return;
        }

        const config = getMachineConfig(type);
        if (!config) {
            player.sendMessage(`§c[DEBUG] MachineManager sem config para tipo ${type}`);
            return;
        }

        const item = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
        player.sendMessage(`§a[DEBUG] MachineManager item mainhand: ${item ? item.id : "nenhum"}`);
        if (!item) {
            player.sendMessage("§c[DEBUG] MachineManager não encontrou item na mão principal");
            return;
        }

        const state = stateMachine(this.block);
        player.sendMessage(`§a[DEBUG] MachineManager estado atual: ${state.state}`);
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

