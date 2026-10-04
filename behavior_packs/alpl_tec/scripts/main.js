import {world, system} from "@minecraft/server";
import {MachineManager} from "./utils/machineManager.js";
import "./systems/seringa.js";
import "./systems/dna.js";
import "./systems/ovo_spawn.js";
import "./systems/centrifuga.js";
import "./systems/chocadeira.js";

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const player = event.player;
    const block = event.block;
    if (!player || !block) return;
    if (
        block.typeId === "alp_tec:centrifuga" ||
        block.typeId === "alp_tec:chocadeira"
    ) {
        if (!player.isSneaking) return; 
        new MachineManager(block).handleInteraction(player);
        player.sendMessage("[DEBUG] Interagindo com máquina");
    }
});

system.runInterval(() => {
  const players = world.getPlayers();
  for (const player of players) {
    player.sendMessage("§aTESTE RODANDO");
  }
}, 200);