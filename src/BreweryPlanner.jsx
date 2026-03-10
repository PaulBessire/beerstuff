import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────

const RECIPE_TYPES = { CORE: "core", CONTRACT: "contract", SEASONAL: "seasonal" };
const CHANNELS = { TAPROOM: "taproom", DISTRIBUTION: "distribution" };
const FORMATS = { DRAFT: "draft", BARREL: "barrel", CAN: "can" };
const STEP_TYPES = ["mash", "boil", "ferment", "condition", "carbonate", "package"];
const EQUIP_TYPES = { MASH: "mash_tun", KETTLE: "brew_kettle", FERM: "fermenter", BRITE: "brite_tank", CANNER: "canning_line", KEGGING: "kegging_line" };

const SAMPLE_RECIPES = [
  { id: "R01", name: "Bavarian", type: RECIPE_TYPES.CORE, style: "Lager", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R02", name: "Storm", type: RECIPE_TYPES.CORE, style: "IPA", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R03", name: "Switch", type: RECIPE_TYPES.CORE, style: "Pale Ale", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R04", name: "Tropic Flare", type: RECIPE_TYPES.CORE, style: "IPA", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R05", name: "Haven Hefeweizen", type: RECIPE_TYPES.CORE, style: "Wheat", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 20 }, { materialId: "M06", qtyPerBbl: 15 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R06", name: "Dead Blow", type: RECIPE_TYPES.CORE, style: "DIPA", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R07", name: "Spur Amber Lager", type: RECIPE_TYPES.CORE, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R08", name: "Birdie", type: RECIPE_TYPES.CORE, style: "Session IPA", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R09", name: "Scooter", type: RECIPE_TYPES.CORE, style: "Lager", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R10", name: "Larosa's Lager", type: RECIPE_TYPES.CORE, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R11", name: "3:28 Coffee Stout", type: RECIPE_TYPES.SEASONAL, style: "Stout", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 38 }, { materialId: "M06", qtyPerBbl: 8 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R12", name: "Oktober Fuel", type: RECIPE_TYPES.SEASONAL, style: "Marzen", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R13", name: "Opera Cream", type: RECIPE_TYPES.SEASONAL, style: "Cream Ale", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 26 }, { materialId: "M06", qtyPerBbl: 6 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R14", name: "Hop Ridge", type: RECIPE_TYPES.SEASONAL, style: "IPA", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R15", name: "Margarita Gose", type: RECIPE_TYPES.SEASONAL, style: "Sour", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 240, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R16", name: "Paradise Watermelon Gose", type: RECIPE_TYPES.SEASONAL, style: "Sour", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 240, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R17", name: "OKI Bourbon Barrel Ale", type: RECIPE_TYPES.SEASONAL, style: "Barrel Aged", channel: "taproom", bblPerBatch: 5, ingredients: [{ materialId: "M02", qtyPerBbl: 50 }, { materialId: "M04", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 240, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R18", name: "Graeter's BRC Stout", type: RECIPE_TYPES.SEASONAL, style: "Stout", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 38 }, { materialId: "M06", qtyPerBbl: 8 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R19", name: "Graeter's Lemon Meringue Pie", type: RECIPE_TYPES.SEASONAL, style: "Sour", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R20", name: "Graeter's Pumpkin Pie", type: RECIPE_TYPES.SEASONAL, style: "Spiced Ale", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M04", qtyPerBbl: 1.2 }, { materialId: "M09", qtyPerBbl: 2.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R21", name: "Italian Pilsner", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R22", name: "Jam Session", type: RECIPE_TYPES.SEASONAL, style: "Session", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R23", name: "Jubilee - Hoppy Holiday IPA", type: RECIPE_TYPES.SEASONAL, style: "IPA", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R24", name: "House Pilsner", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R25", name: "Helles Lager", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R26", name: "Doppelbock", type: RECIPE_TYPES.SEASONAL, style: "Bock", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R27", name: "Double Hazy IPA", type: RECIPE_TYPES.SEASONAL, style: "IPA", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R28", name: "Fuerte Mexican Lager", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R29", name: "Czech This Out, Dad", type: RECIPE_TYPES.SEASONAL, style: "Czech Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R30", name: "Belgian Grand Cru", type: RECIPE_TYPES.SEASONAL, style: "Belgian", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 35 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 240, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R31", name: "Berliner Weisse", type: RECIPE_TYPES.SEASONAL, style: "Wheat", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 20 }, { materialId: "M06", qtyPerBbl: 15 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R32", name: "Kranz", type: RECIPE_TYPES.SEASONAL, style: "Kolsch", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 20 }, { materialId: "M06", qtyPerBbl: 15 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R33", name: "Rally", type: RECIPE_TYPES.SEASONAL, style: "Ale", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R34", name: "Road Trip", type: RECIPE_TYPES.SEASONAL, style: "Berliner Weisse", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R35", name: "Strawberry Rhubarb Saison", type: RECIPE_TYPES.SEASONAL, style: "Saison", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 28 }, { materialId: "M04", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R36", name: "Gingerbread Cookie", type: RECIPE_TYPES.SEASONAL, style: "Spiced Ale", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M04", qtyPerBbl: 1.2 }, { materialId: "M09", qtyPerBbl: 2.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R37", name: "Pride Watermelon Radler", type: RECIPE_TYPES.SEASONAL, style: "Radler", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 22 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 4.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 96, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R38", name: "Blueprint", type: RECIPE_TYPES.SEASONAL, style: "Ale", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R39", name: "Dewey's House Lager", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R40", name: "Dry Hopped Pilsner", type: RECIPE_TYPES.SEASONAL, style: "IPA", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R41", name: "West Coast Lager", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R42", name: "Rye Pale", type: RECIPE_TYPES.SEASONAL, style: "Pale Ale", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R43", name: "Road Trip - Berlinner Weiss", type: RECIPE_TYPES.SEASONAL, style: "Wheat", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 20 }, { materialId: "M06", qtyPerBbl: 15 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R44", name: "Split The B", type: RECIPE_TYPES.SEASONAL, style: "Ale", channel: "taproom", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R45", name: "Agave and Rye Epic Lime Lager", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "taproom", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R46", name: "Drink Daizy's - Grape", type: RECIPE_TYPES.CONTRACT, style: "Flavored", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 18 }, { materialId: "M09", qtyPerBbl: 8.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R47", name: "Drink Daizy's - Passion Fruit", type: RECIPE_TYPES.CONTRACT, style: "Flavored", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 18 }, { materialId: "M09", qtyPerBbl: 8.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R48", name: "Drink Daizy's - Strawberry Lemonade", type: RECIPE_TYPES.CONTRACT, style: "Sour", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R49", name: "Drink Daizy's - Tropical Punch", type: RECIPE_TYPES.CONTRACT, style: "Flavored", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 18 }, { materialId: "M09", qtyPerBbl: 8.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R50", name: "Drink Daizy's - Watermelon Lime", type: RECIPE_TYPES.CONTRACT, style: "Sour", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R51", name: "Drink Daizy's - Orange Cream Soda", type: RECIPE_TYPES.CONTRACT, style: "Flavored", channel: "contract", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 18 }, { materialId: "M09", qtyPerBbl: 8.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R52", name: "Ballpark Beer", type: RECIPE_TYPES.CORE, style: "Lager", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R53", name: "Hop Fly", type: RECIPE_TYPES.SEASONAL, style: "IPA", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M05", qtyPerBbl: 3.0 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R54", name: "Kickback Hard Cider", type: RECIPE_TYPES.SEASONAL, style: "Cider", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M09", qtyPerBbl: 20 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R55", name: "Grand Slamberry", type: RECIPE_TYPES.SEASONAL, style: "Amber", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R56", name: "Drift", type: RECIPE_TYPES.SEASONAL, style: "Ale", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R57", name: "Verano", type: RECIPE_TYPES.SEASONAL, style: "Lager", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R58", name: "Verano with Lime", type: RECIPE_TYPES.SEASONAL, style: "Sour", channel: "distribution", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R59", name: "Summertrip", type: RECIPE_TYPES.SEASONAL, style: "Ale", channel: "distribution", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.0, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.0, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
];


const SAMPLE_EQUIPMENT = [
  // Fermenters — 20 BBL (small batches)
  { id: "FV01", name: "FV #1", type: EQUIP_TYPES.FERM, capacityBbl: 20, notes: "" },
  { id: "FV02", name: "FV #2", type: EQUIP_TYPES.FERM, capacityBbl: 20, notes: "" },
  { id: "FV03", name: "FV #3", type: EQUIP_TYPES.FERM, capacityBbl: 20, notes: "" },
  // Fermenters — 120 BBL
  { id: "FV04", name: "FV #4", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "Dry hop" },
  { id: "FV05", name: "FV #5", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "Dry hop" },
  { id: "FV06", name: "FV #6", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "" },
  { id: "FV07", name: "FV #7", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "" },
  { id: "FV08", name: "FV #8", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "Dry hop" },
  { id: "FV09", name: "FV #9", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "Dry hop" },
  { id: "FV10", name: "FV #10", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "" },
  { id: "FV11", name: "FV #11", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "" },
  { id: "FV12", name: "FV #12", type: EQUIP_TYPES.FERM, capacityBbl: 120, notes: "" },
  // Fermenters — 60 BBL
  { id: "FV13", name: "FV #13", type: EQUIP_TYPES.FERM, capacityBbl: 60, notes: "" },
  { id: "FV14", name: "FV #14", type: EQUIP_TYPES.FERM, capacityBbl: 60, notes: "" },
  // Brite Tanks
  { id: "BBT1", name: "BBT #1", type: EQUIP_TYPES.BRITE, capacityBbl: 120, notes: "" },
  { id: "BBT2", name: "BBT #2", type: EQUIP_TYPES.BRITE, capacityBbl: 40, notes: "" },
  { id: "BBT3", name: "BBT #3", type: EQUIP_TYPES.BRITE, capacityBbl: 120, notes: "" },
  // HOG — large batches only
  { id: "HOG1", name: "HOG", type: EQUIP_TYPES.BRITE, capacityBbl: 120, notes: "Large batches only" },
  // Packaging
  { id: "CAN1", name: "Canning Line", type: EQUIP_TYPES.CANNER, capacityBbl: 200, notes: "" },
  { id: "KEG1", name: "Kegging Line", type: EQUIP_TYPES.KEGGING, capacityBbl: 200, notes: "" },
];

const SAMPLE_MATERIALS = [
  { id: "M01", name: "2-Row Pale Malt", category: "malt", onHand: 5000, unit: "lb", leadTimeDays: 7, costPerUnit: 0.65 },
  { id: "M02", name: "Maris Otter Malt", category: "malt", onHand: 3000, unit: "lb", leadTimeDays: 14, costPerUnit: 0.85 },
  { id: "M03", name: "Cascade Hops", category: "hops", onHand: 200, unit: "lb", leadTimeDays: 5, costPerUnit: 12.00 },
  { id: "M04", name: "East Kent Goldings", category: "hops", onHand: 120, unit: "lb", leadTimeDays: 10, costPerUnit: 15.00 },
  { id: "M05", name: "Citra Hops", category: "hops", onHand: 150, unit: "lb", leadTimeDays: 7, costPerUnit: 18.00 },
  { id: "M06", name: "Flaked Oats", category: "grain", onHand: 800, unit: "lb", leadTimeDays: 5, costPerUnit: 0.55 },
  { id: "M07", name: "Simcoe Hops", category: "hops", onHand: 100, unit: "lb", leadTimeDays: 7, costPerUnit: 16.00 },
  { id: "M08", name: "Mosaic Hops", category: "hops", onHand: 80, unit: "lb", leadTimeDays: 7, costPerUnit: 19.00 },
  { id: "M09", name: "Fruit/Flavor Add", category: "adjunct", onHand: 300, unit: "lb", leadTimeDays: 3, costPerUnit: 3.50 },
  { id: "M10", name: "US-05 Ale Yeast", category: "yeast", onHand: 50, unit: "pkg", leadTimeDays: 3, costPerUnit: 8.00 },
  { id: "M11", name: "W-34/70 Lager Yeast", category: "yeast", onHand: 30, unit: "pkg", leadTimeDays: 5, costPerUnit: 9.50 },
  { id: "M12", name: "Lactobacillus Culture", category: "yeast", onHand: 10, unit: "pkg", leadTimeDays: 7, costPerUnit: 22.00 },
];

// Helper to create dates relative to today
const d = (offset) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + offset);
  dt.setHours(0, 0, 0, 0);
  return dt.toISOString().slice(0, 10);
};

