/**
 * The base prototype object of all structures.
 */
interface Structure<T extends StructureConstant = StructureConstant> extends RoomObject {
    readonly prototype: Structure;

    /**
     * The current amount of hit points of the structure.
     */
    hits: number;
    /**
     * The total amount of hit points of the structure.
     */
    hitsMax: number;
    /**
     * A unique object identifier.
     *
     * You can use {@link Game.getObjectById} to retrieve an object instance by its id.
     */
    id: Id<this>;
    /**
     * The room the structure is in.
     *
     * If you can get an instance of a Structure, you can see it.
     * If you can see the Structure, you can see the room it's in.
     */
    room: Room;
    /**
     * One of the {@link StructureConstant STRUCTURE_*} constants.
     */
    structureType: T;
    /**
     * Destroy this structure immediately.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_BUSY: Hostile creeps are in the room.
     */
    destroy(): ScreepsReturnCode;
    /**
     * Check whether this structure can be used. If the room controller level is not enough, then this method will return false, and the structure will be highlighted with red in the game.
     */
    isActive(): boolean;
    /**
     * Toggle auto notification when the structure is under attack. The notification will be sent to your account email. Turned on by default.
     * @param enabled Whether to enable notification or disable.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_INVALID_ARGS: enable argument is not a boolean value.
     */
    notifyWhenAttacked(enabled: boolean): ScreepsReturnCode;
}

interface StructureConstructor extends _Constructor<Structure>, _ConstructorById<Structure> {}

declare const Structure: StructureConstructor;

/**
 * The base prototype for a structure that has an owner.
 *
 * Such structures can be found using {@link Room.find} and the {@link FIND_MY_STRUCTURES} & {@link FIND_HOSTILE_STRUCTURES} constants.
 */
interface OwnedStructure<T extends StructureConstant = StructureConstant> extends Structure<T> {
    readonly prototype: OwnedStructure;

    /**
     * Whether this is your own structure.
     *
     * Walls and roads don't have this property as they are considered neutral structures.
     */
    my: boolean;
    /**
     * An object with the structure’s owner info (if present).
     */
    owner: T extends STRUCTURE_CONTROLLER ? Owner | undefined : Owner;
    /**
     * The link to the Room object.
     *
     * Is always present because owned structures give visibility.
     */
    room: Room;
}

interface OwnedStructureConstructor extends _Constructor<OwnedStructure>, _ConstructorById<OwnedStructure> {}

declare const OwnedStructure: OwnedStructureConstructor;

/**
 * Claim this structure to take control over the room.
 *
 * The controller structure cannot be damaged or destroyed.
 * It can be addressed by {@link Room.controller} property.
 */
interface StructureController extends OwnedStructure<STRUCTURE_CONTROLLER> {
    readonly prototype: StructureController;

    /**
     * Whether using power is enabled in this room.
     *
     * Use {@link PowerCreep.enableRoom()} to turn powers on.
     */
    isPowerEnabled: boolean;
    /**
     * Current controller level, from 0 to 8.
     */
    level: number;
    /**
     * The current progress of upgrading the controller to the next level.
     */
    progress: number;
    /**
     * The progress needed to reach the next level.
     */
    progressTotal: number;
    /**
     * The reservation info for the controller.
     *
     * Can be undefined if the controller isn't reserved.
     */
    reservation: ReservationDefinition | undefined;
    /**
     * How many ticks of safe mode are remaining, or undefined.
     */
    safeMode?: number;
    /**
     * Safe mode activations available to use.
     */
    safeModeAvailable: number;
    /**
     * During this period in ticks new safe mode activations will be blocked, undefined if cooldown is inactive.
     */
    safeModeCooldown?: number;
    /**
     * An object with the controller sign info if present
     */
    sign: SignDefinition | undefined;
    /**
     * The amount of game ticks when this controller will lose one level.
     *
     * This timer can be reset by using {@link Creep.upgradeController}
     */
    ticksToDowngrade: number;
    /**
     * The amount of game ticks while this controller cannot be upgraded due to attack.
     */
    upgradeBlocked: number;
    /**
     * Activate safe mode if available.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this controller.
     * - ERR_BUSY: There is another room in safe mode already.
     * - ERR_NOT_ENOUGH_RESOURCES: There is no safe mode activations available.
     * - ERR_TIRED: The previous safe mode is still cooling down, or the controller is upgradeBlocked, or the controller is downgraded for 50% plus 5000 ticks or more.
     */
    activateSafeMode(): ScreepsReturnCode;
    /**
     * Make your claimed controller neutral again.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this controller.
     */
    unclaim(): ScreepsReturnCode;
}

