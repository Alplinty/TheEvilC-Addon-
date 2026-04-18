import { world, system } from "@minecraft/server";

const maquinas = new Map();

export function registrarMaquina(id, data) {
    maquinas.set(id, data);
}

export function removerMaquina(id) {
    maquinas.delete(id);
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