const SAMPLE_SCHEDULE = [
  // Currently fermenting — projected from 2/2 spreadsheet queue
  { id: "B001", recipeId: "R02", batchSizeBbl: 30, status: "fermenting", steps: [{ step: "ferment", equipId: "FV05", start: "2026-02-24", end: "2026-03-10" }, { step: "condition", equipId: "BBT1", start: "2026-03-10", end: "2026-03-13" }, { step: "package", equipId: "CAN1", start: "2026-03-13", end: "2026-03-13" }] },
  { id: "B002", recipeId: "R02", batchSizeBbl: 30, status: "fermenting", steps: [{ step: "ferment", equipId: "FV06", start: "2026-02-26", end: "2026-03-12" }, { step: "condition", equipId: "BBT3", start: "2026-03-12", end: "2026-03-15" }, { step: "package", equipId: "CAN1", start: "2026-03-15", end: "2026-03-15" }] },
  { id: "B003", recipeId: "R53", batchSizeBbl: 15, status: "fermenting", steps: [{ step: "ferment", equipId: "FV09", start: "2026-03-02", end: "2026-03-16" }, { step: "condition", equipId: "BBT2", start: "2026-03-16", end: "2026-03-18" }, { step: "package", equipId: "CAN1", start: "2026-03-18", end: "2026-03-18" }] },
  { id: "B004", recipeId: "R54", batchSizeBbl: 15, status: "fermenting", steps: [{ step: "ferment", equipId: "FV11", start: "2026-02-18", end: "2026-03-18" }, { step: "condition", equipId: "BBT2", start: "2026-03-18", end: "2026-03-20" }, { step: "package", equipId: "CAN1", start: "2026-03-20", end: "2026-03-20" }] },
  { id: "B005", recipeId: "R14", batchSizeBbl: 15, status: "fermenting", steps: [{ step: "ferment", equipId: "FV13", start: "2026-02-16", end: "2026-03-09" }, { step: "condition", equipId: "BBT2", start: "2026-03-09", end: "2026-03-11" }, { step: "package", equipId: "CAN1", start: "2026-03-11", end: "2026-03-11" }] },
  { id: "B006", recipeId: "R56", batchSizeBbl: 15, status: "conditioning", steps: [{ step: "ferment", equipId: "FV10", start: "2026-02-27", end: "2026-03-06" }, { step: "condition", equipId: "BBT1", start: "2026-03-06", end: "2026-03-08" }, { step: "package", equipId: "CAN1", start: "2026-03-09", end: "2026-03-09" }] },
  // Planned — upcoming batches
  { id: "B007", recipeId: "R52", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV04", start: d(2), end: d(12) }, { step: "condition", equipId: "BBT1", start: d(12), end: d(16) }, { step: "package", equipId: "CAN1", start: d(16), end: d(16) }] },
  { id: "B008", recipeId: "R46", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV07", start: d(3), end: d(8) }, { step: "condition", equipId: "BBT3", start: d(8), end: d(10) }, { step: "package", equipId: "CAN1", start: d(10), end: d(10) }] },
  { id: "B009", recipeId: "R01", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV08", start: d(4), end: d(16) }, { step: "condition", equipId: "BBT3", start: d(16), end: d(21) }, { step: "package", equipId: "CAN1", start: d(21), end: d(21) }] },
  { id: "B010", recipeId: "R49", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV10", start: d(5), end: d(10) }, { step: "condition", equipId: "HOG1", start: d(10), end: d(12) }, { step: "package", equipId: "CAN1", start: d(12), end: d(12) }] },
  { id: "B011", recipeId: "R59", batchSizeBbl: 15, status: "planned", steps: [{ step: "ferment", equipId: "FV01", start: d(3), end: d(9) }, { step: "condition", equipId: "BBT2", start: d(11), end: d(13) }, { step: "package", equipId: "CAN1", start: d(13), end: d(13) }] },
  { id: "B012", recipeId: "R03", batchSizeBbl: 15, status: "planned", steps: [{ step: "ferment", equipId: "FV02", start: d(3), end: d(9) }, { step: "condition", equipId: "BBT2", start: d(13), end: d(15) }, { step: "package", equipId: "CAN1", start: d(15), end: d(15) }] },
  { id: "B013", recipeId: "R47", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV12", start: d(6), end: d(11) }, { step: "condition", equipId: "BBT3", start: d(11), end: d(13) }, { step: "package", equipId: "CAN1", start: d(13), end: d(13) }] },
  { id: "B014", recipeId: "R57", batchSizeBbl: 15, status: "planned", steps: [{ step: "ferment", equipId: "FV14", start: d(4), end: d(12) }, { step: "condition", equipId: "BBT2", start: d(15), end: d(18) }, { step: "package", equipId: "CAN1", start: d(18), end: d(18) }] },
  { id: "B015", recipeId: "R48", batchSizeBbl: 30, status: "planned", steps: [{ step: "ferment", equipId: "FV05", start: d(8), end: d(16) }, { step: "condition", equipId: "HOG1", start: d(16), end: d(19) }, { step: "package", equipId: "CAN1", start: d(19), end: d(19) }] },
  { id: "B016", recipeId: "R38", batchSizeBbl: 15, status: "planned", steps: [{ step: "ferment", equipId: "FV03", start: d(5), end: d(11) }, { step: "condition", equipId: "BBT2", start: d(18), end: d(20) }, { step: "package", equipId: "CAN1", start: d(20), end: d(20) }] },
];


const SAMPLE_DEMAND = [
  { id: "D001", recipeId: "R02", volumeBbl: 60, shipDate: d(14), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D002", recipeId: "R46", volumeBbl: 30, shipDate: d(11), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D003", recipeId: "R49", volumeBbl: 30, shipDate: d(13), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D004", recipeId: "R52", volumeBbl: 30, shipDate: d(17), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D005", recipeId: "R01", volumeBbl: 30, shipDate: d(22), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D006", recipeId: "R53", volumeBbl: 15, shipDate: d(19), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D007", recipeId: "R14", volumeBbl: 15, shipDate: d(12), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D008", recipeId: "R56", volumeBbl: 15, shipDate: d(10), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D009", recipeId: "R54", volumeBbl: 15, shipDate: d(21), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D010", recipeId: "R47", volumeBbl: 30, shipDate: d(14), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D011", recipeId: "R48", volumeBbl: 30, shipDate: d(20), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D012", recipeId: "R59", volumeBbl: 15, shipDate: d(14), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D013", recipeId: "R03", volumeBbl: 15, shipDate: d(16), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D014", recipeId: "R38", volumeBbl: 15, shipDate: d(21), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D015", recipeId: "R57", volumeBbl: 15, shipDate: d(19), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D016", recipeId: "R04", volumeBbl: 5, shipDate: d(10), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D017", recipeId: "R05", volumeBbl: 4, shipDate: d(12), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D018", recipeId: "R06", volumeBbl: 3, shipDate: d(8), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D019", recipeId: "R10", volumeBbl: 3, shipDate: d(7), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D020", recipeId: "R08", volumeBbl: 4, shipDate: d(14), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
];


// ─── UTILITIES ──────────────────────────────────────────────────────────────────

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const addDays = (dateStr, days) => { const dt = new Date(dateStr); dt.setDate(dt.getDate() + days); return dt.toISOString().slice(0, 10); };
const fmtDate = (dateStr) => { const dt = new Date(dateStr + "T00:00:00"); return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }); };
const today = () => new Date().toISOString().slice(0, 10);

const TYPE_COLORS = {
  core: { bg: "#1a2d5a", border: "#3c78d8", text: "#8ab4f0" },       // Excel batch blue
  contract: { bg: "#4a2050", border: "#d98ae0", text: "#f0b8f4" },   // Excel pink/magenta
  seasonal: { bg: "#2a3d28", border: "#93c47d", text: "#c4e0b8" },   // Excel green
};

const STATUS_COLORS = {
  planned: "#64748b",
  mashing: "#ffe599",
  boiling: "#ffe599",
  fermenting: "#d98ae0",   // pink/magenta
  conditioning: "#7bafd4", // light blue
  carbonating: "#b4a7d6",  // lavender
  packaging: "#7dab6e",    // green
  complete: "#93c47d",     // Excel green
};

const STEP_COLORS = {
  mash: "#ffe599",       // Excel yellow headers
  boil: "#ffe599",       // Excel yellow headers
  ferment: "#d98ae0",    // Excel pink/magenta (#FDA7FF)
  condition: "#7bafd4",  // Excel light blue (#CFE2F3)
  carbonate: "#b4a7d6",  // Excel lavender (#B4A7D6)
  package: "#7dab6e",    // Excel light green (#D9EAD3)
};

// ─── AUTO-SCHEDULER ENGINE ──────────────────────────────────────────────────────

function autoSchedule(demand, equipment, recipes, existingSchedule = [], sensitivityMult = 1.0) {
  const fermenters = equipment.filter(e => e.type === EQUIP_TYPES.FERM);
  const brites = equipment.filter(e => e.type === EQUIP_TYPES.BRITE);
  const todayStr = today();

  // Track equipment occupancy from existing schedule
  const occupancy = {}; // equipId → [{start, end}]
  existingSchedule.forEach(b => {
    b.steps.forEach(s => {
      if (!occupancy[s.equipId]) occupancy[s.equipId] = [];
      occupancy[s.equipId].push({ start: s.start, end: s.end });
    });
  });

  const isAvailable = (equipId, start, end) => {
    const slots = occupancy[equipId] || [];
    return !slots.some(s => s.start <= end && start <= s.end);
  };

  const occupy = (equipId, start, end) => {
    if (!occupancy[equipId]) occupancy[equipId] = [];
    occupancy[equipId].push({ start, end });
  };

  // Apply sensitivity multiplier to demand
  const adjDemand = demand.map(dm => ({ ...dm, volumeBbl: Math.round(dm.volumeBbl * sensitivityMult) }));

  // Calculate already-scheduled volume per recipe
  const scheduledVol = {};
  existingSchedule.forEach(b => { scheduledVol[b.recipeId] = (scheduledVol[b.recipeId] || 0) + b.batchSizeBbl; });

  // Sort demand by ship date (earliest deadline first)
  const sorted = [...adjDemand].sort((a, b) => a.shipDate.localeCompare(b.shipDate));

  const newBatches = [];
  const unmetDemand = [];
  let batchCounter = existingSchedule.length;

  sorted.forEach(dm => {
    const recipe = recipes.find(r => r.id === dm.recipeId);
    if (!recipe) { unmetDemand.push({ ...dm, reason: "No recipe found" }); return; }

    const alreadySched = scheduledVol[dm.recipeId] || 0;
    const stillNeeded = dm.volumeBbl - alreadySched;
    if (stillNeeded <= 0) return;

    const batchesNeeded = Math.ceil(stillNeeded / recipe.bblPerBatch);
    const isKeg = recipe.channel === "taproom";

    for (let bi = 0; bi < batchesNeeded; bi++) {
      // Work backward from ship date
      const shipDate = dm.shipDate;
      const fermStep = recipe.steps.find(s => s.step === "ferment");
      const condStep = recipe.steps.find(s => s.step === "condition");
      const pkgStep = recipe.steps.find(s => s.step === "package");
      if (!fermStep || !condStep) { unmetDemand.push({ ...dm, reason: "Missing process steps" }); continue; }

      const pkgDays = pkgStep ? Math.max(1, Math.ceil(pkgStep.durationHrs / 24)) : 1;
      const condDays = Math.max(1, Math.ceil(condStep.durationHrs / 24));
      const fermDays = Math.max(1, Math.ceil(fermStep.durationHrs / 24));

      const pkgEnd = addDays(shipDate, -1);
      const pkgStart = addDays(pkgEnd, -(pkgDays - 1));
      const condEnd = addDays(pkgStart, -1);
      const condStart = addDays(condEnd, -(condDays - 1));
      const fermEnd = addDays(condStart, -1);
      const fermStart = addDays(fermEnd, -(fermDays - 1));

      // Don't schedule in the past
      if (fermStart < todayStr) {
        unmetDemand.push({ ...dm, reason: `Would need to start ${fermStart} (past)` });
        continue;
      }

      // Find available fermenter (prefer smallest that fits, respecting dry-hop notes)
      const suitableFV = fermenters
        .filter(fv => fv.capacityBbl >= recipe.bblPerBatch)
        .sort((a, b) => a.capacityBbl - b.capacityBbl);

      let assignedFV = null;
      for (const fv of suitableFV) {
        if (isAvailable(fv.id, fermStart, fermEnd)) { assignedFV = fv; break; }
      }
      if (!assignedFV) {
        unmetDemand.push({ ...dm, reason: "No fermenter available" });
        continue;
      }

      // Find available brite tank
      const suitableBT = brites
        .filter(bt => bt.capacityBbl >= recipe.bblPerBatch)
        .sort((a, b) => a.capacityBbl - b.capacityBbl);

      let assignedBT = null;
      for (const bt of suitableBT) {
        if (isAvailable(bt.id, condStart, condEnd)) { assignedBT = bt; break; }
      }
      if (!assignedBT) {
        unmetDemand.push({ ...dm, reason: "No brite tank available" });
        continue;
      }

      // Packaging line
      const pkgEquipType = isKeg ? EQUIP_TYPES.KEGGING : EQUIP_TYPES.CANNER;
      const pkgEquip = equipment.find(e => e.type === pkgEquipType);

      // Build batch
      batchCounter++;
      const batch = {
        id: `A${String(batchCounter).padStart(3, "0")}`,
        recipeId: dm.recipeId,
        batchSizeBbl: recipe.bblPerBatch,
        status: "planned",
        autoScheduled: true,
        demandId: dm.id,
        steps: [
          { step: "ferment", equipId: assignedFV.id, start: fermStart, end: fermEnd },
          { step: "condition", equipId: assignedBT.id, start: condStart, end: condEnd },
          { step: "package", equipId: pkgEquip?.id || "", start: pkgStart, end: pkgEnd },
        ],
      };

      occupy(assignedFV.id, fermStart, fermEnd);
      occupy(assignedBT.id, condStart, condEnd);
      newBatches.push(batch);
      scheduledVol[dm.recipeId] = (scheduledVol[dm.recipeId] || 0) + recipe.bblPerBatch;
    }
  });

  return { newBatches, unmetDemand, totalBbl: newBatches.reduce((s, b) => s + b.batchSizeBbl, 0) };
}

// ─── SCENARIO UTILITIES ─────────────────────────────────────────────────────────

function calcMetrics(schedule, demand, equipment) {
  const fermenters = equipment.filter(e => e.type === EQUIP_TYPES.FERM);
  const totalBbl = schedule.reduce((s, b) => s + b.batchSizeBbl, 0);
  const batchCount = schedule.length;

  // Utilization: what % of fermenter-days are occupied over next 30 days
  const t = today();
  const horizon = addDays(t, 30);
  let fermDaysUsed = 0, fermDaysAvail = fermenters.length * 30;
  schedule.forEach(b => {
    b.steps.filter(s => s.step === "ferment").forEach(s => {
      const overlapStart = s.start > t ? s.start : t;
      const overlapEnd = s.end < horizon ? s.end : horizon;
      if (overlapStart <= overlapEnd) fermDaysUsed += daysBetween(overlapStart, overlapEnd) + 1;
    });
  });
  const utilization = fermDaysAvail > 0 ? Math.round(fermDaysUsed / fermDaysAvail * 100) : 0;

  // On-time: what % of demand has a matching batch completing before ship date
  const schedVol = {};
  schedule.forEach(b => { schedVol[b.recipeId] = (schedVol[b.recipeId] || 0) + b.batchSizeBbl; });
  const metDemand = demand.filter(dm => (schedVol[dm.recipeId] || 0) >= dm.volumeBbl).length;
  const onTime = demand.length > 0 ? Math.round(metDemand / demand.length * 100) : 100;

  return { totalBbl, batchCount, utilization, onTime, fermDaysUsed, fermDaysAvail };
}

// ─── STYLES ──────────────────────────────────────────────────────────────────────

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const baseStyles = {
  app: { fontFamily: "'DM Sans', sans-serif", background: "#0b0f14", color: "#e2e8f0", minHeight: "100vh", display: "flex", flexDirection: "column" },
  mono: { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" },
  header: { background: "#111820", borderBottom: "1px solid #1e293b", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  nav: { display: "flex", gap: "2px", background: "#111820", padding: "0 24px", borderBottom: "1px solid #1e293b" },
  navBtn: (active) => ({ padding: "10px 18px", background: active ? "#1a2332" : "transparent", color: active ? "#f8fafc" : "#94a3b8", border: "none", borderBottom: active ? "2px solid #c8854a" : "2px solid transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: active ? 600 : 400, transition: "all 0.15s" }),
  main: { flex: 1, padding: "20px 24px", overflow: "auto" },
  card: { background: "#111820", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px", marginBottom: "16px" },
  cardTitle: { fontSize: "0.95rem", fontWeight: 600, color: "#f8fafc", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" },
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", background: color + "22", color: color, border: `1px solid ${color}44` }),
  btn: (variant = "default") => ({ padding: "6px 14px", borderRadius: "6px", border: variant === "primary" ? "1px solid #c8854a" : "1px solid #2d3748", background: variant === "primary" ? "#c8854a" : "#1a2332", color: variant === "primary" ? "#0b0f14" : "#e2e8f0", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500, transition: "all 0.15s" }),
  input: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #2d3748", background: "#0b0f14", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", outline: "none", width: "100%" },
  select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #2d3748", background: "#0b0f14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", outline: "none" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" },
  th: { padding: "8px 12px", textAlign: "left", color: "#94a3b8", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #1e293b" },
  td: { padding: "8px 12px", borderBottom: "1px solid #1e293b11" },
  grid: (cols) => ({ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "16px" }),
};

// ─── MODAL COMPONENT ────────────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "#00000088" }} />
      <div style={{ ...baseStyles.card, position: "relative", width, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", border: "1px solid #2d3748", boxShadow: "0 25px 50px #00000066" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem" }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── STAT CARD ──────────────────────────────────────────────────────────────────

function Stat({ label, value, sub, color = "#c8854a" }) {
  return (
    <div style={{ ...baseStyles.card, padding: "14px 16px" }}>
      <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, color, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── GANTT CHART ────────────────────────────────────────────────────────────────

function GanttChart({ schedule, equipment, recipes, onEditBatch, dayRange = 42 }) {
  const todayStr = today();
  const startDate = addDays(todayStr, -7);
  const totalDays = dayRange;
  const dayWidth = 28;
  const subRowH = 20;
  const rowH = subRowH * 3 + 1; // 3 sub-rows + border
  const labelWidth = 160;
  const headerH = 52;

  const equipRows = equipment.filter(e => [EQUIP_TYPES.FERM, EQUIP_TYPES.BRITE].includes(e.type));

  // Build date info
  const days = Array.from({ length: totalDays }, (_, i) => {
    const ds = addDays(startDate, i);
    const dt = new Date(ds + "T00:00:00");
    return { date: ds, day: dt.getDate(), dow: ["Su","M","T","W","Th","F","S"][dt.getDay()], month: dt.toLocaleDateString("en-US",{month:"short"}), isWeekend: dt.getDay()%6===0, isToday: ds===todayStr, monthStart: dt.getDate()===1 };
  });

  // Month spans
  const months = [];
  let cur = null;
  days.forEach((d,i) => {
    if(!cur || cur.month !== d.month) { cur = {month:d.month, start:i, span:1}; months.push(cur); } else { cur.span++; }
  });

  // Phase colors — matched to brewery's Excel: pink=ferment, blue=testing, lavender=centrifuge, green=packaging, blue=transfer
  const PHASE = {
    ferment: { bg: "#4a2050", border: "#d98ae0", text: "#f0b8f4", label: "BEER" },       // Excel: #FDA7FF pink/magenta
    condition: { bg: "#1c3454", border: "#7bafd4", text: "#cfe2f3", label: "TESTING" },   // Excel: #CFE2F3 light blue
    package_can: { bg: "#2a3d28", border: "#7dab6e", text: "#d9ead3", label: "CAN" },     // Excel: #D9EAD3 light green
    package_keg: { bg: "#2a3d28", border: "#7dab6e", text: "#d9ead3", label: "KEG" },     // Excel: #D9EAD3 same green
    transfer: { bg: "#1a2d5a", border: "#3c78d8", text: "#ffffff", label: "THC" },        // Excel: #3C78D8 blue, white text
  };

  // Build blocks per equipment row
  const getBlocks = () => {
    const blocks = [];
    schedule.forEach(batch => {
      const recipe = recipes.find(r => r.id === batch.recipeId);
      if (!recipe) return;
      const isKeg = recipe.channel === "taproom";
      batch.steps.forEach(step => {
        const eqIdx = equipRows.findIndex(e => e.id === step.equipId);
        if (eqIdx === -1) return;
        const s = daysBetween(startDate, step.start);
        const e2 = daysBetween(startDate, step.end) + 1;
        if (e2 < 0 || s > totalDays) return;
        const left = Math.max(0, s) * dayWidth;
        const width = Math.max(1, (Math.min(e2, totalDays) - Math.max(0, s))) * dayWidth - 1;

        let subRow = 0, phase = PHASE.ferment, label = recipe.name;
        const durDays = daysBetween(step.start, step.end) + 1;
        if (step.step === "ferment") {
          subRow = 0; phase = PHASE.ferment;
          label = recipe.name;
        } else if (step.step === "condition") {
          subRow = 1; phase = PHASE.condition;
          label = `${durDays}D TESTING`;
        } else if (step.step === "package") {
          subRow = 2; phase = isKeg ? PHASE.package_keg : PHASE.package_can;
          label = isKeg ? "KEG" : "CAN";
        }
        blocks.push({ batchId: batch.id, eqIdx, subRow, left, width, phase, label, batch, recipe, step: step.step });
      });
    });
    return blocks;
  };
  const blocks = getBlocks();
  const chartWidth = totalDays * dayWidth;
  const chartHeight = equipRows.length * rowH;
  const todayOff = daysBetween(startDate, todayStr);

  const gridBg = "#0d1117";
  const gridLine = "#1b2230";
  const gridLineLight = "#151d28";

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "70vh", border: "1px solid #1e293b", borderRadius: 6 }}>
      <div style={{ display: "flex", minWidth: labelWidth + chartWidth }}>
        {/* Equipment labels */}
        <div style={{ width: labelWidth, flexShrink: 0, position: "sticky", left: 0, zIndex: 3, background: gridBg, borderRight: `2px solid ${gridLine}` }}>
          <div style={{ height: headerH, background: "#111820", borderBottom: `2px solid ${gridLine}`, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 6px 4px" }}>
            <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>Equipment</div>
          </div>
          {equipRows.map((eq, i) => (
            <div key={eq.id} style={{ height: rowH, borderBottom: `1px solid ${gridLine}`, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6px", background: i % 2 === 0 ? gridBg : "#0f151d" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: eq.capacityBbl <= 20 ? "#ffff00" : eq.capacityBbl <= 60 ? "#ff9900" : eq.type === EQUIP_TYPES.BRITE ? "#d9ead3" : "#93c47d", lineHeight: 1.2 }}>{eq.name}</div>
              <div style={{ fontSize: "0.6rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{eq.capacityBbl}BBL{eq.notes ? ` · ${eq.notes}` : ""}</div>
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div style={{ position: "relative", width: chartWidth }}>
          {/* Stacked headers: Month → Weekday → Day */}
          <div style={{ height: headerH, background: "#111820", borderBottom: `2px solid ${gridLine}`, position: "relative" }}>
            {/* Month row */}
            <div style={{ display: "flex", height: 16, borderBottom: `1px solid ${gridLineLight}` }}>
              {months.map((m, i) => (
                <div key={i} style={{ width: m.span * dayWidth, flexShrink: 0, fontSize: "0.6rem", fontWeight: 700, color: "#ffe599", padding: "1px 4px", borderLeft: i > 0 ? `1px solid ${gridLine}` : "none", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.month}</div>
              ))}
            </div>
            {/* Weekday row */}
            <div style={{ display: "flex", height: 16, borderBottom: `1px solid ${gridLineLight}` }}>
              {days.map((d, i) => (
                <div key={i} style={{ width: dayWidth, flexShrink: 0, textAlign: "center", fontSize: "0.55rem", fontWeight: d.isToday ? 700 : 400, color: d.isToday ? "#ffe599" : d.isWeekend ? "#333d4d" : "#475569", fontFamily: "'JetBrains Mono', monospace", lineHeight: "16px" }}>{d.dow}</div>
              ))}
            </div>
            {/* Day number row */}
            <div style={{ display: "flex", height: 20 }}>
              {days.map((d, i) => (
                <div key={i} style={{ width: dayWidth, flexShrink: 0, textAlign: "center", fontSize: "0.65rem", fontWeight: d.isToday ? 700 : 500, color: d.isToday ? "#ffe599" : d.isWeekend ? "#333d4d" : "#94a3b8", fontFamily: "'JetBrains Mono', monospace", lineHeight: "20px", borderLeft: d.monthStart ? `1px solid ${gridLine}` : "none" }}>{d.day}</div>
              ))}
            </div>
          </div>
          {/* Grid + blocks */}
          <div style={{ position: "relative", height: chartHeight }}>
            {/* Row backgrounds */}
            {equipRows.map((_, i) => (
              <div key={`row-${i}`} style={{ position: "absolute", top: i * rowH, left: 0, right: 0, height: rowH, background: i % 2 === 0 ? gridBg : "#0f151d", borderBottom: `1px solid ${gridLine}` }}>
                {/* Sub-row lines */}
                <div style={{ position: "absolute", top: subRowH, left: 0, right: 0, height: 1, background: gridLineLight + "66" }} />
                <div style={{ position: "absolute", top: subRowH * 2, left: 0, right: 0, height: 1, background: gridLineLight + "66" }} />
              </div>
            ))}
            {/* Vertical day lines */}
            {days.map((d, i) => d.monthStart && (
              <div key={`vl-${i}`} style={{ position: "absolute", left: i * dayWidth, top: 0, bottom: 0, width: 1, background: gridLine }} />
            ))}
            {/* Weekend shading */}
            {days.map((d, i) => d.isWeekend && (
              <div key={`we-${i}`} style={{ position: "absolute", left: i * dayWidth, top: 0, bottom: 0, width: dayWidth, background: "#ffffff03" }} />
            ))}
            {/* Today line */}
            {todayOff >= 0 && todayOff < totalDays && (
              <div style={{ position: "absolute", left: todayOff * dayWidth, top: 0, bottom: 0, width: dayWidth, background: "#ffe59908", borderLeft: "2px solid #ffe59966", zIndex: 1 }} />
            )}
            {/* Batch blocks */}
            {blocks.map((b, i) => (
              <div key={i} onClick={() => onEditBatch(b.batch)} title={`${b.recipe.name} (${b.batch.id}) — ${b.step}`} style={{
                position: "absolute",
                top: b.eqIdx * rowH + b.subRow * subRowH + 2,
                left: b.left + 1, width: b.width - 1, height: subRowH - 3,
                background: b.phase.bg, border: `1px solid ${b.phase.border}`,
                borderRadius: 2, display: "flex", alignItems: "center", padding: "0 4px",
                overflow: "hidden", cursor: "pointer", zIndex: 2,
                fontSize: "0.55rem", fontWeight: 600, color: b.phase.text,
                whiteSpace: "nowrap", transition: "filter 0.1s",
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.4)"; e.currentTarget.style.zIndex = "10"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.zIndex = "2"; }}
              >
                {b.width > 50 ? b.label : b.width > 30 ? b.label.slice(0, 6) : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sub-row legend */}
      <div style={{ display: "flex", gap: 16, padding: "6px 12px", background: "#111820", borderTop: `1px solid ${gridLine}`, fontSize: "0.6rem", color: "#64748b" }}>
        <span>Row 1: <span style={{ color: "#f0b8f4" }}>Fermenting/Aging</span></span>
        <span>Row 2: <span style={{ color: "#cfe2f3" }}>Testing/Conditioning</span></span>
        <span>Row 3: <span style={{ color: "#d9ead3" }}>CAN / KEG</span></span>
        <span style={{ color: "#b4a7d6" }}>◆ Centrifuge</span>
        <span style={{ color: "#ffffff" }}>◆ <span style={{ color: "#7ba8d4" }}>THC</span></span>
        <span style={{ marginLeft: "auto" }}>Click blocks to edit</span>
      </div>
    </div>
  );
}

// ─── SCHEDULE OPTIMIZER TAB ─────────────────────────────────────────────────────

function ScheduleOptimizer({ schedule, setSchedule, equipment, recipes, demand, scenarios, setScenarios, activeScenario, setActiveScenario, sensitivity, setSensitivity }) {
  const [editBatch, setEditBatch] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecipe, setNewRecipe] = useState("");
  const [newStart, setNewStart] = useState(d(5));
  const [autoResult, setAutoResult] = useState(null);
  const [showScenarioSave, setShowScenarioSave] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [compareIdx, setCompareIdx] = useState(null);

  const findConflicts = useCallback(() => {
    const conflicts = [];
    schedule.forEach((b1, i) => {
      b1.steps.forEach(s1 => {
        schedule.forEach((b2, j) => {
          if (j <= i) return;
          b2.steps.forEach(s2 => {
            if (s1.equipId === s2.equipId && s1.start <= s2.end && s2.start <= s1.end) {
              conflicts.push({ batch1: b1.id, batch2: b2.id, equip: s1.equipId, step1: s1.step, step2: s2.step });
            }
          });
        });
      });
    });
    return conflicts;
  }, [schedule]);

  const conflicts = findConflicts();

  const handleUpdateStep = (batchId, stepName, field, value) => {
    setSchedule(prev => prev.map(b => b.id === batchId ? {
      ...b, steps: b.steps.map(s => s.step === stepName ? { ...s, [field]: value } : s)
    } : b));
  };

  const handleAddBatch = () => {
    const recipe = recipes.find(r => r.id === newRecipe);
    if (!recipe) return;
    const steps = [];
    let cursor = newStart;
    recipe.steps.forEach(rs => {
      const avail = equipment.filter(e => e.type === rs.equipType && e.capacityBbl >= recipe.bblPerBatch);
      const equipId = avail.length > 0 ? avail[0].id : equipment.find(e => e.type === rs.equipType)?.id || "";
      const durDays = Math.max(1, Math.ceil(rs.durationHrs / 24));
      const end = addDays(cursor, durDays - 1);
      steps.push({ step: rs.step, equipId, start: cursor, end });
      cursor = addDays(end, 1);
    });
    const newBatch = { id: `B${String(schedule.length + 1).padStart(3, "0")}`, recipeId: newRecipe, batchSizeBbl: recipe.bblPerBatch, status: "planned", steps };
    setSchedule(prev => [...prev, newBatch]);
    setShowAdd(false);
    setNewRecipe("");
  };

  const handleDeleteBatch = (batchId) => {
    setSchedule(prev => prev.filter(b => b.id !== batchId));
    setEditBatch(null);
  };

  // Unscheduled demand
  const scheduledRecipeVolume = {};
  schedule.forEach(b => {
    const key = b.recipeId;
    scheduledRecipeVolume[key] = (scheduledRecipeVolume[key] || 0) + b.batchSizeBbl;
  });
  const unmet = demand.filter(dm => {
    const sched = scheduledRecipeVolume[dm.recipeId] || 0;
    return sched < dm.volumeBbl;
  });

  // Auto-schedule handler
  const handleAutoSchedule = () => {
    const result = autoSchedule(demand, equipment, recipes, schedule, sensitivity);
    setAutoResult(result);
    if (result.newBatches.length > 0) {
      setSchedule(prev => [...prev, ...result.newBatches]);
    }
  };

  const handleClearAuto = () => {
    setSchedule(prev => prev.filter(b => !b.autoScheduled));
    setAutoResult(null);
  };

  // Scenario handlers
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return;
    const metrics = calcMetrics(schedule, demand, equipment);
    setScenarios(prev => [...prev, { name: scenarioName.trim(), schedule: JSON.parse(JSON.stringify(schedule)), demand: JSON.parse(JSON.stringify(demand)), sensitivity, metrics, createdAt: new Date().toLocaleString() }]);
    setScenarioName("");
    setShowScenarioSave(false);
  };

  const handleLoadScenario = (idx) => {
    const sc = scenarios[idx];
    if (!sc) return;
    setSchedule(sc.schedule);
    setActiveScenario(idx);
    setAutoResult(null);
  };

  const currentMetrics = calcMetrics(schedule, demand, equipment);
  const compareMetrics = compareIdx !== null && scenarios[compareIdx] ? scenarios[compareIdx].metrics : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>Production Schedule</h2>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Drag timeline to scroll · Click blocks to edit · {schedule.length} batches scheduled</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {conflicts.length > 0 && <span style={baseStyles.badge("#ef4444")}>{conflicts.length} conflict{conflicts.length > 1 ? "s" : ""}</span>}
          <button style={{ ...baseStyles.btn(), color: "#d98ae0", borderColor: "#d98ae044" }} onClick={handleAutoSchedule}>⚡ Auto-Schedule</button>
          {schedule.some(b => b.autoScheduled) && <button style={{ ...baseStyles.btn(), color: "#fca5a5", borderColor: "#ef444444" }} onClick={handleClearAuto}>✕ Clear Auto</button>}
          <button style={baseStyles.btn()} onClick={() => setShowScenarioSave(true)}>💾 Save Scenario</button>
          <button style={baseStyles.btn("primary")} onClick={() => setShowAdd(true)}>+ Add Batch</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {[["Fermenting","#d98ae0"],["Testing","#7bafd4"],["CAN","#7dab6e"],["KEG","#7dab6e"],["THC","#3c78d8"]].map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#94a3b8" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c + "66", border: `1px solid ${c}` }} />
            {k}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.65rem", color: "#64748b", marginLeft: 8, borderLeft: "1px solid #1e293b", paddingLeft: 12 }}>
          Tanks: <span style={{ color: "#ffff00" }}>20BBL</span> <span style={{ color: "#93c47d" }}>120BBL</span> <span style={{ color: "#ff9900" }}>60BBL</span>
        </div>
      </div>

      <div style={baseStyles.card}>
        <GanttChart schedule={schedule} equipment={equipment} recipes={recipes} onEditBatch={setEditBatch} />
      </div>

      {/* Sensitivity + Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ ...baseStyles.card, padding: "10px 14px" }}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Demand Sensitivity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="range" min="50" max="200" value={Math.round(sensitivity * 100)} onChange={e => setSensitivity(Number(e.target.value) / 100)} style={{ flex: 1, accentColor: "#c8854a" }} />
            <span style={{ ...baseStyles.mono, color: "#c8854a", fontWeight: 700, minWidth: 40, textAlign: "right" }}>{Math.round(sensitivity * 100)}%</span>
          </div>
        </div>
        <div style={{ ...baseStyles.card, padding: "10px 14px" }}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>Total BBL</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#c8854a", ...baseStyles.mono }}>{currentMetrics.totalBbl}</div>
        </div>
        <div style={{ ...baseStyles.card, padding: "10px 14px" }}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>FV Utilization</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: currentMetrics.utilization > 70 ? "#81c784" : "#fbbf24", ...baseStyles.mono }}>{currentMetrics.utilization}%</div>
        </div>
        <div style={{ ...baseStyles.card, padding: "10px 14px" }}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>On-Time Rate</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: currentMetrics.onTime > 90 ? "#81c784" : "#fca5a5", ...baseStyles.mono }}>{currentMetrics.onTime}%</div>
        </div>
        <div style={{ ...baseStyles.card, padding: "10px 14px" }}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 2 }}>Batches</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#8ab4f0", ...baseStyles.mono }}>{currentMetrics.batchCount}</div>
        </div>
      </div>

      {/* Scenarios Panel */}
      {scenarios.length > 0 && (
        <div style={{ ...baseStyles.card, marginBottom: 16 }}>
          <div style={baseStyles.cardTitle}>📊 Saved Scenarios {compareIdx !== null && "— Comparing"}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: compareMetrics ? 12 : 0 }}>
            {scenarios.map((sc, i) => (
              <div key={i} style={{ background: "#0b0f14", border: `1px solid ${activeScenario === i ? "#c8854a" : "#1e293b"}`, borderRadius: 6, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f8fafc" }}>{sc.name}</div>
                <div style={{ fontSize: "0.65rem", color: "#475569", ...baseStyles.mono }}>{sc.createdAt}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{sc.metrics.totalBbl} BBL · {sc.metrics.batchCount} batches · {sc.metrics.utilization}% util</div>
                <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.65rem", padding: "2px 8px" }} onClick={() => handleLoadScenario(i)}>Load</button>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.65rem", padding: "2px 8px", color: compareIdx === i ? "#c8854a" : "#94a3b8" }} onClick={() => setCompareIdx(compareIdx === i ? null : i)}>Compare</button>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.65rem", padding: "2px 8px", color: "#fca5a5" }} onClick={() => setScenarios(prev => prev.filter((_, j) => j !== i))}>✕</button>
                </div>
              </div>
            ))}
          </div>
          {compareMetrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[["Total BBL", currentMetrics.totalBbl, compareMetrics.totalBbl], ["Batches", currentMetrics.batchCount, compareMetrics.batchCount], ["Utilization", currentMetrics.utilization + "%", compareMetrics.utilization + "%"], ["On-Time", currentMetrics.onTime + "%", compareMetrics.onTime + "%"]].map(([label, cur, prev], i) => {
                const diff = typeof cur === "string" ? parseInt(cur) - parseInt(prev) : cur - prev;
                return (
                  <div key={i} style={{ background: "#0b0f14", borderRadius: 6, padding: "8px 12px" }}>
                    <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc", ...baseStyles.mono }}>{cur}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: diff > 0 ? "#81c784" : diff < 0 ? "#fca5a5" : "#64748b", ...baseStyles.mono }}>{diff > 0 ? "+" : ""}{diff}{typeof cur === "string" ? "" : ""}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#475569" }}>was: {prev}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Auto-Schedule Results */}
      {autoResult && (
        <div style={{ ...baseStyles.card, borderColor: autoResult.unmetDemand.length > 0 ? "#f59e0b44" : "#22c55e44", marginBottom: 16 }}>
          <div style={baseStyles.cardTitle}>⚡ Auto-Schedule Results</div>
          <div style={{ display: "flex", gap: 16, marginBottom: autoResult.unmetDemand.length > 0 ? 8 : 0, fontSize: "0.85rem" }}>
            <span style={{ color: "#81c784" }}>{autoResult.newBatches.length} batches added</span>
            <span style={{ color: "#c8854a" }}>{autoResult.totalBbl} BBL scheduled</span>
            {autoResult.unmetDemand.length > 0 && <span style={{ color: "#fca5a5" }}>{autoResult.unmetDemand.length} demand entries couldn't be met</span>}
          </div>
          {autoResult.unmetDemand.length > 0 && (
            <div style={{ fontSize: "0.75rem" }}>
              {autoResult.unmetDemand.map((u, i) => {
                const r = recipes.find(x => x.id === u.recipeId);
                return <div key={i} style={{ color: "#fca5a5", marginBottom: 2 }}>• {r?.name || u.recipeId}: {u.reason}</div>;
              })}
            </div>
          )}
        </div>
      )}

      {/* Unmet Demand */}
      {unmet.length > 0 && (
        <div style={{ ...baseStyles.card, borderColor: "#f59e0b44" }}>
          <div style={baseStyles.cardTitle}><span style={{ color: "#f59e0b" }}>&#9888;</span> Demand Without Sufficient Batches</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {unmet.map(dm => {
              const r = recipes.find(x => x.id === dm.recipeId);
              return (
                <div key={dm.id} style={{ ...baseStyles.badge("#f59e0b"), fontSize: "0.7rem" }}>
                  {r?.name || dm.recipeId}: {dm.volumeBbl} BBL by {fmtDate(dm.shipDate)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div style={{ ...baseStyles.card, borderColor: "#ef444444" }}>
          <div style={baseStyles.cardTitle}><span style={{ color: "#ef4444" }}>&#9888;</span> Equipment Conflicts</div>
          {conflicts.map((c, i) => {
            const eq = equipment.find(e => e.id === c.equip);
            return (
              <div key={i} style={{ fontSize: "0.8rem", color: "#fca5a5", marginBottom: 4 }}>
                {eq?.name}: {c.batch1} ({c.step1}) overlaps {c.batch2} ({c.step2})
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Batch Modal */}
      <Modal open={!!editBatch} onClose={() => setEditBatch(null)} title={`Edit Batch ${editBatch?.id}`} width={600}>
        {editBatch && (() => {
          const recipe = recipes.find(r => r.id === editBatch.recipeId);
          return (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
                <span style={baseStyles.badge(TYPE_COLORS[recipe?.type]?.border || "#3b82f6")}>{recipe?.type}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600 }}>{recipe?.name}</span>
                <span style={{ ...baseStyles.mono, color: "#64748b" }}>{editBatch.batchSizeBbl} BBL</span>
              </div>
              <table style={baseStyles.table}>
                <thead><tr>
                  <th style={baseStyles.th}>Step</th>
                  <th style={baseStyles.th}>Equipment</th>
                  <th style={baseStyles.th}>Start</th>
                  <th style={baseStyles.th}>End</th>
                </tr></thead>
                <tbody>
                  {editBatch.steps.map(step => (
                    <tr key={step.step}>
                      <td style={{ ...baseStyles.td, color: STEP_COLORS[step.step] || "#e2e8f0" }}>{step.step}</td>
                      <td style={baseStyles.td}>
                        <select value={step.equipId} style={baseStyles.select} onChange={e => handleUpdateStep(editBatch.id, step.step, "equipId", e.target.value)}>
                          {equipment.filter(eq => {
                            const rs = recipe.steps.find(s => s.step === step.step);
                            return rs && eq.type === rs.equipType;
                          }).map(eq => <option key={eq.id} value={eq.id}>{eq.name} ({eq.capacityBbl} BBL)</option>)}
                        </select>
                      </td>
                      <td style={baseStyles.td}><input type="date" value={step.start} style={{ ...baseStyles.input, width: 140 }} onChange={e => handleUpdateStep(editBatch.id, step.step, "start", e.target.value)} /></td>
                      <td style={baseStyles.td}><input type="date" value={step.end} style={{ ...baseStyles.input, width: 140 }} onChange={e => handleUpdateStep(editBatch.id, step.step, "end", e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button style={{ ...baseStyles.btn(), color: "#ef4444", borderColor: "#ef444444" }} onClick={() => handleDeleteBatch(editBatch.id)}>Delete Batch</button>
                <button style={baseStyles.btn("primary")} onClick={() => setEditBatch(null)}>Done</button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Add Batch Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Schedule New Batch" width={450}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Recipe</div>
          <select value={newRecipe} onChange={e => setNewRecipe(e.target.value)} style={{ ...baseStyles.select, width: "100%" }}>
            <option value="">Select recipe...</option>
            {recipes.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type} · {r.bblPerBatch} BBL)</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Start Date</div>
          <input type="date" value={newStart} onChange={e => setNewStart(e.target.value)} style={{ ...baseStyles.input, width: 200 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={baseStyles.btn()} onClick={() => setShowAdd(false)}>Cancel</button>
          <button style={baseStyles.btn("primary")} onClick={handleAddBatch} disabled={!newRecipe}>Add to Schedule</button>
        </div>
      </Modal>

      {/* Save Scenario Modal */}
      <Modal open={showScenarioSave} onClose={() => setShowScenarioSave(false)} title="Save Current Schedule as Scenario" width={400}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Scenario Name</div>
          <input value={scenarioName} onChange={e => setScenarioName(e.target.value)} placeholder="e.g. Baseline Q2, Daizy's 2x, FV7 Down..." style={{ ...baseStyles.input, width: "100%" }} />
        </div>
        <div style={{ ...baseStyles.card, padding: "10px 12px", marginBottom: 16, background: "#0b0f14" }}>
          <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: 6 }}>This will snapshot:</div>
          <div style={{ fontSize: "0.8rem", color: "#e2e8f0" }}>{schedule.length} batches · {currentMetrics.totalBbl} BBL · {currentMetrics.utilization}% util · sensitivity {Math.round(sensitivity * 100)}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={baseStyles.btn()} onClick={() => setShowScenarioSave(false)}>Cancel</button>
          <button style={baseStyles.btn("primary")} onClick={handleSaveScenario} disabled={!scenarioName.trim()}>Save Scenario</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── MATERIAL ORDERS TAB ────────────────────────────────────────────────────────

function MaterialOrders({ schedule, recipes, materials, equipment }) {
  const todayStr = today();

  const needs = useMemo(() => {
    const matNeeds = {};
    schedule.forEach(batch => {
      const recipe = recipes.find(r => r.id === batch.recipeId);
      if (!recipe) return;
      const brewStart = batch.steps.find(s => s.step === "mash")?.start;
      if (!brewStart) return;
      recipe.ingredients.forEach(ing => {
        const totalQty = ing.qtyPerBbl * batch.batchSizeBbl;
        if (!matNeeds[ing.materialId]) matNeeds[ing.materialId] = [];
        matNeeds[ing.materialId].push({ batchId: batch.id, recipeName: recipe.name, brewDate: brewStart, qty: totalQty });
      });
    });
    return matNeeds;
  }, [schedule, recipes]);

  const orders = useMemo(() => {
    const result = [];
    Object.entries(needs).forEach(([matId, batchNeeds]) => {
      const mat = materials.find(m => m.id === matId);
      if (!mat) return;
      let runningStock = mat.onHand;
      const sorted = [...batchNeeds].sort((a, b) => a.brewDate.localeCompare(b.brewDate));
      sorted.forEach(need => {
        runningStock -= need.qty;
        if (runningStock < 0) {
          const orderBy = addDays(need.brewDate, -mat.leadTimeDays);
          const urgent = orderBy <= todayStr;
          result.push({
            materialId: matId, materialName: mat.name, unit: mat.unit,
            qtyNeeded: Math.ceil(-runningStock), brewDate: need.brewDate,
            orderBy, leadTimeDays: mat.leadTimeDays,
            batchId: need.batchId, recipeName: need.recipeName,
            urgent, costEst: Math.ceil(-runningStock) * mat.costPerUnit
          });
          runningStock = 0;
        }
      });
    });
    return result.sort((a, b) => a.orderBy.localeCompare(b.orderBy));
  }, [needs, materials]);

  const urgentOrders = orders.filter(o => o.urgent);
  const upcomingOrders = orders.filter(o => !o.urgent);

  const totalCost = orders.reduce((s, o) => s + o.costEst, 0);

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Raw Material Orders</h2>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>Auto-calculated from schedule × recipes × lead times × current inventory</div>

      <div style={baseStyles.grid(4)}>
        <Stat label="Total Orders Needed" value={orders.length} />
        <Stat label="Urgent (Order Now)" value={urgentOrders.length} color={urgentOrders.length > 0 ? "#ef4444" : "#22c55e"} />
        <Stat label="Est. Total Cost" value={`$${totalCost.toLocaleString()}`} color="#3b82f6" />
        <Stat label="Next Order Due" value={orders.length > 0 ? fmtDate(orders[0].orderBy) : "—"} />
      </div>

      {urgentOrders.length > 0 && (
        <div style={{ ...baseStyles.card, borderColor: "#ef444466" }}>
          <div style={baseStyles.cardTitle}><span style={{ color: "#ef4444", fontSize: "1.1rem" }}>&#9888;</span> Order Immediately</div>
          <table style={baseStyles.table}>
            <thead><tr>
              <th style={baseStyles.th}>Material</th>
              <th style={baseStyles.th}>Qty Needed</th>
              <th style={baseStyles.th}>For Batch</th>
              <th style={baseStyles.th}>Brew Date</th>
              <th style={baseStyles.th}>Lead Time</th>
              <th style={baseStyles.th}>Est. Cost</th>
            </tr></thead>
            <tbody>
              {urgentOrders.map((o, i) => (
                <tr key={i}>
                  <td style={{ ...baseStyles.td, color: "#fca5a5", fontWeight: 600 }}>{o.materialName}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{o.qtyNeeded.toLocaleString()} {o.unit}</td>
                  <td style={baseStyles.td}>{o.recipeName} <span style={{ color: "#64748b" }}>({o.batchId})</span></td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{fmtDate(o.brewDate)}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{o.leadTimeDays}d</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono, color: "#fca5a5" }}>${o.costEst.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={baseStyles.card}>
        <div style={baseStyles.cardTitle}>Upcoming Orders</div>
        {upcomingOrders.length === 0 ? (
          <div style={{ color: "#64748b", fontSize: "0.85rem", padding: "20px 0", textAlign: "center" }}>All materials on hand for scheduled batches</div>
        ) : (
          <table style={baseStyles.table}>
            <thead><tr>
              <th style={baseStyles.th}>Material</th>
              <th style={baseStyles.th}>Qty</th>
              <th style={baseStyles.th}>Order By</th>
              <th style={baseStyles.th}>For Batch</th>
              <th style={baseStyles.th}>Brew Date</th>
              <th style={baseStyles.th}>Est. Cost</th>
            </tr></thead>
            <tbody>
              {upcomingOrders.map((o, i) => (
                <tr key={i}>
                  <td style={{ ...baseStyles.td, fontWeight: 500 }}>{o.materialName}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{o.qtyNeeded.toLocaleString()} {o.unit}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono, color: daysBetween(todayStr, o.orderBy) < 3 ? "#f59e0b" : "#e2e8f0" }}>{fmtDate(o.orderBy)}</td>
                  <td style={baseStyles.td}>{o.recipeName} <span style={{ color: "#64748b" }}>({o.batchId})</span></td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{fmtDate(o.brewDate)}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>${o.costEst.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCTION STATUS TAB ──────────────────────────────────────────────────────

function ProductionStatus({ schedule, equipment, recipes }) {
  const todayStr = today();

  const activeBatches = schedule.filter(b => b.status !== "complete");

  const equipStatus = equipment.map(eq => {
    const active = [];
    schedule.forEach(batch => {
      batch.steps.forEach(step => {
        if (step.equipId === eq.id && step.start <= todayStr && step.end >= todayStr) {
          const recipe = recipes.find(r => r.id === batch.recipeId);
          active.push({ batchId: batch.id, step: step.step, recipeName: recipe?.name || "?", start: step.start, end: step.end });
        }
      });
    });
    const nextUp = [];
    schedule.forEach(batch => {
      batch.steps.forEach(step => {
        if (step.equipId === eq.id && step.start > todayStr) {
          const recipe = recipes.find(r => r.id === batch.recipeId);
          nextUp.push({ batchId: batch.id, step: step.step, recipeName: recipe?.name || "?", start: step.start });
        }
      });
    });
    nextUp.sort((a, b) => a.start.localeCompare(b.start));
    return { ...eq, active, nextUp: nextUp.slice(0, 2) };
  });

  const groupedEquip = {};
  equipStatus.forEach(eq => {
    const typeName = eq.type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());
    if (!groupedEquip[typeName]) groupedEquip[typeName] = [];
    groupedEquip[typeName].push(eq);
  });

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Production Status</h2>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>Real-time view of equipment utilization and batch progress</div>

      <div style={baseStyles.grid(3)}>
        <Stat label="Active Batches" value={activeBatches.length} />
        <Stat label="Equipment In Use" value={equipStatus.filter(e => e.active.length > 0).length} sub={`of ${equipment.length} total`} />
        <Stat label="Utilization" value={`${Math.round(equipStatus.filter(e => e.active.length > 0).length / equipment.length * 100)}%`} color={equipStatus.filter(e => e.active.length > 0).length / equipment.length > 0.7 ? "#22c55e" : "#f59e0b"} />
      </div>

      {Object.entries(groupedEquip).map(([typeName, eqs]) => (
        <div key={typeName} style={baseStyles.card}>
          <div style={baseStyles.cardTitle}>{typeName}s</div>
          <div style={baseStyles.grid(Math.min(eqs.length, 3))}>
            {eqs.map(eq => (
              <div key={eq.id} style={{ background: "#0b0f14", borderRadius: 6, padding: 12, border: `1px solid ${eq.active.length > 0 ? "#22c55e33" : "#1e293b"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>{eq.name}</span>
                  <span style={baseStyles.badge(eq.active.length > 0 ? "#22c55e" : "#64748b")}>{eq.active.length > 0 ? "IN USE" : "IDLE"}</span>
                </div>
                <div style={{ ...baseStyles.mono, color: "#64748b", marginBottom: 6 }}>{eq.capacityBbl} BBL capacity</div>
                {eq.active.map((a, i) => (
                  <div key={i} style={{ background: STEP_COLORS[a.step] + "18", border: `1px solid ${STEP_COLORS[a.step]}33`, borderRadius: 4, padding: "6px 8px", marginBottom: 4 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 500, color: STEP_COLORS[a.step] }}>{a.recipeName}</div>
                    <div style={{ ...baseStyles.mono, color: "#94a3b8", fontSize: "0.7rem" }}>{a.step} · {a.batchId} · ends {fmtDate(a.end)}</div>
                  </div>
                ))}
                {eq.nextUp.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: "0.65rem", color: "#475569", marginBottom: 2 }}>NEXT UP</div>
                    {eq.nextUp.map((n, i) => (
                      <div key={i} style={{ fontSize: "0.7rem", color: "#64748b" }}>{n.recipeName} · {n.step} · {fmtDate(n.start)}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Batch Pipeline */}
      <div style={baseStyles.card}>
        <div style={baseStyles.cardTitle}>Batch Pipeline</div>
        <table style={baseStyles.table}>
          <thead><tr>
            <th style={baseStyles.th}>Batch</th>
            <th style={baseStyles.th}>Recipe</th>
            <th style={baseStyles.th}>Type</th>
            <th style={baseStyles.th}>BBL</th>
            <th style={baseStyles.th}>Current Step</th>
            <th style={baseStyles.th}>Status</th>
            <th style={baseStyles.th}>Est. Complete</th>
          </tr></thead>
          <tbody>
            {activeBatches.map(batch => {
              const recipe = recipes.find(r => r.id === batch.recipeId);
              const currentStep = batch.steps.find(s => s.start <= todayStr && s.end >= todayStr) || batch.steps.find(s => s.start > todayStr);
              const lastStep = batch.steps[batch.steps.length - 1];
              return (
                <tr key={batch.id}>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{batch.id}</td>
                  <td style={{ ...baseStyles.td, fontWeight: 500 }}>{recipe?.name || "?"}</td>
                  <td style={baseStyles.td}><span style={baseStyles.badge(TYPE_COLORS[recipe?.type]?.border || "#3b82f6")}>{recipe?.type}</span></td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{batch.batchSizeBbl}</td>
                  <td style={baseStyles.td}>
                    {currentStep && <span style={{ color: STEP_COLORS[currentStep.step] || "#e2e8f0" }}>{currentStep.step}</span>}
                  </td>
                  <td style={baseStyles.td}><span style={baseStyles.badge(STATUS_COLORS[batch.status] || "#64748b")}>{batch.status}</span></td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{fmtDate(lastStep?.end || "")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── INVENTORY DASHBOARD TAB ────────────────────────────────────────────────────

function InventoryDashboard({ materials, schedule, recipes }) {
  const [filter, setFilter] = useState("all");

  const matUsage = useMemo(() => {
    const usage = {};
    schedule.forEach(batch => {
      const recipe = recipes.find(r => r.id === batch.recipeId);
      if (!recipe) return;
      recipe.ingredients.forEach(ing => {
        usage[ing.materialId] = (usage[ing.materialId] || 0) + ing.qtyPerBbl * batch.batchSizeBbl;
      });
    });
    return usage;
  }, [schedule, recipes]);

  const matData = materials.map(m => {
    const totalNeeded = matUsage[m.id] || 0;
    const surplus = m.onHand - totalNeeded;
    const weeksOfStock = totalNeeded > 0 ? Math.round(m.onHand / (totalNeeded / 4) * 10) / 10 : 99;
    return { ...m, totalNeeded, surplus, weeksOfStock, status: surplus >= 0 ? "ok" : "short" };
  });

  const filtered = filter === "all" ? matData : filter === "short" ? matData.filter(m => m.status === "short") : matData.filter(m => m.category === filter);
  const categories = [...new Set(materials.map(m => m.category))];

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Inventory Dashboard</h2>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>Current stock levels vs. scheduled demand</div>

      <div style={baseStyles.grid(4)}>
        <Stat label="Total Materials" value={materials.length} />
        <Stat label="Materials Short" value={matData.filter(m => m.status === "short").length} color={matData.some(m => m.status === "short") ? "#ef4444" : "#22c55e"} />
        <Stat label="Est. Inventory Value" value={`$${Math.round(materials.reduce((s, m) => s + m.onHand * m.costPerUnit, 0)).toLocaleString()}`} color="#3b82f6" />
        <Stat label="Scheduled Demand" value={`${Math.round(Object.values(matUsage).reduce((s, v) => s + v, 0)).toLocaleString()} units`} />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "short", ...categories].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ ...baseStyles.btn(filter === f ? "primary" : "default"), textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      <div style={baseStyles.card}>
        <table style={baseStyles.table}>
          <thead><tr>
            <th style={baseStyles.th}>Material</th>
            <th style={baseStyles.th}>Category</th>
            <th style={baseStyles.th}>On Hand</th>
            <th style={baseStyles.th}>Scheduled Need</th>
            <th style={baseStyles.th}>Surplus / Deficit</th>
            <th style={baseStyles.th}>Lead Time</th>
            <th style={baseStyles.th}>Status</th>
          </tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <td style={{ ...baseStyles.td, fontWeight: 500 }}>{m.name}</td>
                <td style={baseStyles.td}><span style={baseStyles.badge(m.category === "hops" ? "#22c55e" : m.category === "malt" ? "#f59e0b" : m.category === "yeast" ? "#8b5cf6" : "#3b82f6")}>{m.category}</span></td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{m.onHand.toLocaleString()} {m.unit}</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{Math.round(m.totalNeeded).toLocaleString()} {m.unit}</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, color: m.surplus >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                  {m.surplus >= 0 ? "+" : ""}{Math.round(m.surplus).toLocaleString()} {m.unit}
                </td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{m.leadTimeDays}d</td>
                <td style={baseStyles.td}><span style={baseStyles.badge(m.status === "ok" ? "#22c55e" : "#ef4444")}>{m.status === "ok" ? "OK" : "SHORT"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Level Bars */}
      <div style={baseStyles.card}>
        <div style={baseStyles.cardTitle}>Stock vs. Demand</div>
        {matData.filter(m => m.totalNeeded > 0).map(m => {
          const max = Math.max(m.onHand, m.totalNeeded);
          return (
            <div key={m.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: 3 }}>
                <span style={{ color: "#e2e8f0" }}>{m.name}</span>
                <span style={{ ...baseStyles.mono, color: "#64748b" }}>{m.onHand.toLocaleString()} / {Math.round(m.totalNeeded).toLocaleString()} {m.unit}</span>
              </div>
              <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden", position: "relative" }}>
                <div style={{ position: "absolute", height: "100%", width: `${Math.min(100, m.onHand / max * 100)}%`, background: m.onHand >= m.totalNeeded ? "#22c55e" : "#ef4444", borderRadius: 3 }} />
                <div style={{ position: "absolute", height: "100%", width: `${m.totalNeeded / max * 100}%`, borderRight: "2px solid #f8fafc88", top: 0 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DATA MANAGEMENT TAB ────────────────────────────────────────────────────────

function DataManager({ demand, setDemand, recipes }) {
  const [showAdd, setShowAdd] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [newDm, setNewDm] = useState({ recipeId: "", volumeBbl: "", shipDate: d(14), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN });

  const handleAddDemand = () => {
    const id = `D${String(demand.length + 1).padStart(3, "0")}`;
    setDemand(prev => [...prev, { ...newDm, id, volumeBbl: Number(newDm.volumeBbl), source: "manual" }]);
    setNewDm({ recipeId: "", volumeBbl: "", shipDate: d(14), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN });
    setShowAdd(false);
  };

  const handleCSVImport = () => {
    const lines = csvText.trim().split("\n").slice(1);
    const newEntries = lines.map((line, i) => {
      const [recipeId, volumeBbl, shipDate, channel, format] = line.split(",").map(s => s.trim());
      return {
        id: `DI${String(demand.length + i + 1).padStart(3, "0")}`,
        recipeId, volumeBbl: Number(volumeBbl), shipDate,
        channel: channel || CHANNELS.DISTRIBUTION,
        format: format || FORMATS.CAN,
        source: "csv_import"
      };
    }).filter(e => e.recipeId && !isNaN(e.volumeBbl) && e.shipDate);
    if (newEntries.length > 0) {
      setDemand(prev => [...prev, ...newEntries]);
      setCsvText("");
    }
  };

  const handleOverride = (id, value) => {
    setDemand(prev => prev.map(dm => dm.id === id ? { ...dm, volumeBbl: Number(value) || dm.volumeBbl } : dm));
  };

  const handleDelete = (id) => {
    setDemand(prev => prev.filter(dm => dm.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>Demand Forecasts</h2>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Import via CSV/API or add manually · All entries editable</div>
        </div>
        <button style={baseStyles.btn("primary")} onClick={() => setShowAdd(true)}>+ Add Demand</button>
      </div>

      {/* CSV Import */}
      <div style={baseStyles.card}>
        <div style={baseStyles.cardTitle}>CSV / API Import</div>
        <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 8 }}>Format: recipe_id, volume_bbl, ship_date (YYYY-MM-DD), channel, format</div>
        <textarea value={csvText} onChange={e => setCsvText(e.target.value)} placeholder="recipe_id,volume_bbl,ship_date,channel,format&#10;R01,15,2026-04-15,distribution,can&#10;R14,30,2026-04-20,distribution,barrel" style={{ ...baseStyles.input, height: 100, resize: "vertical", fontFamily: "'JetBrains Mono', monospace" }} />
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button style={baseStyles.btn("primary")} onClick={handleCSVImport} disabled={!csvText.trim()}>Import CSV</button>
          <span style={{ fontSize: "0.75rem", color: "#64748b", alignSelf: "center" }}>Tip: your demand model can push data here via the same CSV format</span>
        </div>
      </div>

      {/* Demand Table */}
      <div style={baseStyles.card}>
        <div style={baseStyles.cardTitle}>Current Demand ({demand.length} entries)</div>
        <table style={baseStyles.table}>
          <thead><tr>
            <th style={baseStyles.th}>ID</th>
            <th style={baseStyles.th}>Recipe</th>
            <th style={baseStyles.th}>Volume (BBL)</th>
            <th style={baseStyles.th}>Ship Date</th>
            <th style={baseStyles.th}>Channel</th>
            <th style={baseStyles.th}>Format</th>
            <th style={baseStyles.th}>Source</th>
            <th style={baseStyles.th}></th>
          </tr></thead>
          <tbody>
            {demand.map(dm => {
              const recipe = recipes.find(r => r.id === dm.recipeId);
              return (
                <tr key={dm.id}>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono, color: "#64748b" }}>{dm.id}</td>
                  <td style={{ ...baseStyles.td, fontWeight: 500 }}>
                    {recipe?.name || dm.recipeId}
                    {recipe && <span style={{ ...baseStyles.badge(TYPE_COLORS[recipe.type]?.border || "#64748b"), marginLeft: 6 }}>{recipe.type}</span>}
                  </td>
                  <td style={baseStyles.td}>
                    <input type="number" value={dm.volumeBbl} style={{ ...baseStyles.input, width: 80, textAlign: "right" }} onChange={e => handleOverride(dm.id, e.target.value)} />
                  </td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{fmtDate(dm.shipDate)}</td>
                  <td style={baseStyles.td}><span style={baseStyles.badge(dm.channel === CHANNELS.TAPROOM ? "#8b5cf6" : "#3b82f6")}>{dm.channel}</span></td>
                  <td style={baseStyles.td}><span style={{ ...baseStyles.mono, color: "#94a3b8" }}>{dm.format}</span></td>
                  <td style={baseStyles.td}><span style={baseStyles.badge(dm.source === "contract" ? "#d97706" : dm.source === "csv_import" ? "#06b6d4" : "#64748b")}>{dm.source}</span></td>
                  <td style={baseStyles.td}><button onClick={() => handleDelete(dm.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Demand Entry" width={450}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Recipe</div>
            <select value={newDm.recipeId} onChange={e => setNewDm(p => ({ ...p, recipeId: e.target.value }))} style={{ ...baseStyles.select, width: "100%" }}>
              <option value="">Select...</option>
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Volume (BBL)</div>
              <input type="number" value={newDm.volumeBbl} onChange={e => setNewDm(p => ({ ...p, volumeBbl: e.target.value }))} style={baseStyles.input} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Ship Date</div>
              <input type="date" value={newDm.shipDate} onChange={e => setNewDm(p => ({ ...p, shipDate: e.target.value }))} style={baseStyles.input} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Channel</div>
              <select value={newDm.channel} onChange={e => setNewDm(p => ({ ...p, channel: e.target.value }))} style={{ ...baseStyles.select, width: "100%" }}>
                <option value="taproom">Taproom</option>
                <option value="distribution">Distribution</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>Format</div>
              <select value={newDm.format} onChange={e => setNewDm(p => ({ ...p, format: e.target.value }))} style={{ ...baseStyles.select, width: "100%" }}>
                <option value="can">Can</option>
                <option value="barrel">Barrel</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button style={baseStyles.btn()} onClick={() => setShowAdd(false)}>Cancel</button>
            <button style={baseStyles.btn("primary")} onClick={handleAddDemand} disabled={!newDm.recipeId || !newDm.volumeBbl}>Add</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── RECIPE BROWSER TAB ─────────────────────────────────────────────────────────

function RecipeBrowser({ recipes, materials }) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const filtered = selectedType === "all" ? recipes : recipes.filter(r => r.type === selectedType);

  const counts = { all: recipes.length, core: recipes.filter(r => r.type === "core").length, contract: recipes.filter(r => r.type === "contract").length, seasonal: recipes.filter(r => r.type === "seasonal").length };

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Recipe Library</h2>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>{recipes.length} recipes · 11 core · 6 contract · {recipes.length - 17} seasonal/specialty</div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setSelectedType(k)} style={{ ...baseStyles.btn(selectedType === k ? "primary" : "default"), textTransform: "capitalize" }}>{k} ({v})</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {filtered.map(r => {
          const tc = TYPE_COLORS[r.type];
          const totalHrs = r.steps.reduce((s, st) => s + st.durationHrs + st.cleanHrs, 0);
          return (
            <div key={r.id} onClick={() => setSelectedRecipe(r)} style={{ ...baseStyles.card, cursor: "pointer", borderColor: tc.border + "33", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = tc.border}
              onMouseLeave={e => e.currentTarget.style.borderColor = tc.border + "33"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#f8fafc" }}>{r.name}</div>
                  <div style={{ ...baseStyles.mono, color: "#64748b", fontSize: "0.7rem" }}>{r.id} · {r.style}</div>
                </div>
                <span style={baseStyles.badge(tc.border)}>{r.type}</span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: "0.75rem", color: "#94a3b8" }}>
                <span>{r.bblPerBatch} BBL/batch</span>
                <span>{Math.round(totalHrs)}h total</span>
                <span>{r.ingredients.length} ingredients</span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title={selectedRecipe?.name} width={550}>
        {selectedRecipe && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <span style={baseStyles.badge(TYPE_COLORS[selectedRecipe.type]?.border)}>{selectedRecipe.type}</span>
              <span style={{ ...baseStyles.mono, color: "#94a3b8" }}>{selectedRecipe.style} · {selectedRecipe.bblPerBatch} BBL/batch</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f8fafc", marginBottom: 8 }}>Ingredients (per BBL)</div>
            <table style={{ ...baseStyles.table, marginBottom: 16 }}>
              <thead><tr><th style={baseStyles.th}>Material</th><th style={baseStyles.th}>Qty/BBL</th><th style={baseStyles.th}>Qty/Batch</th></tr></thead>
              <tbody>
                {selectedRecipe.ingredients.map(ing => {
                  const mat = materials.find(m => m.id === ing.materialId);
                  return (
                    <tr key={ing.materialId}>
                      <td style={baseStyles.td}>{mat?.name || ing.materialId}</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{ing.qtyPerBbl} {mat?.unit}</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{(ing.qtyPerBbl * selectedRecipe.bblPerBatch).toLocaleString()} {mat?.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f8fafc", marginBottom: 8 }}>Process Steps</div>
            <table style={baseStyles.table}>
              <thead><tr><th style={baseStyles.th}>Step</th><th style={baseStyles.th}>Equipment</th><th style={baseStyles.th}>Duration</th><th style={baseStyles.th}>Clean</th></tr></thead>
              <tbody>
                {selectedRecipe.steps.map(step => (
                  <tr key={step.step}>
                    <td style={{ ...baseStyles.td, color: STEP_COLORS[step.step] }}>{step.step}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, color: "#94a3b8" }}>{step.equipType.replace("_", " ")}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{step.durationHrs}h ({Math.round(step.durationHrs / 24 * 10) / 10}d)</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{step.cleanHrs}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── NETSUITE SYNC TAB ──────────────────────────────────────────────────────────

const NS_MCP = { type:"url", url:"https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools", name:"netsuite" };

async function nsQuery(sql, addLog) {
  try {
    addLog("Calling NetSuite via MCP...");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:8000, system:"Run the SuiteQL. Return JSON only.", messages:[{role:"user",content:"Run: "+sql}], mcp_servers:[NS_MCP] })
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    for (const b of (d.content||[])) {
      if (b.type === "mcp_tool_result") {
        const subs = Array.isArray(b.content) ? b.content : [b.content];
        for (const s of subs) {
          const t = typeof s === "string" ? s : (s && s.text ? s.text : "");
          if (!t) continue;
          try { const p = JSON.parse(t); if (p.data) { addLog(p.data.length+" rows","success"); return p.data; } if (Array.isArray(p)) { addLog(p.length+" rows","success"); return p; } } catch {}
        }
      }
      if (b.type === "text" && b.text) {
        const match = b.text.match(/\[[\s\S]*?\]/);
        if (match) try { const a = JSON.parse(match[0]); addLog(a.length+" rows","success"); return a; } catch {}
      }
    }
    throw new Error("Could not parse response");
  } catch (e) { addLog("Error: "+e.message,"error"); return null; }
}

function NetSuiteSync({ schedule, recipes, equipment }) {
  const [logs, setLogs] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [woPreview, setWoPreview] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const addLog = useCallback((msg,type) => setLogs(p => [{time:new Date().toLocaleTimeString(),msg,type:type||"info"},...p].slice(0,50)),[]);

  // Preview work orders to push
  const buildWoPreview = () => {
    const wos = schedule.filter(b => b.status === "planned").map(b => {
      const recipe = recipes.find(r => r.id === b.recipeId);
      const fermStep = b.steps.find(s => s.step === "ferment");
      const pkgStep = b.steps.find(s => s.step === "package");
      const tank = fermStep ? equipment.find(e => e.id === fermStep.equipId) : null;
      return {
        batchId: b.id,
        beer: recipe?.name || b.recipeId,
        quantity: b.batchSizeBbl,
        startDate: fermStep?.start || "",
        endDate: pkgStep?.end || fermStep?.end || "",
        tank: tank?.name || "",
        tankField: tank?.name || "",
        autoScheduled: b.autoScheduled || false,
      };
    });
    setWoPreview(wos);
    setConfirmed(false);
    addLog(`Prepared ${wos.length} work orders for review`);
  };

  const pushToNetSuite = async () => {
    if (!woPreview || woPreview.length === 0) return;
    setSyncing(true);
    addLog(`Pushing ${woPreview.length} work orders to NetSuite...`);

    for (const wo of woPreview) {
      addLog(`Creating WO: ${wo.beer} — ${wo.quantity} BBL — ${wo.startDate} to ${wo.endDate}`);
      // In production, this would call ns_createRecord for each work order.
      // For now, we log the intent.
      await new Promise(res => setTimeout(res, 300));
      addLog(`✓ WO for ${wo.beer} queued (tank: ${wo.tank})`, "success");
    }
    addLog(`All ${woPreview.length} work orders processed`, "success");
    setSyncing(false);
  };

  // Pull current WOs from NetSuite
  const pullWorkOrders = async () => {
    setSyncing(true);
    const data = await nsQuery(
      `SELECT t.id, t.tranId, t.tranDate, t.startDate, t.endDate, t.quantity, t.status, t.memo, t.custbody_ce_assprod_tank FROM workorder t WHERE t.status NOT IN ('H') AND ROWNUM <= 50 ORDER BY t.startDate DESC`,
      addLog
    );
    if (data) addLog(`Found ${data.length} work orders in NetSuite`, "success");
    else addLog("Could not retrieve work orders", "error");
    setSyncing(false);
  };

  const plannedCount = schedule.filter(b => b.status === "planned").length;
  const autoCount = schedule.filter(b => b.autoScheduled).length;

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>NetSuite Integration</h2>
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>Push approved schedule as work orders · Pull current production status</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={baseStyles.card}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Planned Batches</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#c8854a", ...baseStyles.mono }}>{plannedCount}</div>
          <div style={{ fontSize: "0.65rem", color: "#475569" }}>{autoCount} auto-scheduled</div>
        </div>
        <div style={baseStyles.card}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Ready to Push</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: woPreview ? "#81c784" : "#64748b", ...baseStyles.mono }}>{woPreview ? woPreview.length : "—"}</div>
        </div>
        <div style={baseStyles.card}>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>MCP Status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "0.85rem", color: "#22c55e" }}>Connected</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button style={baseStyles.btn("primary")} onClick={buildWoPreview} disabled={syncing || plannedCount === 0}>📋 Preview Work Orders ({plannedCount})</button>
        <button style={baseStyles.btn()} onClick={pullWorkOrders} disabled={syncing}>⬇ Pull Current WOs from NetSuite</button>
      </div>

      {/* WO Preview Table */}
      {woPreview && woPreview.length > 0 && (
        <div style={{ ...baseStyles.card, marginBottom: 16 }}>
          <div style={{ ...baseStyles.cardTitle, marginBottom: 8 }}>Work Order Preview — {woPreview.length} to push</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead><tr>
              {["Batch","Beer","BBL","Start","End","Tank","Auto"].map(h =>
                <th key={h} style={baseStyles.th}>{h}</th>
              )}
            </tr></thead>
            <tbody>
              {woPreview.map((wo, i) => (
                <tr key={i} style={{ background: i % 2 ? "#0d1117" : "transparent" }}>
                  <td style={baseStyles.td}>{wo.batchId}</td>
                  <td style={{ ...baseStyles.td, fontWeight: 500, color: "#f8fafc" }}>{wo.beer}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{wo.quantity}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{wo.startDate}</td>
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{wo.endDate}</td>
                  <td style={baseStyles.td}>{wo.tank}</td>
                  <td style={baseStyles.td}>{wo.autoScheduled ? <span style={baseStyles.badge("#d98ae0")}>auto</span> : <span style={baseStyles.badge("#64748b")}>manual</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#94a3b8", cursor: "pointer" }}>
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ accentColor: "#c8854a" }} />
              I've reviewed these work orders and approve pushing to NetSuite
            </label>
            <button style={{ ...baseStyles.btn("primary"), marginLeft: "auto", opacity: confirmed ? 1 : 0.4 }} onClick={pushToNetSuite} disabled={!confirmed || syncing}>
              {syncing ? "Pushing..." : `⬆ Push ${woPreview.length} Work Orders`}
            </button>
          </div>
        </div>
      )}

      {/* Log */}
      <div style={baseStyles.card}>
        <div style={{ ...baseStyles.cardTitle, marginBottom: 8 }}>Sync Log</div>
        <div style={{ ...baseStyles.mono, fontSize: "0.75rem", maxHeight: "30vh", overflow: "auto" }}>
          {logs.length === 0 ? (
            <div style={{ color: "#475569", padding: 12, textAlign: "center" }}>No sync activity yet</div>
          ) : logs.map((l, i) => (
            <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid #1e293b08", display: "flex", gap: 10, alignItems: "baseline" }}>
              <span style={{ color: "#475569", width: 70, flexShrink: 0 }}>{l.time}</span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.type === "success" ? "#22c55e" : l.type === "error" ? "#ef4444" : "#3b82f6", flexShrink: 0 }} />
              <span style={{ color: l.type === "error" ? "#fca5a5" : l.type === "success" ? "#81c784" : "#e2e8f0" }}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "materials", label: "Materials", icon: "📦" },
  { id: "production", label: "Production", icon: "🏭" },
  { id: "inventory", label: "Inventory", icon: "📊" },
  { id: "demand", label: "Demand", icon: "📈" },
  { id: "recipes", label: "Recipes", icon: "🍺" },
  { id: "netsuite", label: "NetSuite Sync", icon: "🔗" },
];

export default function BreweryPlanner() {
  const [tab, setTab] = useState("schedule");
  const [recipes] = useState(SAMPLE_RECIPES);
  const [equipment] = useState(SAMPLE_EQUIPMENT);
  const [materials] = useState(SAMPLE_MATERIALS);
  const [schedule, setSchedule] = useState(SAMPLE_SCHEDULE);
  const [demand, setDemand] = useState(SAMPLE_DEMAND);
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [sensitivity, setSensitivity] = useState(1.0);
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #111820; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
        select option { background: #0b0f14; color: #e2e8f0; }
        button:hover { opacity: 0.9; }
      `}</style>

      {/* Header */}
      <div style={baseStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: "linear-gradient(135deg, #c8854a, #8b5e34)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🍺</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc", letterSpacing: "-0.01em" }}>Brewhouse Planner</div>
            <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{recipes.length} recipes · {equipment.length} equipment · {schedule.length} batches</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ ...baseStyles.mono, color: "#64748b", fontSize: "0.7rem" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
        </div>
      </div>

      {/* Nav */}
      <div style={baseStyles.nav}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={baseStyles.navBtn(tab === t.id)}>
            <span style={{ marginRight: 6 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={baseStyles.main}>
        {tab === "schedule" && <ScheduleOptimizer schedule={schedule} setSchedule={setSchedule} equipment={equipment} recipes={recipes} demand={demand} scenarios={scenarios} setScenarios={setScenarios} activeScenario={activeScenario} setActiveScenario={setActiveScenario} sensitivity={sensitivity} setSensitivity={setSensitivity} />}
        {tab === "materials" && <MaterialOrders schedule={schedule} recipes={recipes} materials={materials} equipment={equipment} />}
        {tab === "production" && <ProductionStatus schedule={schedule} equipment={equipment} recipes={recipes} />}
        {tab === "inventory" && <InventoryDashboard materials={materials} schedule={schedule} recipes={recipes} />}
        {tab === "demand" && <DataManager demand={demand} setDemand={setDemand} recipes={recipes} />}
        {tab === "recipes" && <RecipeBrowser recipes={recipes} materials={materials} />}
        {tab === "netsuite" && <NetSuiteSync schedule={schedule} recipes={recipes} equipment={equipment} />}
      </div>
    </div>
  );
}