interface StructureControllerConstructor extends _Constructor<StructureController>, _ConstructorById<StructureController> {}

declare const StructureController: StructureControllerConstructor;

/**
 * Contains energy which can be spent on spawning bigger creeps.
 *
 * Extensions can be placed anywhere in the room, any spawns will be able to use them regardless of distance.
 */
interface StructureExtension extends OwnedStructure<STRUCTURE_EXTENSION> {
    readonly prototype: StructureExtension;

    /**
     * The amount of energy containing in the extension.
     *
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy the extension can contain.
     *
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;

    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY, false>;
}

interface StructureExtensionConstructor extends _Constructor<StructureExtension>, _ConstructorById<StructureExtension> {}

declare const StructureExtension: StructureExtensionConstructor;

/**
 * Remotely transfers energy to another Link in the same room.
 */
interface StructureLink extends OwnedStructure<STRUCTURE_LINK> {
    readonly prototype: StructureLink;

    /**
     * The amount of game ticks the link has to wait until the next transfer is possible.
     */
    cooldown: number;
    /**
     * The amount of energy containing in the link.
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy the link can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY, false>;
    /**
     * Transfer energy from the link to another link.
     *
     * The target link can be at any position within the room.
     *
     * Remote transfer process implies 3% energy loss and cooldown delay depending on the distance.
     * @param target The target object.
     * @param amount The amount of energy to be transferred. If omitted, all the available energy is used.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this link.
     * - ERR_NOT_ENOUGH_RESOURCES: The structure does not have the given amount of energy.
     * - ERR_INVALID_TARGET: The target is not a valid StructureLink object.
     * - ERR_FULL: The target cannot receive any more energy.
     * - ERR_NOT_IN_RANGE: The target is too far away.
     * - ERR_INVALID_ARGS: The energy amount is incorrect.
     * - ERR_TIRED: The link is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this link.
     */
    transferEnergy(target: StructureLink, amount?: number): ScreepsReturnCode;
}

interface StructureLinkConstructor extends _Constructor<StructureLink>, _ConstructorById<StructureLink> {}

declare const StructureLink: StructureLinkConstructor;

/**
 * Non-player structure.
 *
 * Spawns NPC Source Keepers that guards energy sources and minerals in some rooms.
 * This structure cannot be destroyed.
 */
interface StructureKeeperLair extends OwnedStructure<STRUCTURE_KEEPER_LAIR> {
    readonly prototype: StructureKeeperLair;

    /**
     * Time to spawning of the next Source Keeper.
     */
    ticksToSpawn?: number;
}

interface StructureKeeperLairConstructor extends _Constructor<StructureKeeperLair>, _ConstructorById<StructureKeeperLair> {}

declare const StructureKeeperLair: StructureKeeperLairConstructor;

/**
 * Provides visibility into a distant room from your script.
 */
interface StructureObserver extends OwnedStructure<STRUCTURE_OBSERVER> {
    readonly prototype: StructureObserver;

    /**
     * Provide visibility into a distant room from your script.
     *
     * The target room object will be available on the next tick. The maximum range is 5 rooms.
     * @param roomName The room to observe.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_IN_RANGE: Room roomName is not in observing range.
     * - ERR_INVALID_ARGS: roomName argument is not a valid room name value.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    observeRoom(roomName: string): ScreepsReturnCode;
}

interface StructureObserverConstructor extends _Constructor<StructureObserver>, _ConstructorById<StructureObserver> {}

declare const StructureObserver: StructureObserverConstructor;

/**
 * Non-player structure.
 *
 * Contains power resource which can be obtained by destroying the structure.
 * Hits the attacker creep back on each attack.
 */
interface StructurePowerBank extends OwnedStructure<STRUCTURE_POWER_BANK> {
    readonly prototype: StructurePowerBank;

