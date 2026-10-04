import {world} from "@minecraft/server";

// Mapa para armazenar tipos de máquinas e suas configurações
const machineTypes = new Map();
// Mapa de estado de máquinas por bloco
const machineStates = new Map();
// Mapa de tipo de máquina por bloco
const machineInstances = new Map();

export function getBlockId(block) {
    return `${block.dimension.id}:${block.location.x},${block.location.y},${block.location.z}`;
}

export function registerMachine(type, config) {
    machineTypes.set(type, config);
}

function readMachineState(block) {
    const blockId = getBlockId(block);
    return machineStates.get(blockId) || "idle";
}

function writeMachineState(block, state) {
    const blockId = getBlockId(block);
    machineStates.set(blockId, state);
}

export function stateMachine(block) {
    const state = readMachineState(block);
    return {
        state,
        setState: (newState) => writeMachineState(block, newState)
    };
}

export function registerMachineInstance(block, type) {
    const blockId = getBlockId(block);
    machineStates.set(blockId, "idle");
    machineInstances.set(blockId, type);
}

export function getMachineType(block) {
    const blockId = getBlockId(block);
    return machineInstances.get(blockId);
}

export function getMachineConfig(type) {
    return machineTypes.get(type);
}

export function handleMachineInteraction(event) {
    const player = event.player ?? world.getPlayers()[0];
    const block = event.block;
    const blockId = getBlockId(block);

    if (!player || !block) return;

    const type = machineInstances.get(blockId);
    if (!type) return;

    const config = machineTypes.get(type);
    if (!config) return;

    const item = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
    if (!item) return;

    const state = stateMachine(block);
    config.onInteract({player, block, item, blockId, state});
}
