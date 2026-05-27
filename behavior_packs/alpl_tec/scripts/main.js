// ct:/main.js
import {world, system} from "@minecraft/server";
import {MachineManager} from "./utils/machineManager.js";

world.beforeEvents.worldInitialize.subscribe((event) => {
  const registry = event.itemComponentRegistry;
  registry.registerDynamicProperties({
    alp_mob: "string"
  });

  const blockRegistry = event.blockComponentRegistry;
  if (blockRegistry?.registerCustomComponent) {
    blockRegistry.registerCustomComponent("alp_tec:centrifuga_interact", {
      onInteract: (event) => {
        const block = event.block;
        const player = event.player;
        player?.sendMessage("§a[DEBUG] onInteract centrífuga recebido");
        const machineManager = new MachineManager(block);
        machineManager.handleInteraction(player);
      }
    });
    blockRegistry.registerCustomComponent("alp_tec:chocadeira_interact", {
      onInteract: (event) => {
        const block = event.block;
        const player = event.player;
        player?.sendMessage("§a[DEBUG] onInteract chocadeira recebido");
        const machineManager = new MachineManager(block);
        machineManager.handleInteraction(player);
      }
    });
  }
});

world.afterEvents.playerInteractWithBlock?.subscribe((event) => {
  const player = event.player;
  const block = event.block;
  if (!player || !block) return;
  if (block.typeId === "alp_tec:centrifuga" || block.typeId === "alp_tec:chocadeira") {
    const item = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
    player.sendMessage(`§b[DEBUG] playerInteractWithBlock: clicou em ${block.typeId} com ${item ? item.id : "nenhum item"}`);
    const machineManager = new MachineManager(block);
    machineManager.handleInteraction(player);
  }
});

world.afterEvents.beforeItemUseOn?.subscribe((event) => {
  const player = event.source;
  const block = event.block;
  if (!player || !block) return;
  if (block.typeId === "alp_tec:centrifuga" || block.typeId === "alp_tec:chocadeira") {
    const item = event.item;
    player.sendMessage(`§b[DEBUG] beforeItemUseOn: ${block.typeId} com ${item ? item.id : "nenhum item"}`);
    const machineManager = new MachineManager(block);
    machineManager.handleInteraction(player);
  }
});

world.afterEvents.playerJoin?.subscribe((event) => {
  event.player.sendMessage("§e[DEBUG] Addon de máquinas carregado");
});
 
// Importar sistemas
import "./systems/seringa.js";
import "./systems/dna.js";
import "./systems/ovo_spawn.js";
import "./systems/centrifuga.js";
import "./systems/chocadeira.js";


let startDebugSent = false;
system.runInterval(() => {
  const players = world.getPlayers();
  if (!startDebugSent && players.length > 0) {
    players[0].sendMessage("§e[DEBUG] script main.js carregado e rodando");
    startDebugSent = true;
  }
  for (const player of players) {
    player.sendMessage("§e[ALPL Tec] Lembre-se de usar as máquinas para processar seus itens!");
  }
}, 100)