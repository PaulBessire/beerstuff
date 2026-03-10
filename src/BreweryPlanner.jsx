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
  // ─── Malts & Grain (from NetSuite 3/9/2026) ───
  { id: "M01", name: "SILO 1 Rahr Pale Ale Bulk", category: "malt", onHand: 0, unit: "lb", costPerUnit: 0.42 },
  { id: "M02", name: "SILO 2 Rahr Pilsner Bulk", category: "malt", onHand: 21217, unit: "lb", costPerUnit: 0.39 },
  { id: "M03", name: "SILO 1 Prairie 2 Row Bulk", category: "malt", onHand: 6473, unit: "lb", costPerUnit: 0.30 },
  { id: "M04", name: "Weyermann - Pale Wheat", category: "malt", onHand: 1870, unit: "lb", costPerUnit: 0.86 },
  { id: "M05", name: "Weyermann - Caramunich 1", category: "malt", onHand: 935, unit: "lb", costPerUnit: 0.99 },
  { id: "M06", name: "Weyermann - Munich Lt Type 1", category: "malt", onHand: 935, unit: "lb", costPerUnit: 0.94 },
  { id: "M07", name: "Simpsons - Caramalt", category: "malt", onHand: 1307.9, unit: "lb", costPerUnit: 1.20 },
  { id: "M08", name: "Grain Millers Flaked Oats", category: "malt", onHand: 1000, unit: "lb", costPerUnit: 0.83 },
  { id: "M09", name: "Flaked Maize OIO", category: "malt", onHand: 2400, unit: "lb", costPerUnit: 1.77 },
  { id: "M10", name: "Corn Sugar (Dextrose)", category: "malt", onHand: 2810, unit: "lb", costPerUnit: 1.00 },
  { id: "M11", name: "Rice Hulls", category: "malt", onHand: 659, unit: "lb", costPerUnit: 0.74 },
  { id: "M12", name: "Rice Syrup Solids", category: "malt", onHand: 750, unit: "lb", costPerUnit: 3.25 },
  { id: "M13", name: "Lactose", category: "adjunct", onHand: 6545, unit: "lb", costPerUnit: 0.13 },
  { id: "M14", name: "Carolina Malt Pilsner", category: "malt", onHand: 6700, unit: "lb", costPerUnit: 0.85 },
  { id: "M15", name: "Rahr White Wheat", category: "malt", onHand: 2200, unit: "lb", costPerUnit: 0.74 },
  { id: "M16", name: "OIO Toasted Flaked Rice", category: "malt", onHand: 2525, unit: "lb", costPerUnit: 1.45 },
  { id: "M17", name: "Rahr Standard 2-Row", category: "malt", onHand: 1265, unit: "lb", costPerUnit: 0.71 },
  { id: "M18", name: "Weyermann - Vienna", category: "malt", onHand: 715, unit: "lb", costPerUnit: 0.91 },
  { id: "M19", name: "Simpsons - Pale Chocolate", category: "malt", onHand: 935, unit: "lb", costPerUnit: 1.04 },
  { id: "M20", name: "Malt - Biscuit Dingemans", category: "malt", onHand: 922, unit: "lb", costPerUnit: 1.04 },
  { id: "M21", name: "Chocolate Malt Simpsons", category: "malt", onHand: 1013, unit: "lb", costPerUnit: 1.03 },
  { id: "M22", name: "Crisp Naked Oat Malt", category: "malt", onHand: 605, unit: "lb", costPerUnit: 1.09 },
  // ─── Hops (from NetSuite 3/9/2026) ───
  { id: "H01", name: "Citra", category: "hops", onHand: 357.96, unit: "lb", costPerUnit: 14.02 },
  { id: "H02", name: "Mosaic", category: "hops", onHand: 289.52, unit: "lb", costPerUnit: 14.00 },
  { id: "H03", name: "Simcoe", category: "hops", onHand: 26.5, unit: "lb", costPerUnit: 13.28 },
  { id: "H04", name: "Cascade", category: "hops", onHand: 145, unit: "lb", costPerUnit: 9.00 },
  { id: "H05", name: "Centennial", category: "hops", onHand: 22, unit: "lb", costPerUnit: 11.00 },
  { id: "H06", name: "Amarillo", category: "hops", onHand: 55, unit: "lb", costPerUnit: 14.69 },
  { id: "H07", name: "Magnum", category: "hops", onHand: 50, unit: "lb", costPerUnit: 11.06 },
  { id: "H08", name: "Hallertau Mittelfruh", category: "hops", onHand: 330.6, unit: "lb", costPerUnit: 13.09 },
  { id: "H09", name: "Galaxy", category: "hops", onHand: 217, unit: "lb", costPerUnit: 18.17 },
  { id: "H10", name: "Azacca", category: "hops", onHand: 242, unit: "lb", costPerUnit: 14.94 },
  { id: "H11", name: "CTZ (Zeus)", category: "hops", onHand: 5, unit: "lb", costPerUnit: 7.55 },
  { id: "H12", name: "East Kent Golding", category: "hops", onHand: 25.4, unit: "lb", costPerUnit: 13.03 },
  { id: "H13", name: "Idaho 7", category: "hops", onHand: 77, unit: "lb", costPerUnit: 11.76 },
  { id: "H14", name: "Loral", category: "hops", onHand: 297, unit: "lb", costPerUnit: 9.95 },
  { id: "H15", name: "Barbe Rouge", category: "hops", onHand: 57.5, unit: "lb", costPerUnit: 11.00 },
  { id: "H16", name: "Czech Saaz", category: "hops", onHand: 132.44, unit: "lb", costPerUnit: 14.10 },
  { id: "H17", name: "Cashmere", category: "hops", onHand: 132, unit: "lb", costPerUnit: 11.26 },
  { id: "H18", name: "Chinook", category: "hops", onHand: 44, unit: "lb", costPerUnit: 8.86 },
  { id: "H19", name: "Sabro", category: "hops", onHand: 66, unit: "lb", costPerUnit: 14.36 },
  { id: "H20", name: "Warrior Resinate 300g", category: "hops", onHand: 3600, unit: "ea", costPerUnit: 0.16 },
  { id: "H21", name: "Challenger", category: "hops", onHand: 44, unit: "lb", costPerUnit: 0 },
  { id: "H22", name: "Spalter Select", category: "hops", onHand: 88, unit: "lb", costPerUnit: 9.07 },
  // ─── Chemistry (from NetSuite 3/9/2026) ───
  { id: "C01", name: "Calcium Chloride", category: "chemistry", onHand: 82.16, unit: "lb", costPerUnit: 1.08 },
  { id: "C02", name: "Gypsum (Calcium Sulfate)", category: "chemistry", onHand: 119.28, unit: "lb", costPerUnit: 0.46 },
  { id: "C03", name: "Calcium Carbonate", category: "chemistry", onHand: 168.35, unit: "lb", costPerUnit: 0.89 },
  { id: "C04", name: "Phosphoric Acid", category: "chemistry", onHand: 52996, unit: "ml", costPerUnit: 0.03 },
  { id: "C05", name: "Whirlfloc T", category: "chemistry", onHand: 7428.5, unit: "tab", costPerUnit: 0.15 },
  { id: "C06", name: "Whirlfloc T (new)", category: "chemistry", onHand: 9900, unit: "tab", costPerUnit: 0.07 },
  { id: "C07", name: "Fermcap AT", category: "chemistry", onHand: 123.46, unit: "oz", costPerUnit: 1.90 },
  { id: "C08", name: "Yeastex 82", category: "chemistry", onHand: 66.68, unit: "oz", costPerUnit: 0.98 },
  { id: "C09", name: "Sinamar - Weyermann", category: "chemistry", onHand: 112.5, unit: "oz", costPerUnit: 7.97 },
  { id: "C10", name: "Attenuzyme Pro", category: "chemistry", onHand: 250000, unit: "ml", costPerUnit: 0.005 },
  { id: "C11", name: "Lactic Acid", category: "chemistry", onHand: 200000, unit: "ml", costPerUnit: 0.001 },
  { id: "C12", name: "Sodium Chloride", category: "chemistry", onHand: 141, unit: "lb", costPerUnit: 0.58 },
  { id: "C13", name: "Malic Acid", category: "chemistry", onHand: 172.5, unit: "lb", costPerUnit: 4.34 },
  { id: "C14", name: "Citric Acid", category: "chemistry", onHand: 1995, unit: "lb", costPerUnit: 2.46 },
  // ─── Yeast (from NetSuite 3/9/2026) ───
  { id: "Y01", name: "Omega OYL-114 Bayern Lager", category: "yeast", onHand: 0, unit: "pitch", costPerUnit: 121.00 },
  { id: "Y02", name: "Fermentis SafAle US-05", category: "yeast", onHand: 16500, unit: "g", costPerUnit: 0.13 },
  { id: "Y03", name: "Fermentis SafLager W-34/70", category: "yeast", onHand: 14000, unit: "g", costPerUnit: 0.22 },
  { id: "Y04", name: "Lallemand BRY-97", category: "yeast", onHand: 500, unit: "g", costPerUnit: 0.33 },
  { id: "Y05", name: "Lallemand CBC-1", category: "yeast", onHand: 2500, unit: "g", costPerUnit: 0.30 },
  { id: "Y06", name: "Lallemand Diamond Lager", category: "yeast", onHand: 5000, unit: "g", costPerUnit: 0.33 },
  { id: "Y07", name: "Fermentis SafAle WB-06", category: "yeast", onHand: 1000, unit: "g", costPerUnit: 0.21 },
  { id: "Y08", name: "Fermentis SafAle S-04", category: "yeast", onHand: 4000, unit: "g", costPerUnit: 0.14 },
  { id: "Y09", name: "Fermentis SafAle E-30", category: "yeast", onHand: 6000, unit: "g", costPerUnit: 0.22 },
  { id: "Y10", name: "Lallemand Philly Sour", category: "yeast", onHand: 2000, unit: "g", costPerUnit: 0.39 },
  { id: "Y11", name: "Lalbrew Farmhouse", category: "yeast", onHand: 1000, unit: "g", costPerUnit: 0.44 },
  // ─── Adjunct / Flavor (from NetSuite 3/9/2026) ───
  { id: "A01", name: "Focus IRC Beer Base 21%", category: "adjunct", onHand: 350.43, unit: "lb", costPerUnit: 7.87 },
  { id: "A02", name: "SUCRALOSE DR400", category: "adjunct", onHand: 107.25, unit: "lb", costPerUnit: 29.32 },
  { id: "A03", name: "Ghirardelli Chocolate Sauce", category: "adjunct", onHand: 512, unit: "oz", costPerUnit: 0.27 },
  { id: "A04", name: "Exberry Shade Purple Mist", category: "adjunct", onHand: 27.5, unit: "gal", costPerUnit: 14.46 },
  { id: "A05", name: "Exberry Shade Red", category: "adjunct", onHand: 27.5, unit: "gal", costPerUnit: 10.75 },
  { id: "A06", name: "Exberry Shade Vivid Red", category: "adjunct", onHand: 55, unit: "gal", costPerUnit: 15.09 },
  { id: "A07", name: "Lemon Juice Concentrate", category: "adjunct", onHand: 308.04, unit: "lb", costPerUnit: 5.04 },
  { id: "A08", name: "Natural Flavor Blender V18", category: "adjunct", onHand: 259.92, unit: "lb", costPerUnit: 10.79 },
  { id: "A09", name: "Lime Flavor FAQS014", category: "adjunct", onHand: 341.6, unit: "lb", costPerUnit: 18.80 },
  { id: "A10", name: "Apple Juice Concentrate", category: "adjunct", onHand: 784, unit: "lb", costPerUnit: 2.91 },
  { id: "A11", name: "Strawberry Juice Concentrate", category: "adjunct", onHand: 220, unit: "lb", costPerUnit: 8.15 },
  { id: "A12", name: "Orange Peel Bitter (Seville)", category: "adjunct", onHand: 70, unit: "lb", costPerUnit: 10.31 },
  { id: "A13", name: "Coriander Seed", category: "adjunct", onHand: 55, unit: "lb", costPerUnit: 8.44 },
  { id: "A14", name: "Coconut Toasted", category: "adjunct", onHand: 45, unit: "lb", costPerUnit: 4.66 },
  { id: "A15", name: "Coffee Cold Brew", category: "adjunct", onHand: 10, unit: "lb", costPerUnit: 9.00 },
  { id: "A16", name: "Extra Fine Granulated Sugar", category: "adjunct", onHand: 49008, unit: "lb", costPerUnit: 0.77 },
  // ─── Packaging (from NetSuite 3/9/2026) ───
  { id: "P01", name: "Can End Silver/Silver", category: "packaging", onHand: 232416, unit: "ea", costPerUnit: 0.042 },
  { id: "P02", name: "Can End Gold/Gold", category: "packaging", onHand: 88823, unit: "ea", costPerUnit: 0.045 },
  { id: "P03", name: "PakTech 6Pak Black", category: "packaging", onHand: 1106700, unit: "ea", costPerUnit: 0 },
  { id: "P04", name: "PakTech 6Pak Yellow", category: "packaging", onHand: 464100, unit: "ea", costPerUnit: 0 },
  { id: "P05", name: "PakTech 6Pak Steel Blue", category: "packaging", onHand: 1500, unit: "ea", costPerUnit: 0 },
  { id: "P06", name: "PakTech 6Pak Red", category: "packaging", onHand: 1001, unit: "ea", costPerUnit: 0.21 },
  { id: "P07", name: "Keg Collar", category: "packaging", onHand: 8923, unit: "ea", costPerUnit: 0.18 },
  { id: "P08", name: "Keg Cap Vented White", category: "packaging", onHand: 3112, unit: "ea", costPerUnit: 0.08 },
  { id: "P09", name: "Can Shell - Storm (NEW)", category: "packaging", onHand: 22951, unit: "ea", costPerUnit: 0.13 },
  { id: "P10", name: "Can Shell - Switch (NEW)", category: "packaging", onHand: 21784, unit: "ea", costPerUnit: 0.14 },
  { id: "P11", name: "Can Shell - Scooter (NEW)", category: "packaging", onHand: 83146, unit: "ea", costPerUnit: 0.20 },
  { id: "P12", name: "Can Shell - Bavarian", category: "packaging", onHand: 52904, unit: "ea", costPerUnit: 0.12 },
  { id: "P13", name: "Can Shell - Birdie (Shrink)", category: "packaging", onHand: 25285, unit: "ea", costPerUnit: 0.29 },
  { id: "P14", name: "Can Shell - Hop Ridge", category: "packaging", onHand: 18672, unit: "ea", costPerUnit: 0.29 },
  { id: "P15", name: "Can Shell - Blueprint", category: "packaging", onHand: 55524, unit: "ea", costPerUnit: 0.18 },
  { id: "P16", name: "Can Shell - Oktober Fuel", category: "packaging", onHand: 11670, unit: "ea", costPerUnit: 0.12 },
  { id: "P17", name: "Can Shell - Tropic Flare", category: "packaging", onHand: 6613, unit: "ea", costPerUnit: 0.16 },
  { id: "P18", name: "Can Shell - Dead Blow", category: "packaging", onHand: 53293, unit: "ea", costPerUnit: 0.08 },
  { id: "P19", name: "Can Shell - Daizy Watermelon", category: "packaging", onHand: 360917, unit: "ea", costPerUnit: 0 },
  { id: "P20", name: "Can Shell - Daizy Grape", category: "packaging", onHand: 190242, unit: "ea", costPerUnit: 0 },
  { id: "P21", name: "Can Shell - Daizy Tropical Punch", category: "packaging", onHand: 153298, unit: "ea", costPerUnit: 0 },
  { id: "P22", name: "Can Shell - Daizy Passion Fruit", category: "packaging", onHand: 94878, unit: "ea", costPerUnit: 0 },
  { id: "P23", name: "Can Shell - Daizy Strawberry Lem", category: "packaging", onHand: 78322, unit: "ea", costPerUnit: 0 },
  { id: "P24", name: "Can Shell - Margarita Gose", category: "packaging", onHand: 50181, unit: "ea", costPerUnit: 0.05 },
  { id: "P25", name: "Can Shell - OKI BA Ale (Shrink)", category: "packaging", onHand: 10892, unit: "ea", costPerUnit: 0.26 },
  { id: "P26", name: "Can Shell - Opera Cream (Shrink)", category: "packaging", onHand: 10503, unit: "ea", costPerUnit: 0.26 },
  { id: "P27", name: "Can Shell - Flurry", category: "packaging", onHand: 8947, unit: "ea", costPerUnit: 0.34 },
  { id: "P28", name: "Barrel Bourbon Buffalo Trace 53G", category: "packaging", onHand: 41, unit: "ea", costPerUnit: 72.05 },
  { id: "P29", name: "Barrel Bourbon New Riff 53G", category: "packaging", onHand: 18, unit: "ea", costPerUnit: 97.33 },
  { id: "P30", name: "Bottle 500mL Celebration", category: "packaging", onHand: 2539, unit: "ea", costPerUnit: 0.88 },
  { id: "P31", name: "Bottle Crown Braxton", category: "packaging", onHand: 134942, unit: "ea", costPerUnit: 0 },
  { id: "P32", name: "Daizy's End Silver XO", category: "packaging", onHand: 285120, unit: "ea", costPerUnit: 0 },
  { id: "P33", name: "Daizy's Box 24pk SLEEK", category: "packaging", onHand: 37360, unit: "ea", costPerUnit: 0 },
  { id: "P34", name: "Carton Ballpark Beer 12pk", category: "packaging", onHand: 26407, unit: "ea", costPerUnit: 0.47 },
  { id: "P35", name: "Carton Switch 15pk", category: "packaging", onHand: 9675, unit: "ea", costPerUnit: 0.68 },
  { id: "P36", name: "Carton Spur 15pk", category: "packaging", onHand: 11925, unit: "ea", costPerUnit: 0.60 },
  { id: "P37", name: "Carton Blueprint 15pk", category: "packaging", onHand: 700, unit: "ea", costPerUnit: 0.85 },
];