    /**
     * The amount of power containing.
     */
    power: number;
    /**
     * The amount of game ticks when this structure will disappear.
     */
    ticksToDecay: number;
}

interface StructurePowerBankConstructor extends _Constructor<StructurePowerBank>, _ConstructorById<StructurePowerBank> {}

declare const StructurePowerBank: StructurePowerBankConstructor;

/**
 * Non-player structure.
 *
 * Contains power resource which can be obtained by destroying the structure.
 * Hits the attacker creep back on each attack.
 */
interface StructurePowerSpawn extends OwnedStructure<STRUCTURE_POWER_SPAWN> {
    readonly prototype: StructurePowerSpawn;
    /**
     * The amount of energy containing in this structure.
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy this structure can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;
    /**
     * The amount of power containing in this structure.
     * @deprecated An alias for .store[RESOURCE_POWER].
     */
    power: number;
    /**
     * The total amount of power this structure can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_POWER).
     */
    powerCapacity: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY | RESOURCE_POWER, false>;

    /**
     * Register power resource units into your account.
     *
     * Registered power allows to develop power creeps skills. Consumes 1 power resource unit and 50 energy resource units.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_RESOURCES: The structure does not have enough energy or power resource units.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    processPower(): ScreepsReturnCode;
}

interface StructurePowerSpawnConstructor extends _Constructor<StructurePowerSpawn>, _ConstructorById<StructurePowerSpawn> {}

declare const StructurePowerSpawn: StructurePowerSpawnConstructor;

/**
 * A rampart structure.
 *
 * Blocks movement of hostile creeps, and defends your creeps and structures on
 * the same tile. Can be used as a controllable gate.
 */
interface StructureRampart extends OwnedStructure<STRUCTURE_RAMPART> {
    readonly prototype: StructureRampart;

    /**
     * The amount of game ticks when this rampart will lose some hit points.
     */
    ticksToDecay: number;

    /**
     * Whether the rampart is open to the public or not.
     *
     * If false (default), only your creeps can step on the same square.
     * If true, any hostile creeps can pass through.
     */
    isPublic: boolean;

    /**
     * Make this rampart public to allow other players' creeps to pass through.
     * @param isPublic Whether this rampart should be public or non-public
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     */
    setPublic(isPublic: boolean): undefined;
}

interface StructureRampartConstructor extends _Constructor<StructureRampart>, _ConstructorById<StructureRampart> {}

declare const StructureRampart: StructureRampartConstructor;

/**
 * Decreases movement cost to 1.
 *
 * Using roads allows creating creeps with less `MOVE` body parts.
 */
interface StructureRoad extends Structure<STRUCTURE_ROAD> {
    readonly prototype: StructureRoad;

    /**
     * The amount of game ticks when this road will lose some hit points.
     */
    ticksToDecay: number;
}

interface StructureRoadConstructor extends _Constructor<StructureRoad>, _ConstructorById<StructureRoad> {}

declare const StructureRoad: StructureRoadConstructor;

/**
 * A structure that can store huge amount of resource units.
 *
 * Only one structure per room is allowed that can be addressed by {@link Room.storage} property.
 */
interface StructureStorage extends OwnedStructure<STRUCTURE_STORAGE> {
    readonly prototype: StructureStorage;

    /**
     * An object with the storage contents.
     */
    store: StoreDefinition;
    /**
     * The total amount of resources the storage can contain.
     * @deprecated An alias for .store.getCapacity().
     */
    storeCapacity: number;
}

interface StructureStorageConstructor extends _Constructor<StructureStorage>, _ConstructorById<StructureStorage> {}

declare const StructureStorage: StructureStorageConstructor;

/**
 * Remotely attacks or heals creeps, or repairs structures.
 *
 * Can be targeted to any object in the room. However, its effectiveness highly depends on the
 * distance. Each action consumes energy.
 */
interface StructureTower extends OwnedStructure<STRUCTURE_TOWER> {
    readonly prototype: StructureTower;

