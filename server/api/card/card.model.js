'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var effects = ['Battlecry', 'Divine shield', 'Deathrattle', 'Charge', 'Windfury', 'Stealth', 'Magic Immune', 'Combo', 'Taunt',
    'Spell Damage', 'Secret', 'Inspire', 'Mega-WindFury', 'Overload'];
var types = ['Creature', 'Spell', 'Weaporn', 'Hero'];
var creatureTypes = ['Beast', 'Dragon', 'Pirate', 'Creature', 'Summon', 'Mech'];
var rarities = ['Default', 'Common', 'Rare', 'Epic', 'Legendary'];
var playerClasses = ['Common', 'Mage', 'Hunter', 'Warrior', 'Warlock', 'Druid', 'Rogue', 'Shaman', 'Paladin', 'Priest'];
var languages = ['en', 'ru'];

var CardSchema = new Schema({
    cardId: String,
    name: String,
    cardSet: String,
    faction: String,
    locale: String,
    rarity: { type: String, enum: rarities },
    cost: Number,
    attack: Number,
    health: Number,
    text: String,
    inPlayText: String,
    flavor: String,
    artist: String,
    collectible: Boolean,
    race: String,
    playerClass: { type: String, enum: playerClasses },
    img: String,
    imgGold: String,
    info: String,
    mechanics: [{ name: String }]
});

module.exports = mongoose.model('Card', CardSchema);