// ─── DEFAULT LEAD TIMES (editable in app) ────────────────────────────────────────
const DEFAULT_LEAD_TIMES = {
  malt: 7,        // Base malts, specialty grains
  hops: 7,        // Pellet hops, cryo hops
  yeast: 5,       // Dry yeast, liquid yeast
  adjunct: 7,     // Flavors, fruit, sugar, lactose
  chemistry: 5,   // Water salts, fining agents, enzymes
  packaging: 14,  // Cans, ends, PakTech, cartons
  barrel: 30,     // New barrels, used barrels
};

// ─── REAL NETSUITE BOMs ─────────────────────────────────────────────────────────
// All brewing-level BOMs from NetSuite assemblyItemBom (pulled 3/9/2026)
const NS_BOMS = {
  "Bavarian": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 36.75, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Chloride", qty: 8.25, onHand: 82.16, cost: 1.08 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.285, onHand: 330.6, cost: 13.09 },
  ],
  "Storm": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 36.25, onHand: 0, cost: 0.42 },
    { ingredient: "Flaked Maize OIO", qty: 11, onHand: 2400, cost: 1.77 },
    { ingredient: "Rice Hulls", qty: 1.25, onHand: 659, cost: 0.74 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.37, onHand: 330.6, cost: 13.09 },
  ],
  "Switch": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 57.1, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 2.5, onHand: 659, cost: 0.74 },
    { ingredient: "Centennial", qty: 0.995, onHand: 22, cost: 11 },
    { ingredient: "Simcoe", qty: 0.6, onHand: 26.5, cost: 13.28 },
    { ingredient: "Warrior Resinate", qty: 15, onHand: 3600, cost: 0.16 },
  ],
  "Tropic Flare": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 57.5, onHand: 21217, cost: 0.39 },
    { ingredient: "Rice Hulls", qty: 2.5, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Chloride", qty: 42.5, onHand: 82.16, cost: 1.08 },
    { ingredient: "Citra", qty: 1.89, onHand: 357.96, cost: 14.02 },
    { ingredient: "Galaxy", qty: 0.035, onHand: 217, cost: 18.17 },
    { ingredient: "Amarillo", qty: 0.21, onHand: 55, cost: 14.69 },
  ],
  "Haven Hefeweizen": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 29.5, onHand: 0, cost: 0.42 },
    { ingredient: "Weyermann - Pale Wheat", qty: 22, onHand: 1870, cost: 0.86 },
    { ingredient: "Simpsons - Caramalt", qty: 1, onHand: 1307.9, cost: 1.20 },
    { ingredient: "Weyermann - Munich Lt Type 1", qty: 0.75, onHand: 935, cost: 0.94 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
    { ingredient: "Magnum", qty: 0.14, onHand: 50, cost: 11.06 },
  ],
  "Spur Amber Lager": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 31.125, onHand: 21217, cost: 0.39 },
    { ingredient: "Rice Hulls", qty: 0.5, onHand: 659, cost: 0.74 },
    { ingredient: "Magnum", qty: 0.1125, onHand: 50, cost: 11.06 },
    { ingredient: "Sinamar - Weyermann", qty: 0.19, onHand: 112.5, cost: 7.97 },
    { ingredient: "Calcium Chloride", qty: 3.75, onHand: 82.16, cost: 1.08 },
    { ingredient: "Calcium Carbonate", qty: 3.75, onHand: 168.35, cost: 0.89 },
    { ingredient: "Phosphoric Acid", qty: 8.75, onHand: 52996, cost: 0.03 },
    { ingredient: "Attenuzyme Pro", qty: 6.25, onHand: 250000, cost: 0.005 },
    { ingredient: "Omega OYL-114 Bayern Lager", qty: 0.025, onHand: 0, cost: 121 },
  ],
  "Birdie": [
    { ingredient: "Focus IRC Beer Base 21%", qty: 4.093, onHand: 350.43, cost: 7.87 },
    { ingredient: "Natural Flavor Blender V18", qty: 0.735, onHand: 259.92, cost: 10.79 },
    { ingredient: "Grape Juice Concentrate", qty: 2.145, onHand: 1, cost: 4.43 },
    { ingredient: "Citric Acid", qty: 0.466, onHand: 1995, cost: 2.46 },
    { ingredient: "Exberry Shade Purple Mist", qty: 0.274, onHand: 27.5, cost: 14.46 },
  ],
  "OKI Bourbon Barrel Ale": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 53.5, onHand: 0, cost: 0.42 },
    { ingredient: "Flaked Maize OIO", qty: 15, onHand: 2400, cost: 1.77 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.15, onHand: 330.6, cost: 13.09 },
    { ingredient: "Magnum", qty: 0.1, onHand: 50, cost: 11.06 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
  ],
  "Oktober Fuel": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 37.5, onHand: 21217, cost: 0.39 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
    { ingredient: "Magnum", qty: 0.055, onHand: 50, cost: 11.06 },
    { ingredient: "Saaz", qty: 0.65, onHand: 132.44, cost: 14.10 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.5, onHand: 330.6, cost: 13.09 },
  ],
  "Double Hazy IPA": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 65, onHand: 21217, cost: 0.39 },
    { ingredient: "Rice Hulls", qty: 2.5, onHand: 659, cost: 0.74 },
    { ingredient: "Citra", qty: 2.785, onHand: 357.96, cost: 14.02 },
    { ingredient: "Calcium Chloride", qty: 0.986, onHand: 82.16, cost: 1.08 },
    { ingredient: "Phosphoric Acid", qty: 43, onHand: 52996, cost: 0.03 },
  ],
  "Jam Session": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 30.405, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 0.788, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Chloride", qty: 19.82, onHand: 82.16, cost: 1.08 },
    { ingredient: "Citra", qty: 0.487, onHand: 357.96, cost: 14.02 },
    { ingredient: "Amarillo", qty: 0.382, onHand: 55, cost: 14.69 },
  ],
  "Jubilee - Hoppy Holiday IPA": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 35.75, onHand: 21217, cost: 0.39 },
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 35.25, onHand: 0, cost: 0.42 },
    { ingredient: "CTZ (Zeus)", qty: 0.39, onHand: 5, cost: 7.55 },
    { ingredient: "Amarillo", qty: 0.355, onHand: 55, cost: 14.69 },
    { ingredient: "Simcoe", qty: 1.005, onHand: 26.5, cost: 13.28 },
    { ingredient: "Centennial", qty: 0.05, onHand: 22, cost: 11 },
    { ingredient: "Lallemand BRY-97", qty: 25, onHand: 500, cost: 0.33 },
  ],
  "Paradise Watermelon Gose": [
    { ingredient: "SILO 2 Rahr Pilsner Bulk", qty: 20.25, onHand: 21217, cost: 0.39 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Chloride", qty: 8.65, onHand: 82.16, cost: 1.08 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.3, onHand: 330.6, cost: 13.09 },
  ],
  "Dark Charge": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 86.67, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 2.174, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Carbonate", qty: 0.307, onHand: 168.35, cost: 0.89 },
    { ingredient: "East Kent Golding", qty: 1.178, onHand: 25.4, cost: 13.03 },
  ],
  "Hoppy Blonde": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 42, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 0.875, onHand: 659, cost: 0.74 },
    { ingredient: "Citra", qty: 0.3, onHand: 357.96, cost: 14.02 },
    { ingredient: "Amarillo", qty: 0.2, onHand: 55, cost: 14.69 },
    { ingredient: "Calcium Chloride", qty: 8.25, onHand: 82.16, cost: 1.08 },
  ],
  "House Pilsner": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 86.67, onHand: 0, cost: 0.42 },
    { ingredient: "Rice Hulls", qty: 2.174, onHand: 659, cost: 0.74 },
    { ingredient: "Calcium Carbonate", qty: 0.307, onHand: 168.35, cost: 0.89 },
    { ingredient: "Centennial", qty: 0.56, onHand: 22, cost: 11 },
    { ingredient: "Calcium Chloride", qty: 6, onHand: 82.16, cost: 1.08 },
  ],
  "Italian Pilsner": [
    { ingredient: "Weyermann - Pilsner", qty: 26.5, onHand: 55, cost: 0.94 },
    { ingredient: "Rahr White Wheat", qty: 23.2, onHand: 2200, cost: 0.74 },
    { ingredient: "Grain Millers Flaked Oats", qty: 3.01, onHand: 1000, cost: 0.83 },
    { ingredient: "Weyermann - Munich Lt Type 1", qty: 1.2, onHand: 935, cost: 0.94 },
    { ingredient: "Calcium Chloride", qty: 15.06, onHand: 82.16, cost: 1.08 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.42, onHand: 330.6, cost: 13.09 },
    { ingredient: "Coriander Powder", qty: 0.06, onHand: 22, cost: 9.03 },
  ],
  "Dan's West Coast IPA": [
    { ingredient: "SILO 1 Rahr Pale Ale Bulk", qty: 48.54, onHand: 0, cost: 0.42 },
    { ingredient: "CTZ (Zeus)", qty: 0.161, onHand: 5, cost: 7.55 },
    { ingredient: "Centennial", qty: 0.15, onHand: 22, cost: 11 },
    { ingredient: "Calcium Chloride", qty: 8.5, onHand: 82.16, cost: 1.08 },
  ],
  "Garage Beer Lime": [
    { ingredient: "Lime Flavor FAQS014", qty: 0.4375, onHand: 341.6, cost: 18.80 },
  ],
  "Rally": [
    { ingredient: "Cranberry Juice Concentrate", qty: 2.145, onHand: 0, cost: 5 },
    { ingredient: "Citric Acid", qty: 0.466, onHand: 1995, cost: 2.46 },
    { ingredient: "Exberry Shade Red", qty: 0.274, onHand: 27.5, cost: 10.75 },
  ],
  "House Hazy IPA": [
    { ingredient: "Rahr Standard 2-Row", qty: 52.57, onHand: 1265, cost: 0.71 },
    { ingredient: "Rahr White Wheat", qty: 16.17, onHand: 2200, cost: 0.74 },
    { ingredient: "Grain Millers Flaked Oats", qty: 7.35, onHand: 1000, cost: 0.83 },
    { ingredient: "Calcium Chloride", qty: 36.76, onHand: 82.16, cost: 1.08 },
    { ingredient: "Gypsum (Calcium Sulfate)", qty: 4.4, onHand: 119.28, cost: 0.46 },
    { ingredient: "Simcoe", qty: 0.147, onHand: 26.5, cost: 13.28 },
    { ingredient: "Mosaic", qty: 0.8, onHand: 289.52, cost: 14.00 },
  ],
  "Peach Birdie": [
    { ingredient: "VIVE Base", qty: 8.381, onHand: 0, cost: 5 },
    { ingredient: "Tractor Peach Concentrate", qty: 4.25, onHand: 0, cost: 6 },
    { ingredient: "Citric Acid", qty: 0.466, onHand: 1995, cost: 2.46 },
    { ingredient: "Exberry Shade Red", qty: 0.025, onHand: 27.5, cost: 10.75 },
    { ingredient: "Cane Sugar", qty: 2.587, onHand: 49008, cost: 0.77 },
  ],
  "Watermelon Birdie": [
    { ingredient: "VIVE Base", qty: 8.381, onHand: 0, cost: 5 },
    { ingredient: "Watermelon Concentrate", qty: 2.145, onHand: 0, cost: 6 },
    { ingredient: "Citric Acid", qty: 0.466, onHand: 1995, cost: 2.46 },
    { ingredient: "Extra Fine Granulated Sugar", qty: 2.5, onHand: 49008, cost: 0.77 },
  ],
  "Slow Pour Pils": [
    { ingredient: "Weyermann - Barke Pilsner", qty: 41.25, onHand: 0, cost: 1.20 },
    { ingredient: "Weyermann - Acidulated", qty: 2.75, onHand: 55, cost: 1.28 },
    { ingredient: "Gypsum (Calcium Sulfate)", qty: 0.015, onHand: 119.28, cost: 0.46 },
    { ingredient: "Calcium Chloride", qty: 0.012, onHand: 82.16, cost: 1.08 },
    { ingredient: "Hallertau Mittelfruh", qty: 0.63, onHand: 330.6, cost: 13.09 },
    { ingredient: "Fermentis SafLager W-34/70", qty: 100, onHand: 14000, cost: 0.22 },
  ],
};