    /**
     * The amount of energy containing in this structure.
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy this structure can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY, false>;

    /**
     * Remotely attack any creep or structure in the room.
     *
     * Consumes 10 energy units per tick. Attack power depends on the distance to the target: from 600 hits at range 10 to 300 hits at range 40.
     * @param target The target creep.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_ENERGY: The tower does not have enough energy.
     * - ERR_INVALID_TARGET: The target is not a valid attackable object.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    attack(target: AnyCreep | Structure): ScreepsReturnCode;
    /**
     * Remotely heal any creep in the room.
     *
     * Consumes 10 energy units per tick. Heal power depends on the distance to the target: from 400 hits at range 10 to 200 hits at range 40.
     * @param target The target creep.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_ENERGY: The tower does not have enough energy.
     * - ERR_INVALID_TARGET: The target is not a valid attackable object.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    heal(target: AnyCreep): ScreepsReturnCode;
    /**
     * Remotely repair any structure in the room.
     *
     * Consumes 10 energy units per tick. Repair power depends on the distance to the target: from 600 hits at range 10 to 300 hits at range 40.
     * @param target The target structure.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_ENERGY: The tower does not have enough energy.
     * - ERR_INVALID_TARGET: The target is not a valid attackable object.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    repair(target: Structure): ScreepsReturnCode;
}

interface StructureTowerConstructor extends _Constructor<StructureTower>, _ConstructorById<StructureTower> {}

declare const StructureTower: StructureTowerConstructor;

/**
 * Blocks movement of all creeps.
 */
interface StructureWall extends Structure<STRUCTURE_WALL> {
    readonly prototype: StructureWall;
    /**
     * The amount of game ticks when the wall will disappear (only for automatically placed border walls at the start of the game).
     */
    ticksToLive: number;
}

interface StructureWallConstructor extends _Constructor<StructureWall>, _ConstructorById<StructureWall> {}

declare const StructureWall: StructureWallConstructor;

/**
 * Allows to harvest mineral deposits.
 */
interface StructureExtractor extends OwnedStructure<STRUCTURE_EXTRACTOR> {
    readonly prototype: StructureExtractor;
    /**
     * The amount of game ticks until the next harvest action is possible.
     */
    cooldown: number;
}

interface StructureExtractorConstructor extends _Constructor<StructureExtractor>, _ConstructorById<StructureExtractor> {}

declare const StructureExtractor: StructureExtractorConstructor;

/**
 * Produces mineral compounds from base minerals and boosts creeps.
 */
interface StructureLab extends OwnedStructure<STRUCTURE_LAB> {
    readonly prototype: StructureLab;
    /**
     * The amount of game ticks the lab has to wait until the next reaction is possible.
     */
    cooldown: number;
    /**
     * The amount of energy containing in the lab. Energy is used for boosting creeps.
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy the lab can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;
    /**
     * The amount of mineral resources containing in the lab.
     * @deprecated An alias for lab.store[lab.mineralType].
     */
    mineralAmount: number;
    /**
     * The type of minerals containing in the lab.
     *
     * Labs can contain only one mineral type at the same time.
     * Null in case there is no mineral resource in the lab.
     */
    mineralType: MineralConstant | MineralCompoundConstant | null;
    /**
     * The total amount of minerals the lab can contain.
     * @deprecated An alias for lab.store.getCapacity(lab.mineralType || yourMineral).
     */
    mineralCapacity: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY | MineralConstant | MineralCompoundConstant, false>;
    /**
     * Boosts creep body part using the containing mineral compound.
     *
     * The creep has to be at adjacent square to the lab. Boosting one body part consumes 30 mineral units and 20 energy units.
     * @param creep The target creep.
     * @param bodyPartsCount The number of body parts of the corresponding type to be boosted.
     * Body parts are always counted left-to-right for TOUGH, and right-to-left for other types.
     * If undefined, all the eligible body parts are boosted.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this lab.
     * - ERR_NOT_FOUND: The mineral containing in the lab cannot boost any of the creep's body parts.
     * - ERR_NOT_ENOUGH_RESOURCES: The lab does not have enough energy or minerals.
     * - ERR_INVALID_TARGET: The targets is not valid creep object.
     * - ERR_NOT_IN_RANGE: The targets are too far away.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    boostCreep(creep: Creep, bodyPartsCount?: number): ScreepsReturnCode;
    /**
     * Unboost a creep.
     *
     * Immediately remove boosts from the creep and drop 50% of the mineral compounds used to boost it onto the ground regardless of the creep's remaining time to live.
     * The creep has to be at adjacent square to the lab.
     * Unboosting requires cooldown time equal to the total sum of the reactions needed to produce all the compounds applied to the creep.
     * @param creep The target creep.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this lab, or the target creep.
     * - ERR_NOT_FOUND: The target has no boosted parts.
     * - ERR_INVALID_TARGET: The target is not a valid Creep object.
     * - ERR_NOT_IN_RANGE: The target is too far away.
     * - ERR_TIRED: The lab is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    unboostCreep(creep: Creep): ScreepsReturnCode;
    /**
     * Breaks mineral compounds back into reagents.
     *
     * The same output labs can be used by many source labs.
     * @param lab1 The first result lab.
     * @param lab2 The second result lab.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this lab.
     * - ERR_NOT_ENOUGH_RESOURCES: The source lab do not have enough resources.
     * - ERR_INVALID_TARGET: The targets are not valid lab objects.
     * - ERR_FULL: One of targets cannot receive any more resource.
     * - ERR_NOT_IN_RANGE: The targets are too far away.
     * - ERR_INVALID_ARGS: The reaction cannot be reversed into this resources.
     * - ERR_TIRED: The lab is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    reverseReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
    /**
     * Produce mineral compounds using reagents from two another labs.
     *
     * Each lab has to be within 2 squares range. The same input labs can be used by many output labs
     * @param lab1 The first source lab.
     * @param lab2 The second source lab.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this lab.
     * - ERR_NOT_ENOUGH_RESOURCES: The source lab do not have enough resources.
     * - ERR_INVALID_TARGET: The targets are not valid lab objects.
     * - ERR_FULL: The target cannot receive any more resource.
     * - ERR_NOT_IN_RANGE: The targets are too far away.
     * - ERR_INVALID_ARGS: The reaction cannot be run using this resources.
     * - ERR_TIRED: The lab is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    runReaction(lab1: StructureLab, lab2: StructureLab): ScreepsReturnCode;
}

interface StructureLabConstructor extends _Constructor<StructureLab>, _ConstructorById<StructureLab> {}

declare const StructureLab: StructureLabConstructor;

/**
 * Sends any resources to a Terminal in another room.
 */
interface StructureTerminal extends OwnedStructure<STRUCTURE_TERMINAL> {
    readonly prototype: StructureTerminal;
    /**
     * The remaining amount of ticks while this terminal cannot be used to make {@link StructureTerminal.send} or {@link Game.market.deal} calls.
     */
    cooldown: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: StoreDefinition;
    /**
     * The total amount of resources the storage can contain.
     * @deprecated An alias for .store.getCapacity().
     */
    storeCapacity: number;
    /**
     * Sends resource to a Terminal in another room with the specified name.
     * @param resourceType One of the {@link ResourceConstant RESOURCE_*} constants.
     * @param amount The amount of resources to be sent.
     * @param destination The name of the target room. You don't have to gain visibility in this room.
     * @param description The description of the transaction. It is visible to the recipient. The maximum length is 100 characters.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_RESOURCES: The structure does not have the required amount of resources.
     * - ERR_INVALID_ARGS: The arguments provided are incorrect.
     * - ERR_TIRED: The terminal is still cooling down.
     */
    send(resourceType: ResourceConstant, amount: number, destination: string, description?: string): ScreepsReturnCode;
}

interface StructureTerminalConstructor extends _Constructor<StructureTerminal>, _ConstructorById<StructureTerminal> {}

declare const StructureTerminal: StructureTerminalConstructor;

/**
 * A small resource store.
 *
 * Contains up to 2,000 resource units. Can be constructed in neutral rooms. Decays for 5,000 hits per 100 ticks.
 */
interface StructureContainer extends Structure<STRUCTURE_CONTAINER> {
    readonly prototype: StructureContainer;
    /**
     * An object with the structure contents.
     *
     * Each object key is one of the {@link ResourceConstant RESOURCE_*} constants, values are resources
     * amounts. Use `_.sum(structure.store)` to get the total amount of contents.
     */
    store: StoreDefinition;
    /**
     * The total amount of resources the structure can contain.
     * @deprecated An alias for .store.getCapacity().
     */
    storeCapacity: number;
    /**
     * The amount of game ticks when this container will lose some hit points.
     */
    ticksToDecay: number;
}

interface StructureContainerConstructor extends _Constructor<StructureContainer>, _ConstructorById<StructureContainer> {}

declare const StructureContainer: StructureContainerConstructor;

/**
 * Launches a nuke to another room dealing huge damage to the landing area.
 *
 * Each launch has a cooldown and requires energy and ghodium resources. Launching
 * creates a Nuke object at the target room position which is visible to any player
 * until it is landed. Incoming nuke cannot be moved or cancelled. Nukes cannot
 * be launched from or to novice rooms.
 */
interface StructureNuker extends OwnedStructure<STRUCTURE_NUKER> {
    readonly prototype: StructureNuker;
    /**
     * The amount of energy contained in this structure.
     * @deprecated An alias for .store[RESOURCE_ENERGY].
     */
    energy: number;
    /**
     * The total amount of energy this structure can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_ENERGY).
     */
    energyCapacity: number;
    /**
     * The amount of energy contained in this structure.
     * @deprecated An alias for .store[RESOURCE_GHODIUM].
     */
    ghodium: number;
    /**
     * The total amount of energy this structure can contain.
     * @deprecated An alias for .store.getCapacity(RESOURCE_GHODIUM).
     */
    ghodiumCapacity: number;
    /**
     * The amount of game ticks the link has to wait until the next transfer is possible.
     */
    cooldown: number;
    /**
     * A Store object that contains cargo of this structure.
     */
    store: Store<RESOURCE_ENERGY | RESOURCE_GHODIUM, false>;
    /**
     * Launch a nuke to the specified position.
     * @param pos The target room position.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_NOT_ENOUGH_RESOURCES: The structure does not have enough energy and/or ghodium.
     * - ERR_INVALID_TARGET: The nuke can't be launched to the specified RoomPosition (see Start Areas).
     * - ERR_NOT_IN_RANGE: The target room is out of range.
     * - ERR_INVALID_ARGS: The target is not a valid RoomPosition.
     * - ERR_TIRED: This structure is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Room Controller Level insufficient to use this structure.
     */
    launchNuke(pos: RoomPosition): ScreepsReturnCode;
}

interface StructureNukerConstructor extends _Constructor<StructureNuker>, _ConstructorById<StructureNuker> {}

declare const StructureNuker: StructureNukerConstructor;

/**
 * A non-player structure.
 *
 * Instantly teleports your creeps to a distant room acting as a room exit tile.
 * Portals appear randomly in the central room of each sector.
 */
interface StructurePortal extends Structure<STRUCTURE_PORTAL> {
    readonly prototype: StructurePortal;
    /**
     * The portal's destination.
     *
     * If this is an inter-room portal, then this property contains a {@link RoomPosition} object leading to the point in the destination room.
     * If this is an inter-shard portal, then this property contains an object with shard and room string properties.
     * Exact coordinates are undetermined, the creep will appear at any free spot in the destination room.
     */
    destination: RoomPosition | { shard: string; room: string };
    /**
     * The amount of game ticks when the portal disappears, or undefined when the portal is stable.
     */
    ticksToDecay: number | undefined;
}

interface StructurePortalConstructor extends _Constructor<StructurePortal>, _ConstructorById<StructurePortal> {}

declare const StructurePortal: StructurePortalConstructor;

/**
 * A structure which produces trade commodities from base minerals and other commodities.
 */
interface StructureFactory extends OwnedStructure<STRUCTURE_FACTORY> {
    readonly prototype: StructureFactory;
    /**
     * The amount of game ticks the factory has to wait until the next produce is possible.
     */
    cooldown: number;
    /**
     * The level of the factory.
     *
     * Can be set by applying the {@link PWR_OPERATE_FACTORY} power to a newly built factory.
     * Once set, the level cannot be changed.
     */
    level?: number;
    /**
     * An object with the structure contents.
     */
    store: StoreDefinition;
    /**
     * Produces the specified commodity.
     *
     * All ingredients should be available in the factory store.
     * @param resource One of the {@link CommoditiesTypes producible RESOURCE_*} constants.
     * @returns One of the following codes:
     * - OK: The operation has been scheduled successfully.
     * - ERR_NOT_OWNER: You are not the owner of this structure.
     * - ERR_BUSY: The factory is not operated by the PWR_OPERATE_FACTORY power.
     * - ERR_NOT_ENOUGH_RESOURCES: The structure does not have the required amount of resources.
     * - ERR_INVALID_TARGET: The factory cannot produce the commodity of this level.
     * - ERR_FULL: The factory cannot contain the produce.
     * - ERR_INVALID_ARGS: The arguments provided are incorrect.
     * - ERR_TIRED: The factory is still cooling down.
     * - ERR_RCL_NOT_ENOUGH: Your Room Controller level is insufficient to use the factory.
     */
    produce(resource: CommoditiesTypes): ScreepsReturnCode;
}

interface StructureFactoryConstructor extends _Constructor<StructureFactory>, _ConstructorById<StructureFactory> {}

declare const StructureFactory: StructureFactoryConstructor;

/**
 * A structure which is a control center of NPC Strongholds, and also rules all invaders in the sector.
 */
interface StructureInvaderCore extends OwnedStructure<STRUCTURE_INVADER_CORE> {
    readonly prototype: StructureInvaderCore;
    /**
     * The level of the stronghold.
     *
     * The amount and quality of the loot depends on the level.
     */
    level: number;
    /**
     * Shows the timer for a not yet deployed stronghold, undefined otherwise.
     */
    ticksToDeploy: number;
    /**
     * If the core is in process of spawning a new creep, this object will contain a {@link StructureSpawn.Spawning} object, or `null` otherwise.
     */
    spawning: Spawning | null;
}

interface StructureInvaderCoreConstructor extends _Constructor<StructureInvaderCore>, _ConstructorById<StructureInvaderCore> {}

declare const StructureInvaderCore: StructureInvaderCoreConstructor;

/**
 * A discriminated union on Structure.type of all owned structure types
 */
type AnyOwnedStructure =
    | StructureController
    | StructureExtension
    | StructureExtractor
    | StructureFactory
    | StructureInvaderCore
    | StructureKeeperLair
    | StructureLab
    | StructureLink
    | StructureNuker
    | StructureObserver
    | StructurePowerBank
    | StructurePowerSpawn
    | StructureRampart
    | StructureSpawn
    | StructureStorage
    | StructureTerminal
    | StructureTower;

type AnyStoreStructure =
    | StructureExtension
    | StructureFactory
    | StructureLab
    | StructureLink
    | StructureNuker
    | StructurePowerSpawn
    | StructureSpawn
    | StructureStorage
    | StructureTerminal
    | StructureTower
    | StructureContainer;

/**
 * A discriminated union on {@link Structure.structureType} of all structure types
 */
type AnyStructure = AnyOwnedStructure | StructureContainer | StructurePortal | StructureRoad | StructureWall;

/**
 * Map of structure constant to the concrete structure class
 */
interface ConcreteStructureMap {
    [STRUCTURE_EXTENSION]: StructureExtension;
    [STRUCTURE_RAMPART]: StructureRampart;
    [STRUCTURE_ROAD]: StructureRoad;
    [STRUCTURE_SPAWN]: StructureSpawn;
    [STRUCTURE_LINK]: StructureLink;
    [STRUCTURE_WALL]: StructureWall;
    [STRUCTURE_STORAGE]: StructureStorage;
    [STRUCTURE_TOWER]: StructureTower;
    [STRUCTURE_OBSERVER]: StructureObserver;
    [STRUCTURE_POWER_SPAWN]: StructurePowerSpawn;
    [STRUCTURE_EXTRACTOR]: StructureExtractor;
    [STRUCTURE_LAB]: StructureLab;
    [STRUCTURE_TERMINAL]: StructureTerminal;
    [STRUCTURE_CONTAINER]: StructureContainer;
    [STRUCTURE_NUKER]: StructureNuker;
    [STRUCTURE_FACTORY]: StructureFactory;
    [STRUCTURE_KEEPER_LAIR]: StructureKeeperLair;
    [STRUCTURE_CONTROLLER]: StructureController;
    [STRUCTURE_POWER_BANK]: StructurePowerBank;
    [STRUCTURE_PORTAL]: StructurePortal;
    [STRUCTURE_INVADER_CORE]: StructureInvaderCore;
}

/**
 * Conditional type for all concrete implementations of Structure.
 *
 * Unlike {@link Structure<T>}, {@link ConcreteStructure<T>} gives you the actual concrete class that extends {@link Structure<T>}.
 */
type ConcreteStructure<T extends StructureConstant> = ConcreteStructureMap[T];
