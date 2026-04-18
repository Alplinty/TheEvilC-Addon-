
export function consumeItem(player) {
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    const currentItem = equippable.getEquipment("Mainhand");
    if (!currentItem) return;
    if (currentItem.amount > 1) {
        currentItem.amount -= 1;
        equippable.setEquipment("Mainhand", currentItem);
    } else {
        equippable.setEquipment("Mainhand", undefined);
    }
}