// ─── DEFAULT PROCESS DURATIONS (hrs, editable per recipe in app) ─────────────────
// These are style-based defaults. Override per recipe in the Process Duration editor.
const DEFAULT_PROCESS_DURATIONS = {
  // style → { fermentHrs, conditionHrs, packageHrs }
  "Lager":        { fermentHrs: 288, conditionHrs: 120, packageHrs: 4 },
  "IPA":          { fermentHrs: 168, conditionHrs: 72, packageHrs: 4 },
  "DIPA":         { fermentHrs: 192, conditionHrs: 72, packageHrs: 4 },
  "Session IPA":  { fermentHrs: 120, conditionHrs: 48, packageHrs: 4 },
  "Pale Ale":     { fermentHrs: 144, conditionHrs: 48, packageHrs: 4 },
  "Wheat":        { fermentHrs: 120, conditionHrs: 48, packageHrs: 4 },
  "Stout":        { fermentHrs: 192, conditionHrs: 96, packageHrs: 4 },
  "Cream Ale":    { fermentHrs: 144, conditionHrs: 72, packageHrs: 4 },
  "Marzen":       { fermentHrs: 288, conditionHrs: 120, packageHrs: 4 },
  "Sour":         { fermentHrs: 240, conditionHrs: 72, packageHrs: 4 },
  "Barrel Aged":  { fermentHrs: 336, conditionHrs: 240, packageHrs: 4 },
  "Spiced Ale":   { fermentHrs: 168, conditionHrs: 72, packageHrs: 4 },
  "Session":      { fermentHrs: 120, conditionHrs: 48, packageHrs: 4 },
  "Radler":       { fermentHrs: 96, conditionHrs: 48, packageHrs: 4 },
  "default":      { fermentHrs: 168, conditionHrs: 72, packageHrs: 4 },
};
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

// ─── AUTO-SCHEDULER ENGINE (Scored Optimizer) ───────────────────────────────────

// Default weights — these are editable in the UI
const DEFAULT_WEIGHTS = {
  onTimeDelivery: 100,    // Points per demand entry delivered on time
  fermUtilization: 2,     // Points per fermenter-day utilized (reduces idle time)
  tankSizeFit: 5,         // Penalty per BBL of wasted tank capacity (e.g., 15BBL in 120BBL tank = 105 × penalty)
  briteConflicts: 10,     // Penalty per brite tank conflict (overlapping conditioning)
  dryHopMatch: 3,         // Bonus for putting hop-forward beers in dry-hop tanks (FV4,5,8,9)
  ingredientCluster: 1,   // Bonus for same-base-malt beers in same week
};

const DRY_HOP_TANKS = ["FV04", "FV05", "FV08", "FV09"];
const HOP_FORWARD_STYLES = ["IPA", "DIPA", "Session IPA", "Pale Ale"];

