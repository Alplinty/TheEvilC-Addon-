// ct:/main.js
import {world, system} from "@minecraft/server";

// Registrar propriedades dinâmicas para itens e blocos
world.beforeEvents.worldInitialize.subscribe((event) => {
  const registry = event.itemComponentRegistry;
  const blockRegistry = event.blockComponentRegistry;

  registry.registerDynamicProperties({
    alp_mob: "string"
  });
  blockRegistry.registerDynamicProperties({
    alp_machine: "string"
  });
});
 
// Importar sistemas
import "./systems/seringa.js";
import "./systems/dna.js";
import "./systems/ovo_spawn.js";
import "./systems/centrifuga.js";
import "./systems/chocadeira.js";
import "./systems/machineManager.js";


function mainTick() {
  /*if (system.currentTick % 100 === 0) { // A cada 5 segundos (100 ticks)
    for (const player of world.getPlayers()) {
      player.sendMessage("All systems GO!");
    }
  }*/
  system.run(mainTick);
}
system.run(mainTick);