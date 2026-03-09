import { useState, useMemo, useCallback, useEffect, useRef } from "react";

// ─── SAMPLE DATA ───────────────────────────────────────────────────────────────

const RECIPE_TYPES = { CORE: "core", CONTRACT: "contract", SEASONAL: "seasonal" };
const CHANNELS = { TAPROOM: "taproom", DISTRIBUTION: "distribution" };
const FORMATS = { DRAFT: "draft", BARREL: "barrel", CAN: "can" };
const STEP_TYPES = ["mash", "boil", "ferment", "condition", "carbonate", "package"];
const EQUIP_TYPES = { MASH: "mash_tun", KETTLE: "brew_kettle", FERM: "fermenter", BRITE: "brite_tank", CANNER: "canning_line", KEGGING: "kegging_line" };

const SAMPLE_RECIPES = [
  { id: "R01", name: "Flagship IPA", type: RECIPE_TYPES.CORE, style: "IPA", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 35 }, { materialId: "M03", qtyPerBbl: 2.5 }, { materialId: "M07", qtyPerBbl: 0.8 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R02", name: "Amber Lager", type: RECIPE_TYPES.CORE, style: "Lager", bblPerBatch: 15, ingredients: [{ materialId: "M02", qtyPerBbl: 32 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 168, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R03", name: "Hazy NEIPA", type: RECIPE_TYPES.CORE, style: "NEIPA", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M05", qtyPerBbl: 4 }, { materialId: "M08", qtyPerBbl: 3 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R04", name: "Oatmeal Stout", type: RECIPE_TYPES.CORE, style: "Stout", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 38 }, { materialId: "M06", qtyPerBbl: 8 }, { materialId: "M04", qtyPerBbl: 1.2 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 4, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R05", name: "Pilsner", type: RECIPE_TYPES.CORE, style: "Pilsner", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 28 }, { materialId: "M03", qtyPerBbl: 1.8 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R06", name: "Wheat Ale", type: RECIPE_TYPES.CORE, style: "Wheat", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 20 }, { materialId: "M06", qtyPerBbl: 15 }, { materialId: "M04", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R07", name: "Double IPA", type: RECIPE_TYPES.CORE, style: "DIPA", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 45 }, { materialId: "M05", qtyPerBbl: 5 }, { materialId: "M07", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 4, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R08", name: "Porter", type: RECIPE_TYPES.CORE, style: "Porter", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 36 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R09", name: "Blonde Ale", type: RECIPE_TYPES.CORE, style: "Blonde", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 26 }, { materialId: "M03", qtyPerBbl: 1.2 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 2.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R10", name: "Session IPA", type: RECIPE_TYPES.CORE, style: "Session IPA", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 24 }, { materialId: "M07", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 2.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R11", name: "Pale Ale", type: RECIPE_TYPES.CORE, style: "Pale Ale", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R12", name: "Red Ale", type: RECIPE_TYPES.CORE, style: "Red Ale", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 33 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 144, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R13", name: "Kolsch", type: RECIPE_TYPES.CORE, style: "Kolsch", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 27 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  // Contract brews
  { id: "R14", name: "[Contract] River City Lager", type: RECIPE_TYPES.CONTRACT, style: "Lager", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M03", qtyPerBbl: 1.2 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R15", name: "[Contract] Summit Pale Ale", type: RECIPE_TYPES.CONTRACT, style: "Pale Ale", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 32 }, { materialId: "M07", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R16", name: "[Contract] Bayview IPA", type: RECIPE_TYPES.CONTRACT, style: "IPA", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 36 }, { materialId: "M05", qtyPerBbl: 3.5 }, { materialId: "M08", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R17", name: "[Contract] Northside Wheat", type: RECIPE_TYPES.CONTRACT, style: "Wheat", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 18 }, { materialId: "M06", qtyPerBbl: 16 }, { materialId: "M03", qtyPerBbl: 1.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 120, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  { id: "R18", name: "[Contract] Harbor Stout", type: RECIPE_TYPES.CONTRACT, style: "Stout", bblPerBatch: 20, ingredients: [{ materialId: "M02", qtyPerBbl: 40 }, { materialId: "M06", qtyPerBbl: 6 }, { materialId: "M04", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 4, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 192, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 96, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R19", name: "[Contract] Coastal Pilsner", type: RECIPE_TYPES.CONTRACT, style: "Pilsner", bblPerBatch: 30, ingredients: [{ materialId: "M01", qtyPerBbl: 28 }, { materialId: "M03", qtyPerBbl: 1.5 }, { materialId: "M11", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 288, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 6, cleanHrs: 2 }] },
  // Seasonal / Specialty
  { id: "R20", name: "Pumpkin Ale", type: RECIPE_TYPES.SEASONAL, style: "Spiced Ale", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 30 }, { materialId: "M04", qtyPerBbl: 1.2 }, { materialId: "M09", qtyPerBbl: 2.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 4, cleanHrs: 1.5 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 168, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R21", name: "Winter Warmer", type: RECIPE_TYPES.SEASONAL, style: "Strong Ale", bblPerBatch: 10, ingredients: [{ materialId: "M02", qtyPerBbl: 42 }, { materialId: "M04", qtyPerBbl: 2.0 }, { materialId: "M09", qtyPerBbl: 1.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 4, cleanHrs: 1.5 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 2.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 216, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 120, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 3, cleanHrs: 2 }] },
  { id: "R22", name: "Summer Shandy", type: RECIPE_TYPES.SEASONAL, style: "Shandy", bblPerBatch: 15, ingredients: [{ materialId: "M01", qtyPerBbl: 22 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 3.0 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 2.5, cleanHrs: 1 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 96, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 48, cleanHrs: 3 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
  { id: "R23", name: "Barrel-Aged Imperial Stout", type: RECIPE_TYPES.SEASONAL, style: "Imperial Stout", bblPerBatch: 5, ingredients: [{ materialId: "M02", qtyPerBbl: 55 }, { materialId: "M04", qtyPerBbl: 2.5 }, { materialId: "M10", qtyPerBbl: 0.01 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 5, cleanHrs: 2 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 3, cleanHrs: 1.5 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 336, cleanHrs: 4 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 240, cleanHrs: 4 }, { step: "package", equipType: EQUIP_TYPES.KEGGING, durationHrs: 2, cleanHrs: 1 }] },
  { id: "R24", name: "Mango Sour", type: RECIPE_TYPES.SEASONAL, style: "Sour", bblPerBatch: 10, ingredients: [{ materialId: "M01", qtyPerBbl: 25 }, { materialId: "M03", qtyPerBbl: 0.8 }, { materialId: "M09", qtyPerBbl: 5.0 }, { materialId: "M12", qtyPerBbl: 0.005 }], steps: [{ step: "mash", equipType: EQUIP_TYPES.MASH, durationHrs: 3, cleanHrs: 1.5 }, { step: "boil", equipType: EQUIP_TYPES.KETTLE, durationHrs: 1.5, cleanHrs: 1 }, { step: "ferment", equipType: EQUIP_TYPES.FERM, durationHrs: 240, cleanHrs: 6 }, { step: "condition", equipType: EQUIP_TYPES.BRITE, durationHrs: 72, cleanHrs: 4 }, { step: "package", equipType: EQUIP_TYPES.CANNER, durationHrs: 4, cleanHrs: 2 }] },
];

const SAMPLE_EQUIPMENT = [
  { id: "E01", name: "Mash Tun A", type: EQUIP_TYPES.MASH, capacityBbl: 20 },
  { id: "E02", name: "Mash Tun B", type: EQUIP_TYPES.MASH, capacityBbl: 35 },
  { id: "E03", name: "Brew Kettle A", type: EQUIP_TYPES.KETTLE, capacityBbl: 20 },
  { id: "E04", name: "Brew Kettle B", type: EQUIP_TYPES.KETTLE, capacityBbl: 35 },
  { id: "E05", name: "Fermenter 1", type: EQUIP_TYPES.FERM, capacityBbl: 20 },
  { id: "E06", name: "Fermenter 2", type: EQUIP_TYPES.FERM, capacityBbl: 20 },
  { id: "E07", name: "Fermenter 3", type: EQUIP_TYPES.FERM, capacityBbl: 30 },
  { id: "E08", name: "Fermenter 4", type: EQUIP_TYPES.FERM, capacityBbl: 30 },
  { id: "E09", name: "Fermenter 5", type: EQUIP_TYPES.FERM, capacityBbl: 15 },
  { id: "E10", name: "Brite Tank 1", type: EQUIP_TYPES.BRITE, capacityBbl: 20 },
  { id: "E11", name: "Brite Tank 2", type: EQUIP_TYPES.BRITE, capacityBbl: 30 },
  { id: "E12", name: "Brite Tank 3", type: EQUIP_TYPES.BRITE, capacityBbl: 15 },
  { id: "E13", name: "Canning Line", type: EQUIP_TYPES.CANNER, capacityBbl: 100 },
  { id: "E14", name: "Kegging Line", type: EQUIP_TYPES.KEGGING, capacityBbl: 100 },
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
  { id: "B001", recipeId: "R01", batchSizeBbl: 15, status: "fermenting", steps: [{ step: "mash", equipId: "E01", start: d(-5), end: d(-5) }, { step: "boil", equipId: "E03", start: d(-5), end: d(-5) }, { step: "ferment", equipId: "E05", start: d(-4), end: d(3) }, { step: "condition", equipId: "E10", start: d(3), end: d(6) }, { step: "package", equipId: "E13", start: d(6), end: d(6) }] },
  { id: "B002", recipeId: "R14", batchSizeBbl: 30, status: "fermenting", steps: [{ step: "mash", equipId: "E02", start: d(-8), end: d(-8) }, { step: "boil", equipId: "E04", start: d(-8), end: d(-8) }, { step: "ferment", equipId: "E07", start: d(-7), end: d(7) }, { step: "condition", equipId: "E11", start: d(7), end: d(12) }, { step: "package", equipId: "E13", start: d(12), end: d(12) }] },
  { id: "B003", recipeId: "R03", batchSizeBbl: 15, status: "conditioning", steps: [{ step: "mash", equipId: "E01", start: d(-10), end: d(-10) }, { step: "boil", equipId: "E03", start: d(-10), end: d(-10) }, { step: "ferment", equipId: "E06", start: d(-9), end: d(-3) }, { step: "condition", equipId: "E12", start: d(-3), end: d(-1) }, { step: "package", equipId: "E13", start: d(-1), end: d(-1) }] },
  { id: "B004", recipeId: "R16", batchSizeBbl: 30, status: "planned", steps: [{ step: "mash", equipId: "E02", start: d(2), end: d(2) }, { step: "boil", equipId: "E04", start: d(2), end: d(2) }, { step: "ferment", equipId: "E08", start: d(3), end: d(10) }, { step: "condition", equipId: "E11", start: d(13), end: d(16) }, { step: "package", equipId: "E13", start: d(16), end: d(16) }] },
  { id: "B005", recipeId: "R05", batchSizeBbl: 15, status: "planned", steps: [{ step: "mash", equipId: "E01", start: d(4), end: d(4) }, { step: "boil", equipId: "E03", start: d(4), end: d(4) }, { step: "ferment", equipId: "E09", start: d(5), end: d(17) }, { step: "condition", equipId: "E12", start: d(17), end: d(22) }, { step: "package", equipId: "E14", start: d(22), end: d(22) }] },
  { id: "B006", recipeId: "R15", batchSizeBbl: 30, status: "planned", steps: [{ step: "mash", equipId: "E02", start: d(6), end: d(6) }, { step: "boil", equipId: "E04", start: d(6), end: d(6) }, { step: "ferment", equipId: "E07", start: d(8), end: d(15) }, { step: "condition", equipId: "E10", start: d(15), end: d(18) }, { step: "package", equipId: "E13", start: d(18), end: d(18) }] },
  { id: "B007", recipeId: "R04", batchSizeBbl: 10, status: "planned", steps: [{ step: "mash", equipId: "E01", start: d(8), end: d(8) }, { step: "boil", equipId: "E03", start: d(8), end: d(8) }, { step: "ferment", equipId: "E05", start: d(4), end: d(12) }, { step: "condition", equipId: "E12", start: d(22), end: d(26) }, { step: "package", equipId: "E14", start: d(26), end: d(26) }] },
  { id: "B008", recipeId: "R20", batchSizeBbl: 10, status: "planned", steps: [{ step: "mash", equipId: "E01", start: d(10), end: d(10) }, { step: "boil", equipId: "E03", start: d(10), end: d(10) }, { step: "ferment", equipId: "E06", start: d(11), end: d(18) }, { step: "condition", equipId: "E10", start: d(19), end: d(22) }, { step: "package", equipId: "E13", start: d(22), end: d(22) }] },
];

const SAMPLE_DEMAND = [
  { id: "D001", recipeId: "R01", volumeBbl: 15, shipDate: d(7), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D002", recipeId: "R14", volumeBbl: 30, shipDate: d(13), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D003", recipeId: "R03", volumeBbl: 5, shipDate: d(2), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D004", recipeId: "R16", volumeBbl: 30, shipDate: d(17), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "contract" },
  { id: "D005", recipeId: "R05", volumeBbl: 15, shipDate: d(23), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D006", recipeId: "R15", volumeBbl: 30, shipDate: d(19), channel: CHANNELS.DISTRIBUTION, format: FORMATS.BARREL, source: "contract" },
  { id: "D007", recipeId: "R01", volumeBbl: 3, shipDate: d(10), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
  { id: "D008", recipeId: "R04", volumeBbl: 10, shipDate: d(27), channel: CHANNELS.DISTRIBUTION, format: FORMATS.BARREL, source: "forecast" },
  { id: "D009", recipeId: "R20", volumeBbl: 10, shipDate: d(23), channel: CHANNELS.DISTRIBUTION, format: FORMATS.CAN, source: "forecast" },
  { id: "D010", recipeId: "R06", volumeBbl: 4, shipDate: d(14), channel: CHANNELS.TAPROOM, format: FORMATS.DRAFT, source: "forecast" },
];

// ─── UTILITIES ──────────────────────────────────────────────────────────────────

const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const addDays = (dateStr, days) => { const dt = new Date(dateStr); dt.setDate(dt.getDate() + days); return dt.toISOString().slice(0, 10); };
const fmtDate = (dateStr) => { const dt = new Date(dateStr + "T00:00:00"); return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }); };
const today = () => new Date().toISOString().slice(0, 10);

const TYPE_COLORS = {
  core: { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
  contract: { bg: "#5c3d1e", border: "#d97706", text: "#fbbf24" },
  seasonal: { bg: "#1e4d3a", border: "#10b981", text: "#6ee7b7" },
};

const STATUS_COLORS = {
  planned: "#64748b",
  mashing: "#f59e0b",
  boiling: "#ef4444",
  fermenting: "#8b5cf6",
  conditioning: "#3b82f6",
  carbonating: "#06b6d4",
  packaging: "#10b981",
  complete: "#22c55e",
};

const STEP_COLORS = {
  mash: "#f59e0b",
  boil: "#ef4444",
  ferment: "#8b5cf6",
  condition: "#3b82f6",
  carbonate: "#06b6d4",
  package: "#10b981",
};

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

function GanttChart({ schedule, equipment, recipes, onEditBatch, dayRange = 35 }) {
  const todayStr = today();
  const startDate = addDays(todayStr, -7);
  const endDate = addDays(todayStr, dayRange - 7);
  const totalDays = daysBetween(startDate, endDate);
  const dayWidth = 32;
  const rowHeight = 36;
  const labelWidth = 140;

  const equipRows = equipment.filter(e => [EQUIP_TYPES.FERM, EQUIP_TYPES.BRITE, EQUIP_TYPES.MASH, EQUIP_TYPES.KETTLE].includes(e.type));

  const getBlocks = () => {
    const blocks = [];
    schedule.forEach(batch => {
      const recipe = recipes.find(r => r.id === batch.recipeId);
      if (!recipe) return;
      const tc = TYPE_COLORS[recipe.type] || TYPE_COLORS.core;
      batch.steps.forEach(step => {
        const eqIdx = equipRows.findIndex(e => e.id === step.equipId);
        if (eqIdx === -1) return;
        const startOff = daysBetween(startDate, step.start);
        const endOff = daysBetween(startDate, step.end) + 1;
        if (endOff < 0 || startOff > totalDays) return;
        blocks.push({
          batchId: batch.id, step: step.step, equipIdx: eqIdx,
          left: Math.max(0, startOff) * dayWidth,
          width: Math.max(1, (Math.min(endOff, totalDays) - Math.max(0, startOff))) * dayWidth - 2,
          color: STEP_COLORS[step.step] || tc.border,
          label: `${recipe.name.replace("[Contract] ", "").slice(0, 12)} · ${step.step}`,
          recipe, batch, tc
        });
      });
    });
    return blocks;
  };

  const blocks = getBlocks();
  const todayOff = daysBetween(startDate, todayStr);
  const chartWidth = totalDays * dayWidth;
  const chartHeight = equipRows.length * rowHeight;

  return (
    <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "65vh" }}>
      <div style={{ display: "flex", minWidth: labelWidth + chartWidth }}>
        {/* Labels */}
        <div style={{ width: labelWidth, flexShrink: 0, position: "sticky", left: 0, zIndex: 2, background: "#111820" }}>
          <div style={{ height: 28, borderBottom: "1px solid #1e293b", padding: "4px 8px", fontSize: "0.65rem", color: "#64748b" }}>Equipment</div>
          {equipRows.map(eq => (
            <div key={eq.id} style={{ height: rowHeight, borderBottom: "1px solid #1e293b11", display: "flex", alignItems: "center", padding: "0 8px", fontSize: "0.75rem", color: "#94a3b8" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: eq.type === EQUIP_TYPES.FERM ? "#8b5cf6" : eq.type === EQUIP_TYPES.BRITE ? "#3b82f6" : eq.type === EQUIP_TYPES.MASH ? "#f59e0b" : "#ef4444", marginRight: 8, flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eq.name}</span>
            </div>
          ))}
        </div>
        {/* Chart */}
        <div style={{ position: "relative", width: chartWidth }}>
          {/* Date headers */}
          <div style={{ display: "flex", height: 28, borderBottom: "1px solid #1e293b" }}>
            {Array.from({ length: totalDays }, (_, i) => {
              const dt = addDays(startDate, i);
              const isToday = dt === todayStr;
              const isWeekend = new Date(dt + "T00:00:00").getDay() % 6 === 0;
              return (
                <div key={i} style={{ width: dayWidth, flexShrink: 0, textAlign: "center", fontSize: "0.55rem", padding: "6px 0", color: isToday ? "#c8854a" : isWeekend ? "#475569" : "#64748b", fontWeight: isToday ? 700 : 400, fontFamily: "'JetBrains Mono', monospace" }}>
                  {fmtDate(dt)}
                </div>
              );
            })}
          </div>
          {/* Grid rows */}
          <div style={{ position: "relative", height: chartHeight }}>
            {equipRows.map((_, i) => (
              <div key={i} style={{ position: "absolute", top: i * rowHeight, left: 0, right: 0, height: rowHeight, borderBottom: "1px solid #1e293b08" }} />
            ))}
            {/* Today line */}
            {todayOff >= 0 && todayOff <= totalDays && (
              <div style={{ position: "absolute", left: todayOff * dayWidth + dayWidth / 2, top: 0, bottom: 0, width: 2, background: "#c8854a88", zIndex: 1 }} />
            )}
            {/* Blocks */}
            {blocks.map((b, i) => (
              <div key={i} onClick={() => onEditBatch(b.batch)} style={{
                position: "absolute", top: b.equipIdx * rowHeight + 4, left: b.left, width: b.width, height: rowHeight - 8,
                background: b.color + "33", border: `1px solid ${b.color}88`, borderRadius: 4,
                display: "flex", alignItems: "center", padding: "0 6px", overflow: "hidden", cursor: "pointer",
                fontSize: "0.6rem", fontWeight: 500, color: b.color, whiteSpace: "nowrap", transition: "all 0.1s"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = b.color + "55"; e.currentTarget.style.zIndex = 10; }}
              onMouseLeave={e => { e.currentTarget.style.background = b.color + "33"; e.currentTarget.style.zIndex = 0; }}
              >
                {b.width > 60 ? b.label : b.step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCHEDULE OPTIMIZER TAB ─────────────────────────────────────────────────────

function ScheduleOptimizer({ schedule, setSchedule, equipment, recipes, demand }) {
  const [editBatch, setEditBatch] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecipe, setNewRecipe] = useState("");
  const [newStart, setNewStart] = useState(d(5));

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", margin: 0 }}>Production Schedule</h2>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>Drag timeline to scroll · Click blocks to edit · {schedule.length} batches scheduled</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {conflicts.length > 0 && <span style={baseStyles.badge("#ef4444")}>{conflicts.length} conflict{conflicts.length > 1 ? "s" : ""}</span>}
          <button style={baseStyles.btn("primary")} onClick={() => setShowAdd(true)}>+ Add Batch</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.entries(STEP_COLORS).map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.7rem", color: "#94a3b8" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c + "66", border: `1px solid ${c}` }} />
            {k}
          </div>
        ))}
      </div>

      <div style={baseStyles.card}>
        <GanttChart schedule={schedule} equipment={equipment} recipes={recipes} onEditBatch={setEditBatch} />
      </div>

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
      <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: 16 }}>{recipes.length} recipes · 13 core · 6 contract · {recipes.length - 19} seasonal/specialty</div>

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

// ─── MAIN APP ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: "schedule", label: "Schedule Optimizer", icon: "📅" },
  { id: "materials", label: "Material Orders", icon: "📦" },
  { id: "production", label: "Production Status", icon: "🏭" },
  { id: "inventory", label: "Inventory", icon: "📊" },
  { id: "demand", label: "Demand Forecasts", icon: "📈" },
  { id: "recipes", label: "Recipes", icon: "🍺" },
];

export default function BreweryPlanner() {
  const [tab, setTab] = useState("schedule");
  const [recipes] = useState(SAMPLE_RECIPES);
  const [equipment] = useState(SAMPLE_EQUIPMENT);
  const [materials] = useState(SAMPLE_MATERIALS);
  const [schedule, setSchedule] = useState(SAMPLE_SCHEDULE);
  const [demand, setDemand] = useState(SAMPLE_DEMAND);

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
        {tab === "schedule" && <ScheduleOptimizer schedule={schedule} setSchedule={setSchedule} equipment={equipment} recipes={recipes} demand={demand} />}
        {tab === "materials" && <MaterialOrders schedule={schedule} recipes={recipes} materials={materials} equipment={equipment} />}
        {tab === "production" && <ProductionStatus schedule={schedule} equipment={equipment} recipes={recipes} />}
        {tab === "inventory" && <InventoryDashboard materials={materials} schedule={schedule} recipes={recipes} />}
        {tab === "demand" && <DataManager demand={demand} setDemand={setDemand} recipes={recipes} />}
        {tab === "recipes" && <RecipeBrowser recipes={recipes} materials={materials} />}
      </div>
    </div>
  );
}