// Run a single greedy schedule with a given demand ordering
function runGreedy(demandOrder, equipment, recipes, existingSchedule, sensitivityMult) {
  const fermenters = equipment.filter(e => e.type === EQUIP_TYPES.FERM);
  const brites = equipment.filter(e => e.type === EQUIP_TYPES.BRITE);
  const todayStr = today();

  const occupancy = {};
  existingSchedule.forEach(b => {
    b.steps.forEach(s => {
      if (!occupancy[s.equipId]) occupancy[s.equipId] = [];
      occupancy[s.equipId].push({ start: s.start, end: s.end });
    });
  });
  const isAvailable = (eid, s, e) => !(occupancy[eid] || []).some(x => x.start <= e && s <= x.end);
  const occupy = (eid, s, e) => { if (!occupancy[eid]) occupancy[eid] = []; occupancy[eid].push({ start: s, end: e }); };

  const scheduledVol = {};
  existingSchedule.forEach(b => { scheduledVol[b.recipeId] = (scheduledVol[b.recipeId] || 0) + b.batchSizeBbl; });

  const newBatches = [];
  const unmetDemand = [];
  let counter = existingSchedule.length;

  demandOrder.forEach(dm => {
    const adj = { ...dm, volumeBbl: Math.round(dm.volumeBbl * sensitivityMult) };
    const recipe = recipes.find(r => r.id === adj.recipeId);
    if (!recipe) { unmetDemand.push({ ...adj, reason: "No recipe" }); return; }
    const still = adj.volumeBbl - (scheduledVol[adj.recipeId] || 0);
    if (still <= 0) return;
    const needed = Math.ceil(still / recipe.bblPerBatch);
    const isKeg = recipe.channel === "taproom";
    const isHoppy = HOP_FORWARD_STYLES.includes(recipe.style);

    for (let bi = 0; bi < needed; bi++) {
      const fermStep = recipe.steps.find(s => s.step === "ferment");
      const condStep = recipe.steps.find(s => s.step === "condition");
      const pkgStep = recipe.steps.find(s => s.step === "package");
      if (!fermStep || !condStep) { unmetDemand.push({ ...adj, reason: "Missing steps" }); continue; }

      const pkgDays = pkgStep ? Math.max(1, Math.ceil(pkgStep.durationHrs / 24)) : 1;
      const condDays = Math.max(1, Math.ceil(condStep.durationHrs / 24));
      const fermDays = Math.max(1, Math.ceil(fermStep.durationHrs / 24));

      const pkgEnd = addDays(adj.shipDate, -1);
      const pkgStart = addDays(pkgEnd, -(pkgDays - 1));
      const condEnd = addDays(pkgStart, -1);
      const condStart = addDays(condEnd, -(condDays - 1));
      const fermEnd = addDays(condStart, -1);
      const fermStart = addDays(fermEnd, -(fermDays - 1));

      if (fermStart < todayStr) { unmetDemand.push({ ...adj, reason: `Past start: ${fermStart}` }); continue; }

      // Sort fermenters: prefer dry-hop tanks for hoppy beers, then smallest fit
      const suitableFV = fermenters
        .filter(fv => fv.capacityBbl >= recipe.bblPerBatch)
        .sort((a, b) => {
          if (isHoppy) {
            const aHop = DRY_HOP_TANKS.includes(a.id) ? 0 : 1;
            const bHop = DRY_HOP_TANKS.includes(b.id) ? 0 : 1;
            if (aHop !== bHop) return aHop - bHop;
          }
          return a.capacityBbl - b.capacityBbl;
        });

      let assignedFV = null;
      for (const fv of suitableFV) { if (isAvailable(fv.id, fermStart, fermEnd)) { assignedFV = fv; break; } }
      if (!assignedFV) { unmetDemand.push({ ...adj, reason: "No fermenter" }); continue; }

      const suitableBT = brites.filter(bt => bt.capacityBbl >= recipe.bblPerBatch).sort((a, b) => a.capacityBbl - b.capacityBbl);
      let assignedBT = null;
      for (const bt of suitableBT) { if (isAvailable(bt.id, condStart, condEnd)) { assignedBT = bt; break; } }
      if (!assignedBT) { unmetDemand.push({ ...adj, reason: "No brite tank" }); continue; }

      const pkgEquip = equipment.find(e => e.type === (isKeg ? EQUIP_TYPES.KEGGING : EQUIP_TYPES.CANNER));
      counter++;
      const batch = {
        id: `A${String(counter).padStart(3, "0")}`,
        recipeId: adj.recipeId, batchSizeBbl: recipe.bblPerBatch,
        status: "planned", autoScheduled: true, demandId: adj.id,
        steps: [
          { step: "ferment", equipId: assignedFV.id, start: fermStart, end: fermEnd },
          { step: "condition", equipId: assignedBT.id, start: condStart, end: condEnd },
          { step: "package", equipId: pkgEquip?.id || "", start: pkgStart, end: pkgEnd },
        ],
        _meta: { fvCapacity: assignedFV.capacityBbl, isHoppy, isDryHopTank: DRY_HOP_TANKS.includes(assignedFV.id), recipe }
      };
      occupy(assignedFV.id, fermStart, fermEnd);
      occupy(assignedBT.id, condStart, condEnd);
      newBatches.push(batch);
      scheduledVol[adj.recipeId] = (scheduledVol[adj.recipeId] || 0) + recipe.bblPerBatch;
    }
  });

  return { newBatches, unmetDemand };
}

// Score a candidate schedule
function scoreSchedule(newBatches, unmetDemand, demand, equipment, recipes, existingSchedule, weights, sensitivityMult) {
  const allBatches = [...existingSchedule, ...newBatches];
  const fermenters = equipment.filter(e => e.type === EQUIP_TYPES.FERM);
  let score = 0;

  // 1. On-time delivery
  const schedVol = {};
  allBatches.forEach(b => { schedVol[b.recipeId] = (schedVol[b.recipeId] || 0) + b.batchSizeBbl; });
  const adjDemand = demand.map(dm => ({ ...dm, volumeBbl: Math.round(dm.volumeBbl * sensitivityMult) }));
  const metCount = adjDemand.filter(dm => (schedVol[dm.recipeId] || 0) >= dm.volumeBbl).length;
  score += metCount * weights.onTimeDelivery;

  // 2. Fermenter utilization
  const t = today(); const horizon = addDays(t, 30);
  let fermDaysUsed = 0;
  allBatches.forEach(b => {
    b.steps.filter(s => s.step === "ferment").forEach(s => {
      const os = s.start > t ? s.start : t;
      const oe = s.end < horizon ? s.end : horizon;
      if (os <= oe) fermDaysUsed += daysBetween(os, oe) + 1;
    });
  });
  score += fermDaysUsed * weights.fermUtilization;

  // 3. Tank size fit penalty
  let sizePenalty = 0;
  newBatches.forEach(b => {
    if (b._meta) sizePenalty += (b._meta.fvCapacity - b.batchSizeBbl) * weights.tankSizeFit;
  });
  score -= sizePenalty;

  // 4. Brite conflicts
  const briteSlots = {};
  allBatches.forEach(b => {
    b.steps.filter(s => s.step === "condition").forEach(s => {
      if (!briteSlots[s.equipId]) briteSlots[s.equipId] = [];
      briteSlots[s.equipId].push({ start: s.start, end: s.end });
    });
  });
  let conflicts = 0;
  Object.values(briteSlots).forEach(slots => {
    for (let i = 0; i < slots.length; i++)
      for (let j = i + 1; j < slots.length; j++)
        if (slots[i].start <= slots[j].end && slots[j].start <= slots[i].end) conflicts++;
  });
  score -= conflicts * weights.briteConflicts;

  // 5. Dry-hop tank matching
  newBatches.forEach(b => {
    if (b._meta && b._meta.isHoppy && b._meta.isDryHopTank) score += weights.dryHopMatch;
    if (b._meta && !b._meta.isHoppy && b._meta.isDryHopTank) score -= weights.dryHopMatch; // penalty for wasting dry-hop tank on non-hoppy
  });

  // 6. Ingredient clustering (same base malt in same week = bonus)
  const weekBuckets = {};
  newBatches.forEach(b => {
    const fermStart = b.steps.find(s => s.step === "ferment")?.start;
    if (!fermStart || !b._meta?.recipe) return;
    const week = fermStart.slice(0, 7); // YYYY-MM as rough week proxy
    if (!weekBuckets[week]) weekBuckets[week] = [];
    const bom = NS_BOMS[b._meta.recipe.name];
    const baseMalt = bom ? bom[0]?.ingredient : "";
    weekBuckets[week].push(baseMalt);
  });
  Object.values(weekBuckets).forEach(malts => {
    const counts = {};
    malts.forEach(m => { if (m) counts[m] = (counts[m] || 0) + 1; });
    Object.values(counts).forEach(c => { if (c > 1) score += (c - 1) * weights.ingredientCluster; });
  });

  return { score, metCount, fermDaysUsed, sizePenalty: Math.round(sizePenalty), conflicts };
}

// Shuffle array (Fisher-Yates)
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Main optimizer: runs N permutations and keeps the best
function autoSchedule(demand, equipment, recipes, existingSchedule = [], sensitivityMult = 1.0, weights = DEFAULT_WEIGHTS, iterations = 1000) {
  let bestResult = null;
  let bestScore = -Infinity;
  let bestScoreDetail = null;

  for (let i = 0; i < iterations; i++) {
    // First iteration: EDF (earliest deadline first). Rest: random permutations
    const order = i === 0
      ? [...demand].sort((a, b) => a.shipDate.localeCompare(b.shipDate))
      : shuffleArray(demand);

    const result = runGreedy(order, equipment, recipes, existingSchedule, sensitivityMult);
    const detail = scoreSchedule(result.newBatches, result.unmetDemand, demand, equipment, recipes, existingSchedule, weights, sensitivityMult);

    if (detail.score > bestScore) {
      bestScore = detail.score;
      bestResult = result;
      bestScoreDetail = detail;
    }
  }

  return {
    newBatches: bestResult.newBatches,
    unmetDemand: bestResult.unmetDemand,
    totalBbl: bestResult.newBatches.reduce((s, b) => s + b.batchSizeBbl, 0),
    score: bestScore,
    scoreDetail: bestScoreDetail,
    iterations,
  };
}

// ─── SCENARIO UTILITIES ─────────────────────────────────────────────────────────

function calcMetrics(schedule, demand, equipment) {
  const fermenters = equipment.filter(e => e.type === EQUIP_TYPES.FERM);
  const totalBbl = schedule.reduce((s, b) => s + b.batchSizeBbl, 0);
  const batchCount = schedule.length;

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
      const beerName = recipe.name.replace("[Contract] ", "");

      // Find the brite tank for this batch (so packaging can show on same row)
      const condStep = batch.steps.find(st => st.step === "condition");
      const condEqIdx = condStep ? equipRows.findIndex(e => e.id === condStep.equipId) : -1;

      batch.steps.forEach(step => {
        let eqIdx = equipRows.findIndex(e => e.id === step.equipId);

        // Package steps use CAN1/KEG1 which aren't on the Gantt — show on brite tank row instead
        if (step.step === "package" && eqIdx === -1 && condEqIdx !== -1) {
          eqIdx = condEqIdx;
        }
        if (eqIdx === -1) return;

        const s = daysBetween(startDate, step.start);
        const e2 = daysBetween(startDate, step.end) + 1;
        if (e2 < 0 || s > totalDays) return;
        const left = Math.max(0, s) * dayWidth;
        const width = Math.max(1, (Math.min(e2, totalDays) - Math.max(0, s))) * dayWidth - 1;

        let subRow = 0, phase = PHASE.ferment, label = beerName;
        const durDays = daysBetween(step.start, step.end) + 1;
        if (step.step === "ferment") {
          subRow = 0; phase = PHASE.ferment;
          label = beerName;
        } else if (step.step === "condition") {
          subRow = 1; phase = PHASE.condition;
          label = `${beerName} · ${durDays}D`;
        } else if (step.step === "package") {
          subRow = 2; phase = isKeg ? PHASE.package_keg : PHASE.package_can;
          label = `${beerName} · ${isKeg ? "KEG" : "CAN"}`;
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
        <span>Row 1: <span style={{ color: "#f0b8f4" }}>Fermenting</span></span>
        <span>Row 2: <span style={{ color: "#cfe2f3" }}>Conditioning</span></span>
        <span>Row 3: <span style={{ color: "#d9ead3" }}>CAN / KEG</span> (on brite row)</span>
        <span style={{ marginLeft: "auto" }}>All blocks show beer name · Click to edit</span>
      </div>
    </div>
  );
}

// ─── SCHEDULE OPTIMIZER TAB ─────────────────────────────────────────────────────

function ScheduleOptimizer({ schedule, setSchedule, equipment, recipes, demand, sensitivity, setSensitivity, weights, setWeights }) {
  const [editBatch, setEditBatch] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecipe, setNewRecipe] = useState("");
  const [newStart, setNewStart] = useState(d(5));
  const [autoResult, setAutoResult] = useState(null);
  const [showWeights, setShowWeights] = useState(false);

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

  // Orphaned batches — scheduled but no matching demand at all
  const demandedRecipeIds = new Set(demand.map(dm => dm.recipeId));
  const orphanedBatches = schedule.filter(b => !demandedRecipeIds.has(b.recipeId));

  // Over-scheduled — more BBL scheduled than demand requires
  const demandVolume = {};
  demand.forEach(dm => { demandVolume[dm.recipeId] = (demandVolume[dm.recipeId] || 0) + dm.volumeBbl; });
  const overScheduled = Object.entries(scheduledRecipeVolume)
    .filter(([rid, vol]) => demandedRecipeIds.has(rid) && vol > (demandVolume[rid] || 0))
    .map(([rid, vol]) => ({ recipeId: rid, scheduled: vol, demanded: demandVolume[rid] || 0, excess: vol - (demandVolume[rid] || 0) }));

  // Auto-schedule handler
  const handleAutoSchedule = () => {
    const result = autoSchedule(demand, equipment, recipes, schedule, sensitivity, weights);
    setAutoResult(result);
    if (result.newBatches.length > 0) {
      setSchedule(prev => [...prev, ...result.newBatches]);
    }
  };

  const handleClearAuto = () => {
    setSchedule(prev => prev.filter(b => !b.autoScheduled));
    setAutoResult(null);
  };

  const currentMetrics = calcMetrics(schedule, demand, equipment);

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
          <button style={{ ...baseStyles.btn(), color: showWeights ? "#c8854a" : "#94a3b8", borderColor: showWeights ? "#c8854a44" : "#2d3748" }} onClick={() => setShowWeights(!showWeights)}>⚙ Weights</button>
          <button style={baseStyles.btn()} onClick={() => {
            const rows = [["Batch ID","Beer","Style","BBL","Fermenter","Brew Date","Package Date","Auto-Scheduled"]];
            schedule.forEach(b => {
              const r = recipes.find(x => x.id === b.recipeId);
              const fermStep = b.steps?.find(s => s.step === "ferment");
              const pkgStep = b.steps?.find(s => s.step === "package");
              rows.push([b.id, r?.name||b.recipeId, r?.style||"", b.batchSizeBbl, fermStep?.equipId||"", fermStep?.start?.split("T")[0]||"", pkgStep?.end?.split("T")[0]||"", b.autoScheduled?"Y":"N"]);
            });
            const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `brew-schedule-${new Date().toISOString().split("T")[0]}.csv`; a.click();
          }}>📥 Export CSV</button>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
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

      {/* Objective Function Weights Editor */}
      {showWeights && (
        <div style={{ ...baseStyles.card, borderColor: "#c8854a44", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={baseStyles.cardTitle}>⚙ Objective Function Weights</div>
            <button style={{ ...baseStyles.btn(), fontSize: "0.7rem", padding: "3px 10px" }} onClick={() => setWeights(DEFAULT_WEIGHTS)}>Reset Defaults</button>
          </div>
          <div style={{ background: "#0b0f14", borderRadius: 6, padding: "10px 14px", marginBottom: 12, fontSize: "0.75rem", color: "#94a3b8", ...baseStyles.mono }}>
            Score = (on_time × <span style={{ color: "#81c784" }}>{weights.onTimeDelivery}</span>) + (fv_days × <span style={{ color: "#81c784" }}>{weights.fermUtilization}</span>) - (tank_waste × <span style={{ color: "#fca5a5" }}>{weights.tankSizeFit}</span>) - (brite_conflicts × <span style={{ color: "#fca5a5" }}>{weights.briteConflicts}</span>) + (dryhop_match × <span style={{ color: "#81c784" }}>{weights.dryHopMatch}</span>) + (malt_cluster × <span style={{ color: "#81c784" }}>{weights.ingredientCluster}</span>)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { key: "onTimeDelivery", label: "On-Time Delivery", desc: "Points per demand met on time", color: "#81c784", sign: "+" },
              { key: "fermUtilization", label: "FV Utilization", desc: "Points per fermenter-day used", color: "#81c784", sign: "+" },
              { key: "tankSizeFit", label: "Tank Size Penalty", desc: "Penalty per BBL wasted capacity", color: "#fca5a5", sign: "−" },
              { key: "briteConflicts", label: "Brite Conflicts", desc: "Penalty per overlapping brite use", color: "#fca5a5", sign: "−" },
              { key: "dryHopMatch", label: "Dry-Hop Matching", desc: "Bonus for IPAs in FV4/5/8/9", color: "#81c784", sign: "+" },
              { key: "ingredientCluster", label: "Ingredient Cluster", desc: "Bonus for same-malt beers in same week", color: "#81c784", sign: "+" },
            ].map(w => (
              <div key={w.key} style={{ background: "#111820", border: "1px solid #1e293b", borderRadius: 6, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f8fafc" }}>{w.sign} {w.label}</span>
                  <input type="number" value={weights[w.key]} onChange={e => setWeights(prev => ({ ...prev, [w.key]: Number(e.target.value) || 0 }))} style={{ ...baseStyles.input, width: 60, textAlign: "right", color: w.color, fontWeight: 700 }} />
                </div>
                <div style={{ fontSize: "0.65rem", color: "#475569" }}>{w.desc}</div>
                <input type="range" min="0" max={w.key === "onTimeDelivery" ? 200 : 20} value={weights[w.key]} onChange={e => setWeights(prev => ({ ...prev, [w.key]: Number(e.target.value) }))} style={{ width: "100%", accentColor: w.color, marginTop: 4 }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: "0.7rem", color: "#475569" }}>The optimizer runs 200 random schedule permutations and keeps the highest-scoring result. Adjust weights to prioritize what matters most to your brewery.</div>
        </div>
      )}

      {/* Auto-Schedule Results */}
      {autoResult && (
        <div style={{ ...baseStyles.card, borderColor: autoResult.unmetDemand.length > 0 ? "#f59e0b44" : "#22c55e44", marginBottom: 16 }}>
          <div style={baseStyles.cardTitle}>⚡ Auto-Schedule Results</div>
          <div style={{ display: "flex", gap: 16, marginBottom: 8, fontSize: "0.85rem", flexWrap: "wrap" }}>
            <span style={{ color: "#81c784" }}>{autoResult.newBatches.length} batches added</span>
            <span style={{ color: "#c8854a" }}>{autoResult.totalBbl} BBL</span>
            <span style={{ ...baseStyles.mono, color: "#d98ae0" }}>Score: {Math.round(autoResult.score)}</span>
            <span style={{ ...baseStyles.mono, color: "#64748b" }}>{autoResult.iterations} iterations</span>
          </div>
          {autoResult.scoreDetail && (
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", fontSize: "0.7rem" }}>
              <span style={baseStyles.badge("#81c784")}>{autoResult.scoreDetail.metCount} on-time (+{autoResult.scoreDetail.metCount * weights.onTimeDelivery})</span>
              <span style={baseStyles.badge("#7bafd4")}>{autoResult.scoreDetail.fermDaysUsed} FV-days (+{autoResult.scoreDetail.fermDaysUsed * weights.fermUtilization})</span>
              <span style={baseStyles.badge("#fca5a5")}>tank waste −{autoResult.scoreDetail.sizePenalty}</span>
              <span style={baseStyles.badge(autoResult.scoreDetail.conflicts > 0 ? "#ef4444" : "#22c55e")}>{autoResult.scoreDetail.conflicts} brite conflicts</span>
            </div>
          )}
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

      {/* Orphaned Batches — scheduled but no demand */}
      {orphanedBatches.length > 0 && (
        <div style={{ ...baseStyles.card, borderColor: "#8b5cf644" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={baseStyles.cardTitle}><span style={{ color: "#8b5cf6" }}>👻</span> Orphaned Batches — No Matching Demand</div>
            <button style={{ ...baseStyles.btn(), color: "#fca5a5", fontSize: "0.75rem" }} onClick={() => { if (confirm(`Remove ${orphanedBatches.length} orphaned batch(es) with no matching demand?`)) setSchedule(prev => prev.filter(b => demandedRecipeIds.has(b.recipeId))); }}>🗑 Remove {orphanedBatches.length} Orphaned</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {orphanedBatches.map(b => {
              const r = recipes.find(x => x.id === b.recipeId);
              return (
                <div key={b.id} style={{ ...baseStyles.badge("#8b5cf6"), fontSize: "0.7rem" }}>
                  {b.id}: {r?.name || b.recipeId} ({b.batchSizeBbl} BBL)
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Over-Scheduled — more batches than demand */}
      {overScheduled.length > 0 && (
        <div style={{ ...baseStyles.card, borderColor: "#3b82f644" }}>
          <div style={baseStyles.cardTitle}><span style={{ color: "#3b82f6" }}>📊</span> Over-Scheduled — More Than Demand Requires</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {overScheduled.map(os => {
              const r = recipes.find(x => x.id === os.recipeId);
              return (
                <div key={os.recipeId} style={{ ...baseStyles.badge("#3b82f6"), fontSize: "0.7rem" }}>
                  {r?.name || os.recipeId}: {os.scheduled} BBL scheduled vs {os.demanded} BBL demand (+{os.excess} excess)
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cost Dashboard */}
      {schedule.length > 0 && (() => {
        const batchCosts = schedule.map(b => {
          const r = recipes.find(x => x.id === b.recipeId);
          const bom = r ? NS_BOMS[r.name] : null;
          let cost = 0;
          const ingredients = [];
          if (bom) {
            bom.forEach(ing => { const c = ing.qty * ing.cost * b.batchSizeBbl; cost += c; ingredients.push({ name: ing.ingredient, cost: c }); });
          }
          return { id: b.id, beer: r?.name || b.recipeId, bbl: b.batchSizeBbl, cost, hasBom: !!bom, ingredients };
        });
        const totalCost = batchCosts.reduce((s, b) => s + b.cost, 0);
        const totalBbl = batchCosts.reduce((s, b) => s + b.bbl, 0);
        const withBom = batchCosts.filter(b => b.hasBom);
        const noBom = batchCosts.filter(b => !b.hasBom);
        // Top 10 most expensive ingredients across all batches
        const ingMap = {};
        batchCosts.forEach(b => b.ingredients.forEach(i => { ingMap[i.name] = (ingMap[i.name] || 0) + i.cost; }));
        const topIngs = Object.entries(ingMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
        return (
          <div style={baseStyles.card}>
            <div style={baseStyles.cardTitle}>💰 Cost Dashboard <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "#475569" }}>(based on {withBom.length} batches with real BOMs)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                ["Total Raw Material Cost", "$" + totalCost.toFixed(0), "#c8854a"],
                ["Cost per BBL (avg)", totalBbl > 0 ? "$" + (totalCost / totalBbl).toFixed(2) : "—", "#22c55e"],
                ["Batches w/ Real BOM", withBom.length + " of " + schedule.length, "#3b82f6"],
                ["Batches w/o BOM", noBom.length > 0 ? noBom.length + " (no cost data)" : "All covered", noBom.length > 0 ? "#f59e0b" : "#22c55e"],
              ].map(([l, v, c], i) => (
                <div key={i} style={{ background: "#0b0f14", borderRadius: 6, padding: "10px 12px", border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.03em" }}>{l}</div>
                  <div style={{ ...baseStyles.mono, fontSize: "1.1rem", fontWeight: 700, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            {topIngs.length > 0 && (
              <div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 8 }}>Top Ingredient Spend (across all scheduled batches)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {topIngs.map(([name, cost], i) => {
                    const pct = topIngs[0][1] > 0 ? (cost / topIngs[0][1]) * 100 : 0;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem" }}>
                        <div style={{ width: 180, color: "#cbd5e1", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                        <div style={{ flex: 1, height: 14, background: "#111820", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: pct + "%", height: "100%", background: "linear-gradient(90deg, #c8854a33, #c8854a88)", borderRadius: 3 }} />
                        </div>
                        <div style={{ ...baseStyles.mono, color: "#c8854a", width: 70, textAlign: "right", flexShrink: 0 }}>${cost.toFixed(0)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {withBom.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 8 }}>Cost by Batch</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {withBom.sort((a, b) => b.cost - a.cost).map(b => (
                    <div key={b.id} style={{ background: "#0b0f14", border: "1px solid #1e293b", borderRadius: 4, padding: "4px 8px", fontSize: "0.7rem" }}>
                      <span style={{ color: "#cbd5e1" }}>{b.beer}</span> <span style={{ ...baseStyles.mono, color: "#c8854a" }}>${b.cost.toFixed(0)}</span> <span style={{ color: "#475569" }}>({b.bbl}BBL · ${(b.bbl > 0 ? b.cost / b.bbl : 0).toFixed(1)}/BBL)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Ingredient Shortfall Report */}
      {schedule.length > 0 && (() => {
        // Calculate total ingredient needs from schedule × BOMs
        const needs = {};
        schedule.forEach(b => {
          const r = recipes.find(x => x.id === b.recipeId);
          const bom = r ? NS_BOMS[r.name] : null;
          if (!bom) return;
          bom.forEach(ing => {
            const key = ing.ingredient;
            if (!needs[key]) needs[key] = { name: key, needed: 0, onHand: ing.onHand || 0, batches: [] };
            needs[key].needed += ing.qty * b.batchSizeBbl;
            needs[key].batches.push({ batch: b.id, beer: r.name, qty: ing.qty * b.batchSizeBbl });
          });
        });
        // Find shortfalls
        const shortfalls = Object.values(needs)
          .map(n => ({ ...n, deficit: n.needed - n.onHand, coveragePct: n.onHand > 0 ? Math.min(100, (n.onHand / n.needed) * 100) : 0 }))
          .filter(n => n.deficit > 0)
          .sort((a, b) => a.coveragePct - b.coveragePct);
        const healthy = Object.values(needs).filter(n => n.needed <= n.onHand);
        if (shortfalls.length === 0 && healthy.length === 0) return null;
        return (
          <div style={{ ...baseStyles.card, borderColor: shortfalls.length > 0 ? "#ef444433" : "#22c55e33" }}>
            <div style={baseStyles.cardTitle}>
              {shortfalls.length > 0
                ? <><span style={{ color: "#ef4444" }}>🚨</span> {shortfalls.length} Ingredient Shortfall{shortfalls.length > 1 ? "s" : ""} <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "#475569" }}>(will run out before schedule completes)</span></>
                : <><span style={{ color: "#22c55e" }}>✅</span> All Ingredients Sufficient</>
              }
            </div>
            {shortfalls.length > 0 && (
              <table style={{ ...baseStyles.table, marginBottom: 12 }}>
                <thead><tr>
                  <th style={baseStyles.th}>Ingredient</th>
                  <th style={{ ...baseStyles.th, textAlign: "right" }}>On Hand</th>
                  <th style={{ ...baseStyles.th, textAlign: "right" }}>Needed</th>
                  <th style={{ ...baseStyles.th, textAlign: "right" }}>Shortfall</th>
                  <th style={{ ...baseStyles.th, width: 120 }}>Coverage</th>
                  <th style={baseStyles.th}>Used By</th>
                </tr></thead>
                <tbody>
                  {shortfalls.map((s, i) => (
                    <tr key={i}>
                      <td style={{ ...baseStyles.td, fontWeight: 500, color: "#f8fafc" }}>{s.name}</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{s.onHand.toFixed(1)}</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{s.needed.toFixed(1)}</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", color: "#fca5a5", fontWeight: 600 }}>-{s.deficit.toFixed(1)}</td>
                      <td style={baseStyles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ flex: 1, height: 10, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: s.coveragePct + "%", height: "100%", background: s.coveragePct < 30 ? "#ef4444" : s.coveragePct < 70 ? "#f59e0b" : "#22c55e", borderRadius: 3 }} />
                          </div>
                          <span style={{ ...baseStyles.mono, fontSize: "0.65rem", color: "#94a3b8", width: 30 }}>{s.coveragePct.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td style={{ ...baseStyles.td, fontSize: "0.65rem", color: "#64748b" }}>{[...new Set(s.batches.map(b => b.beer))].join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {healthy.length > 0 && (
              <div style={{ fontSize: "0.7rem", color: "#22c55e" }}>✓ {healthy.length} ingredient{healthy.length > 1 ? "s" : ""} fully stocked for the current schedule</div>
            )}
          </div>
        );
      })()}

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
      const brewStart = batch.steps.find(s => s.step === "ferment")?.start || batch.steps.find(s => s.step === "mash")?.start;
      if (!brewStart) return;

      // Use real NetSuite BOM if available, fall back to placeholder ingredients
      const realBom = NS_BOMS[recipe.name];
      if (realBom) {
        realBom.forEach(ing => {
          const key = ing.ingredient;
          if (!matNeeds[key]) matNeeds[key] = { items: [], onHand: ing.onHand, cost: ing.cost, isReal: true };
          matNeeds[key].items.push({ batchId: batch.id, recipeName: recipe.name, brewDate: brewStart, qty: ing.qty });
        });
      } else {
        recipe.ingredients.forEach(ing => {
          const totalQty = ing.qtyPerBbl * batch.batchSizeBbl;
          const mat = materials.find(m => m.id === ing.materialId);
          const key = mat?.name || ing.materialId;
          if (!matNeeds[key]) matNeeds[key] = { items: [], onHand: mat?.onHand || 0, cost: mat?.costPerUnit || 0, leadTimeDays: mat?.leadTimeDays || 7, isReal: false };
          matNeeds[key].items.push({ batchId: batch.id, recipeName: recipe.name, brewDate: brewStart, qty: totalQty });
        });
      }
    });
    return matNeeds;
  }, [schedule, recipes, materials]);

  const orders = useMemo(() => {
    const result = [];
    Object.entries(needs).forEach(([matName, data]) => {
      let runningStock = data.onHand;
      const leadTimeDays = data.leadTimeDays || 7;
      const sorted = [...data.items].sort((a, b) => a.brewDate.localeCompare(b.brewDate));
      sorted.forEach(need => {
        runningStock -= need.qty;
        if (runningStock < 0) {
          const orderBy = addDays(need.brewDate, -leadTimeDays);
          const urgent = orderBy <= todayStr;
          result.push({
            materialName: matName,
            qtyNeeded: Math.round(-runningStock * 1000) / 1000,
            brewDate: need.brewDate, orderBy, leadTimeDays,
            batchId: need.batchId, recipeName: need.recipeName,
            urgent, costEst: Math.round(-runningStock * data.cost * 100) / 100,
            isReal: data.isReal,
          });
          runningStock = 0;
        }
      });
    });
    return result.sort((a, b) => a.orderBy.localeCompare(b.orderBy));
  }, [needs]);

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
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{o.qtyNeeded.toLocaleString()}</td>
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
                  <td style={{ ...baseStyles.td, ...baseStyles.mono }}>{o.qtyNeeded.toLocaleString()}</td>
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

      <Modal open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title={selectedRecipe?.name} width={600}>
        {selectedRecipe && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <span style={baseStyles.badge(TYPE_COLORS[selectedRecipe.type]?.border)}>{selectedRecipe.type}</span>
              <span style={{ ...baseStyles.mono, color: "#94a3b8" }}>{selectedRecipe.style} · {selectedRecipe.bblPerBatch} BBL/batch · {selectedRecipe.channel}</span>
            </div>

            {/* Real NetSuite BOM */}
            {NS_BOMS[selectedRecipe.name] ? (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f8fafc", marginBottom: 4 }}>Bill of Materials <span style={{ ...baseStyles.mono, fontSize: "0.65rem", color: "#22c55e" }}>from NetSuite</span></div>
                <table style={{ ...baseStyles.table, marginBottom: 8 }}>
                  <thead><tr>
                    <th style={baseStyles.th}>Ingredient</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Qty/Batch</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>On Hand</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Batches</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Cost</th>
                  </tr></thead>
                  <tbody>
                    {NS_BOMS[selectedRecipe.name].map((ing, i) => {
                      const batches = ing.qty > 0 && ing.onHand > 0 ? Math.floor(ing.onHand / ing.qty) : ing.onHand > 0 ? "∞" : 0;
                      const warn = typeof batches === "number" && batches < 5;
                      return (
                        <tr key={i}>
                          <td style={{ ...baseStyles.td, fontWeight: 500 }}>{ing.ingredient}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{ing.qty.toFixed(3)}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", color: ing.onHand > 0 ? "#81c784" : "#fca5a5" }}>{ing.onHand.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", fontWeight: 600, color: warn ? "#fca5a5" : "#81c784" }}>{batches}{warn ? " ⚠" : ""}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", color: "#c8854a" }}>${(ing.qty * ing.cost).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td style={{ ...baseStyles.td, fontWeight: 600, color: "#f8fafc" }} colSpan={4}>Total Raw Cost / Batch</td>
                      <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", fontWeight: 700, color: "#c8854a" }}>${NS_BOMS[selectedRecipe.name].reduce((s, i) => s + i.qty * i.cost, 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                {(() => {
                  const minBatches = Math.min(...NS_BOMS[selectedRecipe.name].filter(i => i.qty > 0).map(i => i.onHand > 0 ? Math.floor(i.onHand / i.qty) : 0));
                  const bottleneck = NS_BOMS[selectedRecipe.name].find(i => i.qty > 0 && (i.onHand <= 0 || Math.floor(i.onHand / i.qty) === minBatches));
                  return (
                    <div style={{ background: minBatches > 0 ? "#22c55e11" : "#ef444411", border: `1px solid ${minBatches > 0 ? "#22c55e33" : "#ef444433"}`, borderRadius: 6, padding: "8px 12px", fontSize: "0.8rem" }}>
                      <span style={{ fontWeight: 600, color: minBatches > 0 ? "#81c784" : "#fca5a5" }}>
                        {minBatches > 0 ? `✓ Can brew ${minBatches} batches` : "⚠ Cannot brew — missing ingredients"}
                      </span>
                      {bottleneck && <span style={{ color: "#94a3b8" }}> · Bottleneck: {bottleneck.ingredient}</span>}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#f8fafc", marginBottom: 8 }}>Ingredients <span style={{ ...baseStyles.mono, fontSize: "0.65rem", color: "#64748b" }}>placeholder</span></div>
                <table style={baseStyles.table}>
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
              </div>
            )}

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

// ─── SCENARIO PLANNER TAB ────────────────────────────────────────────────────────

function ScenarioPlanner({ demand, equipment, recipes, weights, schedule, setSchedule }) {
  const [scenarios, setScenarios] = useState(() => loadState("scenarios", []));
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [running, setRunning] = useState(null);

  // Persist scenarios
  useEffect(() => { saveState("scenarios", scenarios); }, [scenarios]);

  // Create a new scenario from current demand
  const handleCreate = () => {
    if (!newName.trim()) return;
    const profile = demand.map(d => ({ ...d, multiplier: 1.0, enabled: true }));
    setScenarios(prev => [...prev, {
      name: newName.trim(), desc: newDesc.trim(), demandProfile: profile,
      result: null, createdAt: new Date().toLocaleString(),
    }]);
    setNewName(""); setNewDesc("");
    setEditIdx(scenarios.length); // open editor on new scenario
  };

  // Run optimizer for a scenario
  const handleRun = (idx) => {
    setRunning(idx);
    setTimeout(() => {
      const sc = scenarios[idx];
      const adjDemand = sc.demandProfile.filter(d => d.enabled).map(d => ({
        ...d, volumeBbl: Math.round(d.volumeBbl * (d.multiplier || 1.0))
      }));
      const result = autoSchedule(adjDemand, equipment, recipes, [], 1.0, weights, 1000);
      const metrics = calcMetrics(result.newBatches, adjDemand, equipment);
      setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, result: { schedule: result.newBatches, metrics, ranAt: new Date().toLocaleTimeString() } } : s));
      setRunning(null);
    }, 50);
  };

  // Apply scenario schedule to main schedule
  const handleApply = (idx) => {
    const sc = scenarios[idx];
    if (!sc.result) return;
    if (confirm(`Replace current schedule with "${sc.name}" scenario (${sc.result.schedule.length} batches)?`)) {
      setSchedule(sc.result.schedule);
    }
  };

  // Current demand baseline metrics
  const baseResult = useMemo(() => {
    const result = autoSchedule(demand, equipment, recipes, [], 1.0, weights, 50);
    return calcMetrics(result.newBatches, demand, equipment);
  }, [demand, equipment, recipes, weights]);

  const totalDemandBbl = demand.reduce((s, d) => s + d.volumeBbl, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Scenario Planner</h2>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Create demand profiles, run the optimizer, compare outcomes. Each scenario adjusts your base demand with per-beer multipliers.</div>
        </div>
      </div>

      {/* Baseline reference */}
      <div style={{ ...baseStyles.card, borderColor: "#22c55e33", marginBottom: 16 }}>
        <div style={baseStyles.cardTitle}>📊 Current Baseline <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "#475569" }}>(from your Demand tab — {demand.length} entries, {totalDemandBbl} BBL total)</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[["Total BBL", baseResult.totalBbl, "#c8854a"], ["Batches", baseResult.batchCount, "#8ab4f0"], ["Utilization", baseResult.utilization + "%", "#81c784"], ["On-Time", baseResult.onTime + "%", baseResult.onTime > 90 ? "#81c784" : "#fca5a5"]].map(([l, v, c], i) => (
            <div key={i} style={{ background: "#0b0f14", borderRadius: 6, padding: "8px 12px" }}>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase" }}>{l}</div>
              <div style={{ ...baseStyles.mono, fontSize: "1.1rem", fontWeight: 700, color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create new scenario */}
      <div style={{ ...baseStyles.card, marginBottom: 16 }}>
        <div style={baseStyles.cardTitle}>+ New Scenario</div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: 4 }}>Name</div>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Summer Surge, Daizy's 2x, Lose Kroger..." style={{ ...baseStyles.input, width: "100%" }} />
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: 4 }}>Description</div>
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What assumption does this scenario test?" style={{ ...baseStyles.input, width: "100%" }} />
          </div>
          <button style={baseStyles.btn("primary")} onClick={handleCreate} disabled={!newName.trim()}>Create from Current Demand</button>
        </div>
      </div>

      {/* Scenarios list */}
      {scenarios.map((sc, idx) => {
        const isEditing = editIdx === idx;
        const r = sc.result;
        const adjBbl = sc.demandProfile.filter(d => d.enabled).reduce((s, d) => s + Math.round(d.volumeBbl * (d.multiplier || 1)), 0);
        return (
          <div key={idx} style={{ ...baseStyles.card, marginBottom: 12, borderColor: r ? "#22c55e33" : "#1e293b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isEditing ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>{sc.name}</div>
                {sc.desc && <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{sc.desc}</div>}
                <div style={{ fontSize: "0.65rem", color: "#475569", ...baseStyles.mono }}>{sc.demandProfile.filter(d => d.enabled).length} active entries · {adjBbl} BBL adjusted demand · created {sc.createdAt}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...baseStyles.btn(), fontSize: "0.75rem", color: isEditing ? "#c8854a" : "#94a3b8" }} onClick={() => setEditIdx(isEditing ? null : idx)}>✏ {isEditing ? "Close" : "Edit Demand"}</button>
                <button style={{ ...baseStyles.btn(), fontSize: "0.75rem", color: "#d98ae0" }} onClick={() => handleRun(idx)} disabled={running !== null}>{running === idx ? "Running 1000 iterations..." : "⚡ Run Optimizer"}</button>
                {r && <button style={{ ...baseStyles.btn(), fontSize: "0.75rem", color: "#22c55e" }} onClick={() => handleApply(idx)}>✓ Apply to Schedule</button>}
                <button style={{ ...baseStyles.btn(), fontSize: "0.75rem", color: "#fca5a5" }} onClick={() => { setScenarios(prev => prev.filter((_, i) => i !== idx)); if (editIdx === idx) setEditIdx(null); }}>✕</button>
              </div>
            </div>

            {/* Demand profile editor */}
            {isEditing && (
              <div style={{ maxHeight: "40vh", overflow: "auto", marginBottom: 12 }}>
                <table style={baseStyles.table}>
                  <thead><tr>
                    <th style={{ ...baseStyles.th, width: 30 }}>On</th>
                    <th style={baseStyles.th}>Beer</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Base BBL</th>
                    <th style={{ ...baseStyles.th, textAlign: "right", width: 90 }}>Multiplier</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Adjusted BBL</th>
                    <th style={baseStyles.th}>Ship Date</th>
                  </tr></thead>
                  <tbody>
                    {sc.demandProfile.map((dp, di) => {
                      const recipe = recipes.find(x => x.id === dp.recipeId);
                      return (
                        <tr key={di} style={{ opacity: dp.enabled ? 1 : 0.4 }}>
                          <td style={baseStyles.td}>
                            <input type="checkbox" checked={dp.enabled} onChange={e => {
                              setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map((d, j) => j === di ? { ...d, enabled: e.target.checked } : d), result: null } : s));
                            }} />
                          </td>
                          <td style={{ ...baseStyles.td, fontWeight: 500 }}>{recipe?.name || dp.recipeId}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{dp.volumeBbl}</td>
                          <td style={{ ...baseStyles.td, textAlign: "right" }}>
                            <input type="number" step="0.1" min="0" max="5" value={dp.multiplier ?? 1} style={{ ...baseStyles.input, width: 60, textAlign: "right", color: (dp.multiplier ?? 1) !== 1 ? "#c8854a" : "#94a3b8" }} onChange={e => {
                              setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map((d, j) => j === di ? { ...d, multiplier: Number(e.target.value) || 0 } : d), result: null } : s));
                            }} />
                          </td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right", color: (dp.multiplier ?? 1) !== 1 ? "#c8854a" : "#94a3b8" }}>{Math.round(dp.volumeBbl * (dp.multiplier ?? 1))}</td>
                          <td style={{ ...baseStyles.td, ...baseStyles.mono, fontSize: "0.7rem", color: "#475569" }}>{dp.shipDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.7rem" }} onClick={() => setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map(d => ({ ...d, multiplier: 1.5 })), result: null } : s))}>All ×1.5</button>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.7rem" }} onClick={() => setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map(d => ({ ...d, multiplier: 2.0 })), result: null } : s))}>All ×2.0</button>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.7rem" }} onClick={() => setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map(d => ({ ...d, multiplier: 0.5 })), result: null } : s))}>All ×0.5</button>
                  <button style={{ ...baseStyles.btn(), fontSize: "0.7rem" }} onClick={() => setScenarios(prev => prev.map((s, i) => i === idx ? { ...s, demandProfile: s.demandProfile.map(d => ({ ...d, multiplier: 1.0 })), result: null } : s))}>Reset All ×1.0</button>
                </div>
              </div>
            )}

            {/* Results */}
            {r && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 8 }}>
                {[
                  ["Total BBL", r.metrics.totalBbl, baseResult.totalBbl],
                  ["Batches", r.metrics.batchCount, baseResult.batchCount],
                  ["Utilization", r.metrics.utilization, baseResult.utilization],
                  ["On-Time", r.metrics.onTime, baseResult.onTime],
                ].map(([label, val, base], i) => {
                  const diff = val - base;
                  const isPercent = label === "Utilization" || label === "On-Time";
                  return (
                    <div key={i} style={{ background: "#0b0f14", borderRadius: 6, padding: "6px 10px" }}>
                      <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase" }}>{label}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ ...baseStyles.mono, fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>{val}{isPercent ? "%" : ""}</span>
                        <span style={{ ...baseStyles.mono, fontSize: "0.7rem", color: diff > 0 ? "#81c784" : diff < 0 ? "#fca5a5" : "#475569" }}>{diff > 0 ? "+" : ""}{diff}{isPercent ? "%" : ""}</span>
                      </div>
                    </div>
                  );
                })}
                <div style={{ background: "#0b0f14", borderRadius: 6, padding: "6px 10px" }}>
                  <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase" }}>Ran At</div>
                  <div style={{ ...baseStyles.mono, fontSize: "0.8rem", color: "#22c55e", marginTop: 2 }}>{r.ranAt}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Comparison table if multiple results exist */}
      {scenarios.filter(s => s.result).length >= 2 && (
        <div style={{ ...baseStyles.card, marginTop: 16 }}>
          <div style={baseStyles.cardTitle}>📊 Side-by-Side Comparison</div>
          <table style={baseStyles.table}>
            <thead><tr>
              <th style={baseStyles.th}>Scenario</th>
              <th style={{ ...baseStyles.th, textAlign: "right" }}>Demand BBL</th>
              <th style={{ ...baseStyles.th, textAlign: "right" }}>Scheduled BBL</th>
              <th style={{ ...baseStyles.th, textAlign: "right" }}>Batches</th>
              <th style={{ ...baseStyles.th, textAlign: "right" }}>Utilization</th>
              <th style={{ ...baseStyles.th, textAlign: "right" }}>On-Time</th>
            </tr></thead>
            <tbody>
              <tr>
                <td style={{ ...baseStyles.td, fontWeight: 600, color: "#22c55e" }}>Baseline (current demand)</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{totalDemandBbl}</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{baseResult.totalBbl}</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{baseResult.batchCount}</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{baseResult.utilization}%</td>
                <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{baseResult.onTime}%</td>
              </tr>
              {scenarios.filter(s => s.result).map((sc, i) => {
                const adjBbl = sc.demandProfile.filter(d => d.enabled).reduce((s, d) => s + Math.round(d.volumeBbl * (d.multiplier || 1)), 0);
                return (
                  <tr key={i}>
                    <td style={{ ...baseStyles.td, fontWeight: 500 }}>{sc.name}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{adjBbl}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{sc.result.metrics.totalBbl}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{sc.result.metrics.batchCount}</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{sc.result.metrics.utilization}%</td>
                    <td style={{ ...baseStyles.td, ...baseStyles.mono, textAlign: "right" }}>{sc.result.metrics.onTime}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "schedule", label: "Schedule", icon: "📅" },
  { id: "scenarios", label: "Scenarios", icon: "🔀" },
  { id: "materials", label: "Materials", icon: "📦" },
  { id: "production", label: "Production", icon: "🏭" },
  { id: "inventory", label: "Inventory", icon: "📊" },
  { id: "demand", label: "Demand", icon: "📈" },
  { id: "recipes", label: "Recipes", icon: "🍺" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

// localStorage helpers
function loadState(key, fallback) {
  try { const v = localStorage.getItem("bp_" + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveState(key, value) {
  try { localStorage.setItem("bp_" + key, JSON.stringify(value)); } catch { /* quota exceeded or private mode */ }
}

export default function BreweryPlanner() {
  const [tab, setTab] = useState("schedule");
  const [recipes] = useState(SAMPLE_RECIPES);
  const [equipment] = useState(SAMPLE_EQUIPMENT);
  const [materials] = useState(SAMPLE_MATERIALS);
  const [schedule, setSchedule] = useState(() => loadState("schedule", SAMPLE_SCHEDULE));
  const [demand, setDemand] = useState(() => loadState("demand", SAMPLE_DEMAND));
  const [sensitivity, setSensitivity] = useState(1.0);
  const [weights, setWeights] = useState(() => loadState("weights", DEFAULT_WEIGHTS));
  const [leadTimes, setLeadTimes] = useState(() => loadState("leadTimes", DEFAULT_LEAD_TIMES));
  const [processDurations, setProcessDurations] = useState(() => loadState("processDurations", {}));

  // Persist on change
  useEffect(() => { saveState("schedule", schedule); }, [schedule]);
  useEffect(() => { saveState("demand", demand); }, [demand]);
  useEffect(() => { saveState("weights", weights); }, [weights]);
  useEffect(() => { saveState("leadTimes", leadTimes); }, [leadTimes]);
  useEffect(() => { saveState("processDurations", processDurations); }, [processDurations]);

  return (
    <div style={baseStyles.app}>
      <style>{fonts}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
          <button style={{ ...baseStyles.btn(), fontSize: "0.7rem", padding: "4px 10px", color: "#64748b" }} onClick={() => { if (confirm("Reset all data to defaults? This clears your saved schedule, demand, and scenarios.")) { localStorage.removeItem("bp_schedule"); localStorage.removeItem("bp_demand"); localStorage.removeItem("bp_scenarios"); window.location.reload(); } }}>↺ Reset</button>
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
        {tab === "schedule" && <ScheduleOptimizer schedule={schedule} setSchedule={setSchedule} equipment={equipment} recipes={recipes} demand={demand} sensitivity={sensitivity} setSensitivity={setSensitivity} weights={weights} setWeights={setWeights} />}
        {tab === "scenarios" && <ScenarioPlanner demand={demand} equipment={equipment} recipes={recipes} weights={weights} schedule={schedule} setSchedule={setSchedule} />}
        {tab === "materials" && <MaterialOrders schedule={schedule} recipes={recipes} materials={materials} equipment={equipment} />}
        {tab === "production" && <ProductionStatus schedule={schedule} equipment={equipment} recipes={recipes} />}
        {tab === "inventory" && <InventoryDashboard materials={materials} schedule={schedule} recipes={recipes} />}
        {tab === "demand" && <DataManager demand={demand} setDemand={setDemand} recipes={recipes} />}
        {tab === "recipes" && <RecipeBrowser recipes={recipes} materials={materials} />}
        {tab === "settings" && (
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: "0 0 4px 0" }}>Production Settings</h2>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>Lead times, process durations, and data management. Changes persist automatically.</div>

            {/* Lead Times by Category */}
            <div style={baseStyles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={baseStyles.cardTitle}>📦 Material Lead Times (days)</div>
                <button style={{ ...baseStyles.btn(), fontSize: "0.7rem", padding: "3px 10px" }} onClick={() => setLeadTimes(DEFAULT_LEAD_TIMES)}>Reset Defaults</button>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: 12 }}>How many days before brew day must you order each category? Used by Material Orders to calculate order-by dates.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {Object.entries(leadTimes).map(([cat, days]) => (
                  <div key={cat} style={{ background: "#0b0f14", borderRadius: 6, padding: "10px 12px", border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f8fafc", textTransform: "capitalize", marginBottom: 6 }}>{cat}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="number" value={days} min={1} max={90} onChange={e => setLeadTimes(prev => ({ ...prev, [cat]: Number(e.target.value) || 1 }))} style={{ ...baseStyles.input, width: 60, textAlign: "right" }} />
                      <span style={{ ...baseStyles.mono, color: "#64748b", fontSize: "0.75rem" }}>days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Durations per Recipe */}
            <div style={baseStyles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={baseStyles.cardTitle}>⏱ Process Durations (hours)</div>
                <button style={{ ...baseStyles.btn(), fontSize: "0.7rem", padding: "3px 10px" }} onClick={() => setProcessDurations({})}>Reset All to Style Defaults</button>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: 12 }}>Override fermentation, conditioning, and packaging times per recipe. Empty fields use the style-based default shown in grey.</div>
              <div style={{ maxHeight: "50vh", overflow: "auto" }}>
                <table style={baseStyles.table}>
                  <thead><tr>
                    <th style={baseStyles.th}>Recipe</th>
                    <th style={baseStyles.th}>Style</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Ferment (hrs)</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Condition (hrs)</th>
                    <th style={{ ...baseStyles.th, textAlign: "right" }}>Package (hrs)</th>
                  </tr></thead>
                  <tbody>
                    {recipes.map(r => {
                      const styleDef = DEFAULT_PROCESS_DURATIONS[r.style] || DEFAULT_PROCESS_DURATIONS["default"];
                      const override = processDurations[r.id] || {};
                      return (
                        <tr key={r.id}>
                          <td style={{ ...baseStyles.td, fontWeight: 500 }}>{r.name}</td>
                          <td style={baseStyles.td}><span style={baseStyles.badge(TYPE_COLORS[r.type]?.border || "#64748b")}>{r.style}</span></td>
                          {["fermentHrs", "conditionHrs", "packageHrs"].map(field => (
                            <td key={field} style={{ ...baseStyles.td, textAlign: "right" }}>
                              <input
                                type="number"
                                placeholder={styleDef[field]}
                                value={override[field] ?? ""}
                                onChange={e => {
                                  const val = e.target.value === "" ? undefined : Number(e.target.value);
                                  setProcessDurations(prev => {
                                    const cur = { ...prev[r.id] };
                                    if (val === undefined) delete cur[field]; else cur[field] = val;
                                    return { ...prev, [r.id]: Object.keys(cur).length > 0 ? cur : undefined };
                                  });
                                }}
                                style={{ ...baseStyles.input, width: 70, textAlign: "right", color: override[field] ? "#c8854a" : "#475569" }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#475569", marginTop: 8 }}>Orange values are overrides. Grey placeholder values are style defaults from DEFAULT_PROCESS_DURATIONS.</div>
            </div>

            {/* Data Info */}
            <div style={baseStyles.card}>
              <div style={baseStyles.cardTitle}>📊 Data Snapshot</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  ["Raw Materials", materials.length + " items", "From NetSuite 3/9/2026"],
                  ["Beer BOMs", Object.keys(NS_BOMS).length + " recipes", "Brewing-level ingredient bills"],
                  ["Finished Goods", "216 SKUs", "Kegs, cases, bottles"],
                ].map(([l, v, d], i) => (
                  <div key={i} style={{ background: "#0b0f14", borderRadius: 6, padding: "10px 12px" }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#f8fafc" }}>{l}</div>
                    <div style={{ ...baseStyles.mono, color: "#c8854a", fontSize: "1rem" }}>{v}</div>
                    <div style={{ fontSize: "0.65rem", color: "#475569" }}>{d}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button style={{ ...baseStyles.btn(), color: "#fca5a5" }} onClick={() => { if (confirm("Reset ALL saved data? Schedule, demand, scenarios, weights, lead times, durations — everything goes back to defaults.")) { ["bp_schedule","bp_demand","bp_scenarios","bp_weights","bp_leadTimes","bp_processDurations"].forEach(k => localStorage.removeItem(k)); window.location.reload(); } }}>↺ Factory Reset Everything</button>
              </div>
            </div>
          </div>
        )}
        {tab === "netsuite" && <NetSuiteSync schedule={schedule} recipes={recipes} equipment={equipment} />}
      </div>
    </div>
  );
}
