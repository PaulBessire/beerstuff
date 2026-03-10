import { useState, useCallback } from "react";

const PRELOADED_RAW = [
  { itemid: "PakTech - Can 6Pak: Tropical Orange - DO NOT USE", totalquantityonhand: 1632000, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Black", totalquantityonhand: 1106700, averagecost: 0 },
  { itemid: "Can End - Gold/Gold - Cornbread", totalquantityonhand: 669269, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Yellow", totalquantityonhand: 464100, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Drink Daizy's Watermelon Lime", totalquantityonhand: 369087, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Watermelon Lime", totalquantityonhand: 360917, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Drink Daizy's Tropical Punch", totalquantityonhand: 305297, averagecost: 0 },
  { itemid: "Can End - Silver/Silver XO - Drink Daizy's", totalquantityonhand: 285120, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Drink Daizy's Strawberry Lemonade", totalquantityonhand: 272542, averagecost: 0 },
  { itemid: "Attenuzyme Pro", totalquantityonhand: 249250, averagecost: 0.005 },
  { itemid: "Carton - 4pk 12oz Sleek - Drink Daizy's Passion Fruit", totalquantityonhand: 247943, averagecost: 0 },
  { itemid: "Can End - Silver/Silver", totalquantityonhand: 230310, averagecost: 0.042 },
  { itemid: "Lactic Acid", totalquantityonhand: 200000, averagecost: 0.001 },
  { itemid: "Carton - 4pk 12oz Sleek - Drink Daizy's Grape", totalquantityonhand: 198406, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Grape", totalquantityonhand: 190243, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Tropical Punch", totalquantityonhand: 153298, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Raspberry Limeade", totalquantityonhand: 137667, averagecost: 0 },
  { itemid: "Bottle Crown - Braxton", totalquantityonhand: 134942, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Salted Watermelon", totalquantityonhand: 134560, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Peach Tea", totalquantityonhand: 132036, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Raspberry Limeade 10mg", totalquantityonhand: 100188, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Blueberry Breeze 10mg", totalquantityonhand: 100188, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Passion Fruit", totalquantityonhand: 94878, averagecost: 0 },
  { itemid: "Carton - 12pk 12oz Sleek - Drink Daizy's Sampler", totalquantityonhand: 91930, averagecost: 0 },
  { itemid: "Can End - Gold/Gold", totalquantityonhand: 88824, averagecost: 0.045 },
  { itemid: "Can Shell - 12oz - Scooter Blood Orange Radler (NEW)", totalquantityonhand: 83146, averagecost: 0.198 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Strawberry Lemonade", totalquantityonhand: 78323, averagecost: 0 },
  { itemid: "Can Shell - 12oz Sleek - Birdie - PROCESSING CAN", totalquantityonhand: 56016, averagecost: 0.15 },
  { itemid: "Can Shell - 12oz - Blueprint (Printed)", totalquantityonhand: 55524, averagecost: 0.178 },
  { itemid: "Can Shell - 12oz - Dead Blow (#6006726)", totalquantityonhand: 53293, averagecost: 0.083 },
  { itemid: "Phosphoric Acid", totalquantityonhand: 52996, averagecost: 0.028 },
  { itemid: "Can End - Gold - Estazzi", totalquantityonhand: 52978, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Bavarian Select Lager", totalquantityonhand: 52904, averagecost: 0.117 },
  { itemid: "Carton - Sleek 12pk - Del Ray - Variety", totalquantityonhand: 51932, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Margarita Gose", totalquantityonhand: 50181, averagecost: 0.049 },
  { itemid: "Extra Fine Granulated Sugar (50#)", totalquantityonhand: 49008, averagecost: 0.77 },
  { itemid: "Can Shell - 12oz - Sleek - Cornbread Blueberry Breeze", totalquantityonhand: 48491, averagecost: 0 },
  { itemid: "Box - Case Tray: 24 PACK SLEEK - Drink Daizy's", totalquantityonhand: 37360, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Sleek - Drink Daizy's Blueberry Lemonade", totalquantityonhand: 36432, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Cornbread Blueberry Breeze", totalquantityonhand: 30660, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Cornbread Peach Tea", totalquantityonhand: 25775, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Cornbread Raspberry Limeade", totalquantityonhand: 25665, averagecost: 0 },
  { itemid: "Carton - 4pk 12oz Sleek - Cornbread Salted Watermelon", totalquantityonhand: 25637, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Opaque Blue", totalquantityonhand: 25500, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Seafoam", totalquantityonhand: 25500, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Birdie (Shrink)", totalquantityonhand: 25285, averagecost: 0.285 },
  { itemid: "Carton - Beer - Ballpark Beer - 12pk", totalquantityonhand: 24063, averagecost: 0.469 },
  { itemid: "Can Shell - 12oz - Storm (NEW)", totalquantityonhand: 22951, averagecost: 0.13 },
  { itemid: "Can Shell - 12oz - Switch IPA (Printed) (NEW)", totalquantityonhand: 21784, averagecost: 0.14 },
  { itemid: "Can Shell - 12oz - Hop Ridge", totalquantityonhand: 18672, averagecost: 0.285 },
  { itemid: "SILO 2 Rahr Blend Pilsner Bulk", totalquantityonhand: 18667, averagecost: 0.39 },
  { itemid: "Fermentis SafAle - US-05 (500g)", totalquantityonhand: 16500, averagecost: 0.133 },
  { itemid: "Fermentis SafLager W-34/70", totalquantityonhand: 14000, averagecost: 0.22 },
  { itemid: "Can Shell - 16oz - Ballpark Beer (Juno)", totalquantityonhand: 13204, averagecost: 0.15 },
  { itemid: "Can Shell - 12oz - LaRosa's Lager", totalquantityonhand: 12837, averagecost: 0.073 },
  { itemid: "Can Shell - 12oz - Ballpark Beer (Juno)", totalquantityonhand: 12158, averagecost: 0.15 },
  { itemid: "Carton - Beer 15pk - Spur", totalquantityonhand: 11925, averagecost: 0.598 },
  { itemid: "Can Shell - 12oz - Oktober Fuel (#6006728)", totalquantityonhand: 11670, averagecost: 0.123 },
  { itemid: "Carton - 8pk Sleek - Canvus Bengals Variety", totalquantityonhand: 11206, averagecost: 0 },
  { itemid: "Can Shell - 12oz - OKI Bourbon Barrel Ale (Shrink)", totalquantityonhand: 10892, averagecost: 0.257 },
  { itemid: "Can Shell - 12oz - Opera Cream Stout (Shrink)", totalquantityonhand: 10503, averagecost: 0.26 },
  { itemid: "Carton - 8pk Sleek - Drink Daizy's Sampler", totalquantityonhand: 10400, averagecost: 0 },
  { itemid: "Whirlfloc T (new)", totalquantityonhand: 9900, averagecost: 0.066 },
  { itemid: "Carton - 8pk Sleek - Canvus Variety Pack", totalquantityonhand: 9806, averagecost: 0 },
  { itemid: "Carton - Beer 15pk - Switch (Belmark)", totalquantityonhand: 9675, averagecost: 0.68 },
  { itemid: "Can Shell - 12oz - Flurry", totalquantityonhand: 8947, averagecost: 0.339 },
  { itemid: "Keg Collar", totalquantityonhand: 8923, averagecost: 0.177 },
  { itemid: "PakTech - Can 4Pak: Gold", totalquantityonhand: 8580, averagecost: 0.17 },
  { itemid: "Can Shell - 12oz - Sleek - Estazzi Orange", totalquantityonhand: 8421, averagecost: 0 },
  { itemid: "Box - Case Tray: 12oz Sleek 24pk - Cornbread", totalquantityonhand: 7991, averagecost: 0 },
  { itemid: "Whirlfloc T", totalquantityonhand: 7414, averagecost: 0.144 },
  { itemid: "Can Shell - 12oz - Graeter's Pumpkin Pie (Shrink)", totalquantityonhand: 7391, averagecost: 0.286 },
  { itemid: "Can Shell - 16oz - Hop Fly (Juno)", totalquantityonhand: 7391, averagecost: 0.15 },
  { itemid: "PakTech - Can QuadPak: Black", totalquantityonhand: 7092, averagecost: 0.16 },
  { itemid: "Carolina Malt - Pilsner", totalquantityonhand: 6700, averagecost: 0.848 },
  { itemid: "Can Shell - 12oz - Tropic Flare", totalquantityonhand: 6613, averagecost: 0.16 },
  { itemid: "Lactose", totalquantityonhand: 6545, averagecost: 0.132 },
  { itemid: "SILO 1 Prairie 2 Row Bulk", totalquantityonhand: 6473, averagecost: 0.3 },
  { itemid: "Label - Can 16oz - American Water", totalquantityonhand: 6000, averagecost: 0 },
  { itemid: "Fermentis SafAle - E-30 (500g)", totalquantityonhand: 6000, averagecost: 0.217 },
  { itemid: "Can Shell - 12oz - Blueprint", totalquantityonhand: 5835, averagecost: 0.322 },
  { itemid: "Can Shell - Sleek - Chattanooga Ginger", totalquantityonhand: 5799, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Deadless Citrus Sinner", totalquantityonhand: 5512, averagecost: 0.345 },
  { itemid: "PakTech: 6Pack - Tropical Orange", totalquantityonhand: 5494, averagecost: 0.208 },
  { itemid: "Can Shell - Sleek - Deadless Evil Island", totalquantityonhand: 5365, averagecost: 0.345 },
  { itemid: "Lallemand - Diamond Lager (500g)", totalquantityonhand: 5000, averagecost: 0.33 },
  { itemid: "Box - Case Tray: 12oz Sleek 12pk - Blank", totalquantityonhand: 5000, averagecost: 0.22 },
  { itemid: "Can Shell - Sleek - Estazzi Grapefruit", totalquantityonhand: 4942, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Estazzi Lemon", totalquantityonhand: 4844, averagecost: 0 },
  { itemid: "Box - Case Tray: 12oz Sleek 24pk - Blank Kraft", totalquantityonhand: 4800, averagecost: 0.27 },
  { itemid: "PakTech - Can 6Pak: Cream", totalquantityonhand: 4590, averagecost: 0.206 },
  { itemid: "Carton - Beer - Birdie - 12pk", totalquantityonhand: 4590, averagecost: 0.581 },
  { itemid: "Can Shell - Sleek - Deadless Bloody Berry", totalquantityonhand: 4434, averagecost: 0.345 },
  { itemid: "Fermentis SafAle - S-04 (500g)", totalquantityonhand: 4000, averagecost: 0.139 },
  { itemid: "Can Shell - 16oz - Drift (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Can Shell - 16oz - Verano Lime (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Can Shell - 16oz - Scooter (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Can Shell - 16oz - Summertrip (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Can Shell - 16oz - Kickback (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Can Shell - 16oz - Storm (Juno)", totalquantityonhand: 3890, averagecost: 0.15 },
  { itemid: "Carton - Beer - Scooter - 12pk", totalquantityonhand: 3740, averagecost: 0.581 },
  { itemid: "Carton - 4pk Sleek - Deadless Citrus Sinner", totalquantityonhand: 3728, averagecost: 0 },
  { itemid: "Carton - 4pk Sleek - Deadless Evil Island", totalquantityonhand: 3705, averagecost: 0 },
  { itemid: "Hop: Resinate - Warrior (300 GMA)", totalquantityonhand: 3600, averagecost: 0.156 },
  { itemid: "Carton - 4pk Sleek - Deadless Bloody Berry", totalquantityonhand: 3402, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Gold", totalquantityonhand: 3293, averagecost: 0.206 },
  { itemid: "Keg Cap - Vented White", totalquantityonhand: 3112, averagecost: 0.082 },
  { itemid: "Can End - Gold/Gold - Southampton", totalquantityonhand: 2774, averagecost: 0 },
  { itemid: "Can Shell - 12oz - Dry Hopped Pilsner (Juno)", totalquantityonhand: 2723, averagecost: 0.3 },
  { itemid: "Can Shell - 12oz - Drift (Juno)", totalquantityonhand: 2723, averagecost: 0.3 },
  { itemid: "Bottle - Celebration - 500mL", totalquantityonhand: 2539, averagecost: 0.877 },
  { itemid: "OIO Toasted Flaked Rice", totalquantityonhand: 2525, averagecost: 1.445 },
  { itemid: "Lallemand - CBC-1 (500g)", totalquantityonhand: 2500, averagecost: 0.302 },
  { itemid: "PVC Clear Cut Bands w/ Perforation", totalquantityonhand: 2473, averagecost: 0.079 },
  { itemid: "Flaked Maize - OIO (50#)", totalquantityonhand: 2400, averagecost: 1.773 },
  { itemid: "Can Shell - 12oz - Kranz (Juno)", totalquantityonhand: 2334, averagecost: 0.3 },
  { itemid: "Carton - 12pk Sleek - Deadless Variety", totalquantityonhand: 2302, averagecost: 0 },
  { itemid: "Rahr - White Wheat", totalquantityonhand: 2200, averagecost: 0.737 },
  { itemid: "Carton - Sleek 12pk - Volay Grapefruit", totalquantityonhand: 2080, averagecost: 0 },
  { itemid: "Corn Sugar (Dextrose)", totalquantityonhand: 2060, averagecost: 1.012 },
  { itemid: "Can Shell - Sleek - Canvus Raspberry Lemonade", totalquantityonhand: 2046, averagecost: 0 },
  { itemid: "Lallemand - Philly Sour (500g)", totalquantityonhand: 2000, averagecost: 0.385 },
  { itemid: "Citric Acid (50#)", totalquantityonhand: 1995, averagecost: 2.463 },
  { itemid: "Carton - 4pk Sleek - Estazzi Orange", totalquantityonhand: 1966, averagecost: 0 },
  { itemid: "Label - Can 12oz - Larosas Lager", totalquantityonhand: 1950, averagecost: 0.124 },
  { itemid: "Can Shell - 16oz - Switch (Juno)", totalquantityonhand: 1930, averagecost: 0.15 },
  { itemid: "Carton - Sleek 12pk - Volay Watermelon Mint", totalquantityonhand: 1900, averagecost: 0 },
  { itemid: "Can Shell - 16oz - Blueprint (Juno)", totalquantityonhand: 1881, averagecost: 0.3 },
  { itemid: "Weyermann - Pale Wheat", totalquantityonhand: 1870, averagecost: 0.862 },
  { itemid: "Bottle - Cali CA750 - 750ml", totalquantityonhand: 1805, averagecost: 1.621 },
  { itemid: "PakTech - Can 6Pak: Brown", totalquantityonhand: 1800, averagecost: 0.206 },
  { itemid: "Can Shell - 16oz - Verano (Juno)", totalquantityonhand: 1783, averagecost: 0.15 },
  { itemid: "Carton - Sleek 4pk - Del Ray Southern Belle", totalquantityonhand: 1741, averagecost: 0 },
  { itemid: "Carton - Sleek 4pk - Del Ray Farmers Daughter", totalquantityonhand: 1681, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Iris", totalquantityonhand: 1655, averagecost: 0.175 },
  { itemid: "30x12 Antique Black Shank Closure", totalquantityonhand: 1581, averagecost: 0.332 },
  { itemid: "Carton - Sleek 4pk - Del Ray Sailors Delight", totalquantityonhand: 1570, averagecost: 0 },
  { itemid: "Carton - Sleek 12pk - Volay Tropical Lime", totalquantityonhand: 1560, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Brite", totalquantityonhand: 1527, averagecost: 0.209 },
  { itemid: "PakTech - Can 6Pak: Steel Blue", totalquantityonhand: 1500, averagecost: 0 },
  { itemid: "Carton - 12pk Sleek - Deadless Evil Island", totalquantityonhand: 1443, averagecost: 0 },
  { itemid: "Carton - 12pk Sleek - Deadless Citrus Sinner", totalquantityonhand: 1437, averagecost: 0 },
  { itemid: "Carton - 12pk Sleek - Deadless Bloody Berry", totalquantityonhand: 1399, averagecost: 0 },
  { itemid: "NFC Orange Juice - Estazzi", totalquantityonhand: 1353, averagecost: 0 },
  { itemid: "NFC Lemon Juice - Estazzi", totalquantityonhand: 1347, averagecost: 0 },
  { itemid: "Simpsons - Caramalt", totalquantityonhand: 1308, averagecost: 1.203 },
  { itemid: "Can Shell - Sleek - Canvus Cucumber Jalapeno", totalquantityonhand: 1294, averagecost: 0 },
  { itemid: "Rahr - Standard 2-Row", totalquantityonhand: 1265, averagecost: 0.709 },
  { itemid: "PakTech - Can 6Pak: Spring Green", totalquantityonhand: 1200, averagecost: 0.155 },
  { itemid: "PakTech - Can QuadPak: Burgundy", totalquantityonhand: 1182, averagecost: 0.168 },
  { itemid: "Can Shell - 16oz - Bavarian (Juno)", totalquantityonhand: 1167, averagecost: 0.15 },
  { itemid: "Can Shell - Sleek - Del Ray Southern Belle", totalquantityonhand: 1163, averagecost: 0 },
  { itemid: "Blueberry Juice Concentrate - Daizy's", totalquantityonhand: 1155, averagecost: 0 },
  { itemid: "Carton - 4pk Sleek - Estazzi Grapefruit", totalquantityonhand: 1114, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Tropical Lime", totalquantityonhand: 1020, averagecost: 0.206 },
  { itemid: "Chocolate Malt - Simpsons (55#)", totalquantityonhand: 1013, averagecost: 1.032 },
  { itemid: "PakTech - Can 6Pak: Red", totalquantityonhand: 1001, averagecost: 0.206 },
  { itemid: "Grain Millers Flaked Oats", totalquantityonhand: 1000, averagecost: 0.832 },
  { itemid: "Fermentis SafAle WB-06 (500g)", totalquantityonhand: 1000, averagecost: 0.212 },
  { itemid: "Lalbrew Farmhouse", totalquantityonhand: 1000, averagecost: 0.441 },
  { itemid: "Can Shell - Sleek - Canvus Bourbon Mule", totalquantityonhand: 998, averagecost: 0 },
  { itemid: "Orange Juice Concentrate - Daizy's", totalquantityonhand: 990, averagecost: 0 },
  { itemid: "PakTech - Can 6Pak: Purple", totalquantityonhand: 960, averagecost: 0.18 },
  { itemid: "Weyermann - Caramunich 1", totalquantityonhand: 935, averagecost: 0.987 },
  { itemid: "Weyermann - Munich Lt Type 1", totalquantityonhand: 935, averagecost: 0.942 },
  { itemid: "Simpsons - Pale Chocolate", totalquantityonhand: 935, averagecost: 1.043 },
  { itemid: "Can Shell - Sleek - Canvus Bourbon Lemon Spice", totalquantityonhand: 924, averagecost: 0 },
  { itemid: "Biscuit Malt - Dingemans (55#)", totalquantityonhand: 922, averagecost: 1.043 },
  { itemid: "Can Shell - Sleek - Del Ray Southern Belle 20mg", totalquantityonhand: 910, averagecost: 0 },
  { itemid: "Monkfruit Juice Concentrate - Cornbread", totalquantityonhand: 858, averagecost: 0 },
  { itemid: "Carton - 6pk Standard - Switch", totalquantityonhand: 840, averagecost: 0.327 },
  { itemid: "Bottle - Amber 22oz Commander", totalquantityonhand: 825, averagecost: 0.779 },
  { itemid: "NFC Grapefruit Juice - Estazzi", totalquantityonhand: 791, averagecost: 0 },
  { itemid: "Apple Juice Concentrate - Pail (56#)", totalquantityonhand: 784, averagecost: 2.909 },
  { itemid: "Black Tea Essence - Cornbread", totalquantityonhand: 783, averagecost: 0 },
  { itemid: "Rice Syrup Solids (50#)", totalquantityonhand: 750, averagecost: 3.247 },
  { itemid: "Weyermann - Vienna", totalquantityonhand: 715, averagecost: 0.909 },
  { itemid: "Carton - 4pk Sleek - Estazzi Lemon", totalquantityonhand: 713, averagecost: 0 },
  { itemid: "Carton - Beer 15pk - Blueprint", totalquantityonhand: 700, averagecost: 0.847 },
  { itemid: "Perfectly Dosed THC - Daizy's", totalquantityonhand: 659, averagecost: 0 },
  { itemid: "Rice Hulls", totalquantityonhand: 659, averagecost: 0.74 },
  { itemid: "Can Shell - Sleek - Del Ray Iced Tea", totalquantityonhand: 648, averagecost: 0 },
  { itemid: "Apple Juice Concentrate - Drum", totalquantityonhand: 606, averagecost: 1.898 },
  { itemid: "Crisp - Crystal 120L", totalquantityonhand: 605, averagecost: 1.019 },
  { itemid: "Simpsons - Double Roasted Crystal", totalquantityonhand: 605, averagecost: 1.112 },
  { itemid: "Crisp: Naked Oat Malt", totalquantityonhand: 605, averagecost: 1.093 },
  { itemid: "Peach Type Flavor - Cornbread", totalquantityonhand: 571, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Volay Tropical Lime", totalquantityonhand: 567, averagecost: 0 },
  { itemid: "Watermelon Flavor - Cornbread", totalquantityonhand: 566, averagecost: 0 },
  { itemid: "Label - Cornbread Salted Watermelon ND", totalquantityonhand: 558, averagecost: 0 },
  { itemid: "Pilsen Malt - Proximity (55#)", totalquantityonhand: 550, averagecost: 0.473 },
  { itemid: "Can Shell - Sleek - Delta Vine White", totalquantityonhand: 516, averagecost: 0 },
  { itemid: "Ghirardelli Chocolate Sauce (64oz)", totalquantityonhand: 512, averagecost: 0.274 },
  { itemid: "Paktech - 6pk Dark Pink", totalquantityonhand: 510, averagecost: 0.206 },
  { itemid: "PakTech - 6Pak Sleek: White", totalquantityonhand: 510, averagecost: 0.255 },
  { itemid: "Lallemand - BRY-97 (500g)", totalquantityonhand: 500, averagecost: 0.331 },
  { itemid: "Weyermann - Caramunich 2", totalquantityonhand: 495, averagecost: 0.941 },
  { itemid: "Box - Case Tray: Sleek 24pk - Canvus", totalquantityonhand: 470, averagecost: 0 },
  { itemid: "Weyermann - Munich Dk Type 2", totalquantityonhand: 440, averagecost: 0.935 },
  { itemid: "ADM Erythritol (25KG/55#)", totalquantityonhand: 425, averagecost: 0.768 },
  { itemid: "Carton - Sleek 12pk - Birdie", totalquantityonhand: 420, averagecost: 0.497 },
  { itemid: "Natural Lime Flavor (Key Lime) - Cornbread", totalquantityonhand: 410, averagecost: 0 },
  { itemid: "Raspberry Flavor - Cornbread", totalquantityonhand: 400, averagecost: 0 },
  { itemid: "Nat Blueberry Lemonade Flavor - Daizy's", totalquantityonhand: 360, averagecost: 0 },
  { itemid: "Citra", totalquantityonhand: 357.96, averagecost: 14.018 },
  { itemid: "Focus IRC Beer Base 21%", totalquantityonhand: 350.43, averagecost: 7.872 },
  { itemid: "Crisp - Pale Chocolate", totalquantityonhand: 347, averagecost: 1.033 },
  { itemid: "Lime Flavor FAQS014", totalquantityonhand: 341.6, averagecost: 18.797 },
  { itemid: "Hallertau Mittelfruh", totalquantityonhand: 330.6, averagecost: 13.088 },
  { itemid: "Can Shell - Sleek - Southampton Southside", totalquantityonhand: 311, averagecost: 0 },
  { itemid: "Lemon Juice Concentrate 400 GPL (51#)", totalquantityonhand: 308, averagecost: 5.041 },
  { itemid: "Loral", totalquantityonhand: 297, averagecost: 9.95 },
  { itemid: "Mosaic", totalquantityonhand: 289.52, averagecost: 13.999 },
  { itemid: "Simpsons - Crystal T50", totalquantityonhand: 276, averagecost: 1.016 },
  { itemid: "Natural Flavor Blender V18", totalquantityonhand: 259.92, averagecost: 10.787 },
  { itemid: "Nat Cream Type Flavor - Daizy's", totalquantityonhand: 250, averagecost: 0 },
  { itemid: "Azacca", totalquantityonhand: 242, averagecost: 14.94 },
  { itemid: "Nat Orange Flavor WONF - Daizy's", totalquantityonhand: 240, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Del Ray Sailors Delight 20mg", totalquantityonhand: 224, averagecost: 0 },
  { itemid: "Bottle - Amber 12oz Heritage", totalquantityonhand: 222, averagecost: 0.305 },
  { itemid: "Strawberry Juice Concentrate 65 Brix (55#)", totalquantityonhand: 220, averagecost: 8.152 },
  { itemid: "Galaxy", totalquantityonhand: 217, averagecost: 18.17 },
  { itemid: "Label - Cornbread Peach Tea", totalquantityonhand: 215, averagecost: 0 },
  { itemid: "Nat Orange Flavor Extract WONF - Daizy's", totalquantityonhand: 200, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Del Ray Strawberry Lem 20mg", totalquantityonhand: 199, averagecost: 0 },
  { itemid: "TrueBoost Amplify - Southampton", totalquantityonhand: 197, averagecost: 0 },
  { itemid: "Label - Cornbread Blueberry Breeze ND", totalquantityonhand: 190, averagecost: 0 },
  { itemid: "Malic Acid", totalquantityonhand: 172.5, averagecost: 4.337 },
  { itemid: "EFG Sugar (50#) - Del Ray", totalquantityonhand: 170, averagecost: 0 },
  { itemid: "Calcium Carbonate", totalquantityonhand: 168.35, averagecost: 0.895 },
  { itemid: "Label - Cornbread Peach Tea ND", totalquantityonhand: 166, averagecost: 0 },
  { itemid: "Origin Malt Pils20 (55#)", totalquantityonhand: 165, averagecost: 0.66 },
  { itemid: "Weyermann - Carafa Dehusk 2", totalquantityonhand: 163, averagecost: 1.037 },
  { itemid: "Jalapeno Flavor Natural Type", totalquantityonhand: 161, averagecost: 0 },
  { itemid: "Lallemand CBC-1 Sachet (50x11g)", totalquantityonhand: 154, averagecost: 0.364 },
  { itemid: "Potassium Metabisulfite (55#)", totalquantityonhand: 149, averagecost: 1.932 },
  { itemid: "Cascade", totalquantityonhand: 145, averagecost: 9 },
  { itemid: "Lime Natural Extract (30.5#)", totalquantityonhand: 145, averagecost: 0 },
  { itemid: "Sodium Chloride", totalquantityonhand: 141, averagecost: 0.578 },
  { itemid: "Label - Cornbread Raspberry Limeade ND", totalquantityonhand: 141, averagecost: 0 },
  { itemid: "Label - Cornbread Blueberry Breeze", totalquantityonhand: 141, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Del Ray Strawberry Lem", totalquantityonhand: 134, averagecost: 0 },
  { itemid: "Czech Saaz", totalquantityonhand: 132.44, averagecost: 14.101 },
  { itemid: "Cashmere", totalquantityonhand: 132, averagecost: 11.26 },
  { itemid: "Grungeist", totalquantityonhand: 132, averagecost: 0 },
  { itemid: "Meyer Lemon WONF Extract - Canvus", totalquantityonhand: 132, averagecost: 0 },
  { itemid: "Spice Flavor Natural (34.5#)", totalquantityonhand: 131, averagecost: 0 },
  { itemid: "Cimmerian Extract - Cornbread", totalquantityonhand: 126, averagecost: 0 },
  { itemid: "Fermcap AT", totalquantityonhand: 121, averagecost: 1.914 },
  { itemid: "Gypsum (Calcium Sulfate)", totalquantityonhand: 119.28, averagecost: 0.463 },
  { itemid: "Label - Cornbread Raspberry Limeade", totalquantityonhand: 117, averagecost: 0 },
  { itemid: "Sweet Mouthfeel Type (33#)", totalquantityonhand: 113, averagecost: 0 },
  { itemid: "Sinamar - Weyermann", totalquantityonhand: 112.5, averagecost: 7.974 },
  { itemid: "Crisp - Crystal 60L", totalquantityonhand: 110, averagecost: 0.618 },
  { itemid: "Sodium Citrate Dihydrate (55#)", totalquantityonhand: 110, averagecost: 3.298 },
  { itemid: "Weyermann - Carafa Dehusk 3", totalquantityonhand: 110, averagecost: 1.031 },
  { itemid: "OJ Concentrate Clarified 65 Brix (55#)", totalquantityonhand: 110, averagecost: 5.128 },
  { itemid: "Weyermann - Carafa 3", totalquantityonhand: 110, averagecost: 1.098 },
  { itemid: "Crisp - Crystal 77L", totalquantityonhand: 110, averagecost: 0.841 },
  { itemid: "Simpsons - Amber", totalquantityonhand: 110, averagecost: 0.925 },
  { itemid: "Weyermann - Spelt Malt", totalquantityonhand: 110, averagecost: 1.615 },
  { itemid: "Origin Malt LPB (55#)", totalquantityonhand: 110, averagecost: 0.66 },
  { itemid: "Cara 30-37L - Bairds (55#)", totalquantityonhand: 110, averagecost: 0.645 },
  { itemid: "Simpsons - Chocolate", totalquantityonhand: 110, averagecost: 1.001 },
  { itemid: "SUCRALOSE DR400", totalquantityonhand: 107.25, averagecost: 29.318 },
  { itemid: "Tangerine Juice Concentrate - Estazzi", totalquantityonhand: 107, averagecost: 0 },
  { itemid: "Can Shell - Sleek - Peel Black Cherry", totalquantityonhand: 106, averagecost: 0 },
  { itemid: "Moscow Mule Natural Flavor", totalquantityonhand: 105, averagecost: 0 },
  { itemid: "Grape Juice Concentrate White 68 Brix", totalquantityonhand: 105, averagecost: 0 },
  { itemid: "Water Treatment Salts", totalquantityonhand: 100, averagecost: 2.778 },
  { itemid: "Coconut - Shredded", totalquantityonhand: 100, averagecost: 3.39 },
  { itemid: "PakTech - Can 6Pak: Pearl", totalquantityonhand: 100, averagecost: 0.206 },
  { itemid: "Box - Case Tray: Standard 24pk Braxton Kraft", totalquantityonhand: 94, averagecost: 0.31 },
  { itemid: "Label - Cornbread Salted Watermelon", totalquantityonhand: 92, averagecost: 0 },
  { itemid: "Nat Pink Lemonade Flavor - Daizy's", totalquantityonhand: 90, averagecost: 0 },
  { itemid: "Lorien", totalquantityonhand: 88, averagecost: 11.546 },
  { itemid: "Belma", totalquantityonhand: 88, averagecost: 7.7 },
  { itemid: "Spalter Select", totalquantityonhand: 88, averagecost: 9.07 },
  { itemid: "Weyermann - Carafa DeHusk 1", totalquantityonhand: 85, averagecost: 0.975 },
  { itemid: "Muslin Hop Bag 5x15", totalquantityonhand: 84, averagecost: 1.243 },
  { itemid: "Citrus Lemonade Natural Extract", totalquantityonhand: 84, averagecost: 0 },
  { itemid: "Calcium Chloride", totalquantityonhand: 80.5, averagecost: 1.077 },
  { itemid: "Rahr - Premium Pilsner", totalquantityonhand: 79.75, averagecost: 0.771 },
  { itemid: "Carton - 4pk Sleek - Canvus Raspberry Lemonade", totalquantityonhand: 79, averagecost: 0 },
  { itemid: "Idaho 7", totalquantityonhand: 77, averagecost: 11.764 },
  { itemid: "Natural Juicy Lime Type Ext (25# Pail)", totalquantityonhand: 75, averagecost: 0 },
  { itemid: "Blueberry Flavor - Cornbread", totalquantityonhand: 73, averagecost: 0 },
  { itemid: "Orange Peel Bitter (Seville)", totalquantityonhand: 70, averagecost: 10.314 },
  { itemid: "Barrel - 53G OKI Rye Whiskey", totalquantityonhand: 70, averagecost: 0 },
  { itemid: "Glue ASP-250A (30#)", totalquantityonhand: 66, averagecost: 0 },
  { itemid: "Sabro", totalquantityonhand: 66, averagecost: 14.364 },
  { itemid: "Yeastex 82", totalquantityonhand: 64.52, averagecost: 0.992 },
  { itemid: "Natural Crema Di Caramel - Amoretti", totalquantityonhand: 60, averagecost: 11.904 },
  { itemid: "GF Nat Grapefruit WONF Ext", totalquantityonhand: 58, averagecost: 0 },
  { itemid: "Hemp Azuca RTD Activator - Del Ray", totalquantityonhand: 58, averagecost: 0 },
  { itemid: "Barbe Rouge", totalquantityonhand: 57.5, averagecost: 11.003 },
  { itemid: "Can Shell - Sleek - Peel Lime", totalquantityonhand: 57, averagecost: 0 },
  { itemid: "Grape Juice Concentrate White 68Bx (Delta Vine)", totalquantityonhand: 56, averagecost: 0 },
  { itemid: "Weyermann - Acidulated", totalquantityonhand: 55, averagecost: 1.284 },
  { itemid: "Crisp - Chocolate", totalquantityonhand: 55, averagecost: 0.993 },
  { itemid: "Origin Malt C60 (55#)", totalquantityonhand: 55, averagecost: 0.86 },
  { itemid: "Amarillo", totalquantityonhand: 55, averagecost: 14.695 },
  { itemid: "Coriander Seed", totalquantityonhand: 55, averagecost: 8.44 },
  { itemid: "Exberry Shade Vivid Red", totalquantityonhand: 55, averagecost: 15.087 },
  { itemid: "Crisp - Torrefied Wheat", totalquantityonhand: 55, averagecost: 0.897 },
  { itemid: "Simpsons - Roasted Barley", totalquantityonhand: 55, averagecost: 0.999 },
  { itemid: "Weyermann - Pilsner", totalquantityonhand: 55, averagecost: 0.936 },
  { itemid: "Calcium Disodium - Delta Vine", totalquantityonhand: 54, averagecost: 0 },
  { itemid: "Spraygum AP - Peel", totalquantityonhand: 54, averagecost: 0 },
  { itemid: "Dark Cherry Juice Concentrate 68Bx - Peel", totalquantityonhand: 53, averagecost: 0 },
  { itemid: "Vitamin C Ascorbic Acid - Del Ray", totalquantityonhand: 53, averagecost: 0 },
  { itemid: "Organic Blue Agave Syrup - Deadless", totalquantityonhand: 53, averagecost: 3.585 },
  { itemid: "Sucralose Powder - Southampton", totalquantityonhand: 53, averagecost: 0 },
  { itemid: "Blueberry Juice Concentrate 65Bx - Peel", totalquantityonhand: 52, averagecost: 0 },
  { itemid: "Briess Midnight Wheat Malt", totalquantityonhand: 50, averagecost: 1.634 },
  { itemid: "Cascade (Whole Cone)", totalquantityonhand: 50, averagecost: 9.588 },
  { itemid: "Lime Juice Concentrate 400 GPL - Peel", totalquantityonhand: 50, averagecost: 0 },
  { itemid: "Magnum", totalquantityonhand: 43.1, averagecost: 11.068 },
  { itemid: "Barrel - 53G Bourbon: Buffalo Trace", totalquantityonhand: 41, averagecost: 72.05 },
  { itemid: "Biofine Clear (4kg)", totalquantityonhand: 41, averagecost: 68.28 },
  { itemid: "Barrel - 53G Bourbon: New Riff", totalquantityonhand: 18, averagecost: 97.326 },
  { itemid: "Barrel - 53G Augusta Bourbon", totalquantityonhand: 16, averagecost: 125 },
  { itemid: "Simcoe", totalquantityonhand: 26.5, averagecost: 13.28 },
  { itemid: "East Kent Golding", totalquantityonhand: 25.4, averagecost: 13.034 },
  { itemid: "Centennial", totalquantityonhand: 22, averagecost: 11 },
  { itemid: "Coriander Powder", totalquantityonhand: 22, averagecost: 9.026 },
  { itemid: "Motueka", totalquantityonhand: 22, averagecost: 16.755 },
  { itemid: "Rakau", totalquantityonhand: 22, averagecost: 16.102 },
  { itemid: "El Dorado", totalquantityonhand: 22, averagecost: 11.36 },
  { itemid: "Chinook", totalquantityonhand: 44, averagecost: 8.86 },
  { itemid: "Nectaron", totalquantityonhand: 11, averagecost: 13.368 },
  { itemid: "CTZ (Zeus)", totalquantityonhand: 5, averagecost: 7.554 },
  { itemid: "Exberry Shade Purple Mist", totalquantityonhand: 27.5, averagecost: 14.46 },
  { itemid: "Exberry Shade Red (5gal)", totalquantityonhand: 27.5, averagecost: 10.75 },
  { itemid: "Tettnanger", totalquantityonhand: 2.5, averagecost: 0 },
  { itemid: "Challenger", totalquantityonhand: 44, averagecost: 0 },
  { itemid: "Columbus", totalquantityonhand: 44, averagecost: 0 },
];

// 337 items from NetSuite 3/10/2026


const PRELOADED_FG = [
  { itemid: "Ballpark Beer C2412 Loose", totalquantityonhand: 1715, averagecost: 7.694 },
  { itemid: "Dark Charge 2025 Skyline Chili Spice Box", totalquantityonhand: 1495, averagecost: 17.619 },
  { itemid: "Daizy's Passion Fruit Loose Case", totalquantityonhand: 1221, averagecost: 0 },
  { itemid: "Scooter C4/6/12", totalquantityonhand: 859, averagecost: 3.059 },
  { itemid: "Daizy's Strawberry Lemonade Loose Case", totalquantityonhand: 819, averagecost: 0 },
  { itemid: "Dark Charge 2024 Doschers French Chew 500mL", totalquantityonhand: 782, averagecost: 8.153 },
  { itemid: "Volay Tropical Lime Carton Case", totalquantityonhand: 763.5, averagecost: 0.284 },
  { itemid: "Dark Charge 2025 3pk Cobbler Box", totalquantityonhand: 740, averagecost: 25.979 },
  { itemid: "Birdie Loose Case SLEEK", totalquantityonhand: 638, averagecost: 11.709 },
  { itemid: "Dark Charge 2024 Graeter's Chip Set", totalquantityonhand: 614, averagecost: 30.645 },
  { itemid: "Dark Charge 2021 Box Set 3/22", totalquantityonhand: 410, averagecost: 37.19 },
  { itemid: "Dark Charge 2023 Donut Box", totalquantityonhand: 253, averagecost: 15.421 },
  { itemid: "Ballpark Beer C2416 Loose", totalquantityonhand: 189, averagecost: 10.125 },
  { itemid: "Ballpark Beer 2x12pk Carton", totalquantityonhand: 186, averagecost: 12.053 },
  { itemid: "OKI Bourbon Barrel Ale C6/4/12", totalquantityonhand: 155.17, averagecost: 20.614 },
  { itemid: "OKI Bourbon Barrel Ale K12", totalquantityonhand: 98.75, averagecost: 62.93 },
  { itemid: "Bavarian K12", totalquantityonhand: 87.5, averagecost: 18.604 },
  { itemid: "Blueprint Lager K12", totalquantityonhand: 74, averagecost: 21.628 },
  { itemid: "Blueprint 15pk Carton", totalquantityonhand: 73, averagecost: 9.615 },
  { itemid: "Ballpark Beer K12", totalquantityonhand: 65, averagecost: 43.052 },
  { itemid: "Verano", totalquantityonhand: 55.2, averagecost: 44.202 },
  { itemid: "Switch C4/6/12", totalquantityonhand: 49.25, averagecost: 11.231 },
  { itemid: "Hop Ridge C4/6/12", totalquantityonhand: 42.75, averagecost: 14.462 },
  { itemid: "Switch K12", totalquantityonhand: 42.5, averagecost: 44.234 },
  { itemid: "Jubilee K12", totalquantityonhand: 41, averagecost: 0 },
  { itemid: "Hop Ridge K12", totalquantityonhand: 36, averagecost: 34.115 },
  { itemid: "Graeter's Pumpkin Pie C6/4/12", totalquantityonhand: 33.83, averagecost: 19.677 },
  { itemid: "Road Trip K12", totalquantityonhand: 30.75, averagecost: 55.734 },
  { itemid: "Berliner Weisse K12", totalquantityonhand: 26.75, averagecost: 16.427 },
  { itemid: "Road Trip C4/6/12", totalquantityonhand: 20.5, averagecost: 18.575 },
  { itemid: "Scooter K12", totalquantityonhand: 16, averagecost: 10.497 },
  { itemid: "Tropic Flare K12", totalquantityonhand: 13, averagecost: 39.735 },
  { itemid: "Storm K12", totalquantityonhand: 10.75, averagecost: 16.314 },
  { itemid: "Spur Amber Lager C4/6/12", totalquantityonhand: 7.75, averagecost: 4.929 },
  { itemid: "Birdie K12", totalquantityonhand: 3.25, averagecost: 31.498 },
  { itemid: "Fuerte Mexican Lager K12", totalquantityonhand: 2.25, averagecost: 24.16 },
  { itemid: "3:28 Coffee Stout K12", totalquantityonhand: 1, averagecost: 59.33 },
];

const PRELOADED_BOM = [
  // Bavarian
  { beer: "Bavarian", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 36.75, onhand: 0 },
  { beer: "Bavarian", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  { beer: "Bavarian", ingredient: "Calcium Chloride", quantity: 8.25, onhand: 82.16 },
  { beer: "Bavarian", ingredient: "Hallertau Mittelfruh", quantity: 0.285, onhand: 330.6 },
  // Storm
  { beer: "Storm", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 36.25, onhand: 0 },
  { beer: "Storm", ingredient: "Flaked Maize OIO", quantity: 11, onhand: 2400 },
  { beer: "Storm", ingredient: "Rice Hulls", quantity: 1.25, onhand: 659 },
  { beer: "Storm", ingredient: "Hallertau Mittelfruh", quantity: 0.37, onhand: 330.6 },
  // Switch
  { beer: "Switch", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 57.1, onhand: 0 },
  { beer: "Switch", ingredient: "Rice Hulls", quantity: 2.5, onhand: 659 },
  { beer: "Switch", ingredient: "Centennial", quantity: 0.995, onhand: 22 },
  { beer: "Switch", ingredient: "Simcoe", quantity: 0.6, onhand: 26.5 },
  { beer: "Switch", ingredient: "Warrior Resinate", quantity: 15, onhand: 3600 },
  // Tropic Flare
  { beer: "Tropic Flare", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 57.5, onhand: 21217 },
  { beer: "Tropic Flare", ingredient: "Rice Hulls", quantity: 2.5, onhand: 659 },
  { beer: "Tropic Flare", ingredient: "Calcium Chloride", quantity: 42.5, onhand: 82.16 },
  { beer: "Tropic Flare", ingredient: "Citra", quantity: 1.89, onhand: 357.96 },
  { beer: "Tropic Flare", ingredient: "Galaxy", quantity: 0.035, onhand: 217 },
  { beer: "Tropic Flare", ingredient: "Amarillo", quantity: 0.21, onhand: 55 },
  // Haven Hefeweizen
  { beer: "Haven Hefeweizen", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 29.5, onhand: 0 },
  { beer: "Haven Hefeweizen", ingredient: "Weyermann - Pale Wheat", quantity: 22, onhand: 1870 },
  { beer: "Haven Hefeweizen", ingredient: "Simpsons - Caramalt", quantity: 1, onhand: 1307.9 },
  { beer: "Haven Hefeweizen", ingredient: "Weyermann - Munich Lt", quantity: 0.75, onhand: 935 },
  { beer: "Haven Hefeweizen", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  { beer: "Haven Hefeweizen", ingredient: "Magnum", quantity: 0.14, onhand: 50 },
  // Spur Amber Lager
  { beer: "Spur Amber Lager", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 31.125, onhand: 21217 },
  { beer: "Spur Amber Lager", ingredient: "Rice Hulls", quantity: 0.5, onhand: 659 },
  { beer: "Spur Amber Lager", ingredient: "Magnum", quantity: 0.1125, onhand: 50 },
  { beer: "Spur Amber Lager", ingredient: "Sinamar - Weyermann", quantity: 0.19, onhand: 112.5 },
  { beer: "Spur Amber Lager", ingredient: "Calcium Chloride", quantity: 3.75, onhand: 82.16 },
  { beer: "Spur Amber Lager", ingredient: "Calcium Carbonate", quantity: 3.75, onhand: 168.35 },
  { beer: "Spur Amber Lager", ingredient: "Phosphoric Acid", quantity: 8.75, onhand: 52996 },
  { beer: "Spur Amber Lager", ingredient: "Attenuzyme Pro", quantity: 6.25, onhand: 250000 },
  { beer: "Spur Amber Lager", ingredient: "Omega OYL-114 Bayern Lager", quantity: 0.025, onhand: 0 },
  // Birdie
  { beer: "Birdie", ingredient: "Focus IRC Beer Base 21%", quantity: 4.093, onhand: 350.43 },
  { beer: "Birdie", ingredient: "Natural Flavor Blender V18", quantity: 0.735, onhand: 259.92 },
  { beer: "Birdie", ingredient: "Grape Juice Concentrate", quantity: 2.145, onhand: 1 },
  { beer: "Birdie", ingredient: "Citric Acid", quantity: 0.466, onhand: 1995 },
  { beer: "Birdie", ingredient: "Exberry Shade Purple Mist", quantity: 0.274, onhand: 27.5 },
  // OKI Bourbon Barrel Ale
  { beer: "OKI Bourbon Barrel Ale", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 53.5, onhand: 0 },
  { beer: "OKI Bourbon Barrel Ale", ingredient: "Flaked Maize OIO", quantity: 15, onhand: 2400 },
  { beer: "OKI Bourbon Barrel Ale", ingredient: "Hallertau Mittelfruh", quantity: 0.15, onhand: 330.6 },
  { beer: "OKI Bourbon Barrel Ale", ingredient: "Magnum", quantity: 0.1, onhand: 50 },
  { beer: "OKI Bourbon Barrel Ale", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  // Oktober Fuel
  { beer: "Oktober Fuel", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 37.5, onhand: 21217 },
  { beer: "Oktober Fuel", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  { beer: "Oktober Fuel", ingredient: "Magnum", quantity: 0.055, onhand: 50 },
  { beer: "Oktober Fuel", ingredient: "Saaz", quantity: 0.65, onhand: 132.44 },
  { beer: "Oktober Fuel", ingredient: "Hallertau Mittelfruh", quantity: 0.5, onhand: 330.6 },
  // Double Hazy IPA
  { beer: "Double Hazy IPA", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 65, onhand: 21217 },
  { beer: "Double Hazy IPA", ingredient: "Rice Hulls", quantity: 2.5, onhand: 659 },
  { beer: "Double Hazy IPA", ingredient: "Citra", quantity: 2.785, onhand: 357.96 },
  { beer: "Double Hazy IPA", ingredient: "Calcium Chloride", quantity: 0.986, onhand: 82.16 },
  { beer: "Double Hazy IPA", ingredient: "Phosphoric Acid", quantity: 43, onhand: 52996 },
  // Jam Session
  { beer: "Jam Session", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 30.405, onhand: 0 },
  { beer: "Jam Session", ingredient: "Rice Hulls", quantity: 0.788, onhand: 659 },
  { beer: "Jam Session", ingredient: "Calcium Chloride", quantity: 19.82, onhand: 82.16 },
  { beer: "Jam Session", ingredient: "Citra", quantity: 0.487, onhand: 357.96 },
  { beer: "Jam Session", ingredient: "Amarillo", quantity: 0.382, onhand: 55 },
  // Jubilee - Hoppy Holiday IPA
  { beer: "Jubilee", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 35.75, onhand: 21217 },
  { beer: "Jubilee", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 35.25, onhand: 0 },
  { beer: "Jubilee", ingredient: "CTZ (Zeus)", quantity: 0.39, onhand: 5 },
  { beer: "Jubilee", ingredient: "Amarillo", quantity: 0.355, onhand: 55 },
  { beer: "Jubilee", ingredient: "Simcoe", quantity: 1.005, onhand: 26.5 },
  { beer: "Jubilee", ingredient: "Centennial", quantity: 0.05, onhand: 22 },
  { beer: "Jubilee", ingredient: "Lallemand BRY-97", quantity: 25, onhand: 500 },
  // Paradise Watermelon Gose
  { beer: "Paradise Watermelon Gose", ingredient: "SILO 2 Rahr Pilsner Bulk", quantity: 20.25, onhand: 21217 },
  { beer: "Paradise Watermelon Gose", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  { beer: "Paradise Watermelon Gose", ingredient: "Calcium Chloride", quantity: 8.65, onhand: 82.16 },
  { beer: "Paradise Watermelon Gose", ingredient: "Hallertau Mittelfruh", quantity: 0.3, onhand: 330.6 },
  // Dark Charge
  { beer: "Dark Charge", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 86.67, onhand: 0 },
  { beer: "Dark Charge", ingredient: "Rice Hulls", quantity: 2.174, onhand: 659 },
  { beer: "Dark Charge", ingredient: "Calcium Carbonate", quantity: 0.307, onhand: 168.35 },
  { beer: "Dark Charge", ingredient: "East Kent Golding", quantity: 1.178, onhand: 25.4 },
  // Hoppy Blonde
  { beer: "Hoppy Blonde", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 42, onhand: 0 },
  { beer: "Hoppy Blonde", ingredient: "Rice Hulls", quantity: 0.875, onhand: 659 },
  { beer: "Hoppy Blonde", ingredient: "Citra", quantity: 0.3, onhand: 357.96 },
  { beer: "Hoppy Blonde", ingredient: "Amarillo", quantity: 0.2, onhand: 55 },
  { beer: "Hoppy Blonde", ingredient: "Calcium Chloride", quantity: 8.25, onhand: 82.16 },
  // House Pilsner
  { beer: "House Pilsner", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 86.67, onhand: 0 },
  { beer: "House Pilsner", ingredient: "Rice Hulls", quantity: 2.174, onhand: 659 },
  { beer: "House Pilsner", ingredient: "Calcium Carbonate", quantity: 0.307, onhand: 168.35 },
  { beer: "House Pilsner", ingredient: "Centennial", quantity: 0.56, onhand: 22 },
  { beer: "House Pilsner", ingredient: "Calcium Chloride", quantity: 6, onhand: 82.16 },
  // Italian Pilsner
  { beer: "Italian Pilsner", ingredient: "Weyermann - Pilsner", quantity: 26.5, onhand: 55 },
  { beer: "Italian Pilsner", ingredient: "Rahr White Wheat", quantity: 23.2, onhand: 2200 },
  { beer: "Italian Pilsner", ingredient: "Grain Millers Flaked Oats", quantity: 3.01, onhand: 1000 },
  { beer: "Italian Pilsner", ingredient: "Weyermann - Munich Lt", quantity: 1.2, onhand: 935 },
  { beer: "Italian Pilsner", ingredient: "Calcium Chloride", quantity: 15.06, onhand: 82.16 },
  { beer: "Italian Pilsner", ingredient: "Hallertau Mittelfruh", quantity: 0.42, onhand: 330.6 },
  { beer: "Italian Pilsner", ingredient: "Coriander Powder", quantity: 0.06, onhand: 22 },
  // Dan's West Coast IPA
  { beer: "Dan's West Coast IPA", ingredient: "SILO 1 Rahr Pale Ale Bulk", quantity: 48.54, onhand: 0 },
  { beer: "Dan's West Coast IPA", ingredient: "CTZ (Zeus)", quantity: 0.161, onhand: 5 },
  { beer: "Dan's West Coast IPA", ingredient: "Centennial", quantity: 0.15, onhand: 22 },
  { beer: "Dan's West Coast IPA", ingredient: "Calcium Chloride", quantity: 8.5, onhand: 82.16 },
  // Garage Beer Lime
  { beer: "Garage Beer Lime", ingredient: "Lime Flavor FAQS014", quantity: 0.4375, onhand: 341.6 },
  // Rally
  { beer: "Rally", ingredient: "Cranberry Juice Concentrate", quantity: 2.145, onhand: 0 },
  { beer: "Rally", ingredient: "Citric Acid", quantity: 0.466, onhand: 1995 },
  { beer: "Rally", ingredient: "Exberry Shade Red", quantity: 0.274, onhand: 27.5 },
  // House Hazy IPA
  { beer: "House Hazy IPA", ingredient: "Rahr Standard 2-Row", quantity: 52.57, onhand: 1265 },
  { beer: "House Hazy IPA", ingredient: "Rahr White Wheat", quantity: 16.17, onhand: 2200 },
  { beer: "House Hazy IPA", ingredient: "Grain Millers Flaked Oats", quantity: 7.35, onhand: 1000 },
  { beer: "House Hazy IPA", ingredient: "Calcium Chloride", quantity: 36.76, onhand: 82.16 },
  { beer: "House Hazy IPA", ingredient: "Gypsum (Calcium Sulfate)", quantity: 4.4, onhand: 119.28 },
  { beer: "House Hazy IPA", ingredient: "Simcoe", quantity: 0.147, onhand: 26.5 },
  { beer: "House Hazy IPA", ingredient: "Mosaic", quantity: 0.8, onhand: 289.52 },
  // Peach Birdie
  { beer: "Peach Birdie", ingredient: "VIVE Base", quantity: 8.381, onhand: 0 },
  { beer: "Peach Birdie", ingredient: "Tractor Peach Concentrate", quantity: 4.25, onhand: 0 },
  { beer: "Peach Birdie", ingredient: "Citric Acid", quantity: 0.466, onhand: 1995 },
  { beer: "Peach Birdie", ingredient: "Exberry Shade Red", quantity: 0.025, onhand: 27.5 },
  { beer: "Peach Birdie", ingredient: "Cane Sugar", quantity: 2.587, onhand: 49008 },
  // Watermelon Birdie
  { beer: "Watermelon Birdie", ingredient: "VIVE Base", quantity: 8.381, onhand: 0 },
  { beer: "Watermelon Birdie", ingredient: "Watermelon Concentrate", quantity: 2.145, onhand: 0 },
  { beer: "Watermelon Birdie", ingredient: "Citric Acid", quantity: 0.466, onhand: 1995 },
  { beer: "Watermelon Birdie", ingredient: "Extra Fine Granulated Sugar", quantity: 2.5, onhand: 49008 },
  // Slow Pour Pils
  { beer: "Slow Pour Pils", ingredient: "Weyermann - Barke Pilsner", quantity: 41.25, onhand: 0 },
  { beer: "Slow Pour Pils", ingredient: "Weyermann - Acidulated", quantity: 2.75, onhand: 55 },
  { beer: "Slow Pour Pils", ingredient: "Gypsum (Calcium Sulfate)", quantity: 0.015, onhand: 119.28 },
  { beer: "Slow Pour Pils", ingredient: "Calcium Chloride", quantity: 0.012, onhand: 82.16 },
  { beer: "Slow Pour Pils", ingredient: "Hallertau Mittelfruh", quantity: 0.63, onhand: 330.6 },
  { beer: "Slow Pour Pils", ingredient: "Fermentis SafLager W-34/70", quantity: 100, onhand: 14000 },
];

function categorize(name) {
  if (!name) return "other";
  const n = name.toLowerCase();
  if (/silo|malt|pilsner bulk|pale ale bulk|wheat|caramunich|munich|crisp|rahr|maize|caramalt|vienna|cara |carafoam|spelt|roasted barley|origin malt|pilsen|biscuit|briess|melanoidin|special b|maris otter|amber|chocolate m|midnight|2-row|hulls|flaked oats|oio toasted|rice syrup|grain millers|naked oat|simpsons -/.test(n)) return "malt";
  if (/citra|mosaic|simcoe|cascade|centennial|amarillo|magnum|hallertau|galaxy|azacca|saaz|warrior|golding|barbe|challenger|idaho|sabro|chinook|el dorado|motueka|rakau|nectaron|loral|belma|lorien|spalter|cashmere|grungeist|tettnanger|columbus|ctz|pellet -|hop:|resinate/.test(n)) return "hops";
  if (/fermentis|lallemand|lalbrew|omega oyl|yeast|wlp066/.test(n)) return "yeast";
  if (/can |paktech|label|carton|box|bottle|cap|collar|keg c|crown|closure|pvc clear|glue/.test(n)) return "packaging";
  if (/juice concentrate|flavor|extract|essence|concentrate|exberry|sinamar|ghirardelli|focus irc|sucralose|erythritol|agave|bourbon cream|bourbon blend|natural.*wonf|nat .*flavor|nat .*type|natural.*type|monkfruit|cimmerian|black tea|spraygum|trueblost|perfectly dosed|hemp.*azuca|bioperine|ashwagandha|rhodiola|l-theanine|lion.*mane|green tea.*caffeine|peanut butter|vanilla|coriander|orange peel|coconut|cinnamon|coffee|chocolate sauce/.test(n)) return "flavor";
  if (/lactose|corn sugar|dextrose|sugar|citric acid|malic acid|rice syrup solid/.test(n)) return "adjunct";
  if (/calcium|gypsum|sodium|phosphoric|fermcap|whirlfloc|yeastex|attenuzyme|lactic acid|biofine|biohaze|water treatment|potassium|low tempase|alpha amylase/.test(n)) return "chemistry";
  if (/barrel/.test(n)) return "barrel";
  return "other";
}
const CC = { malt:"#d4a053", hops:"#4caf50", packaging:"#42a5f5", adjunct:"#ff9800", chemistry:"#26c6da", barrel:"#8d6e63", yeast:"#ab47bc", flavor:"#ef5350", other:"#616161" };
const m = { fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" };

const NS = { type:"url", url:"https://8311319.suitetalk.api.netsuite.com/services/mcp/v1/suiteapp/com.netsuite.mcpstandardtools", name:"netsuite" };

async function queryNS(sql, log) {
  try {
    log("Querying NetSuite via backend...");
    const r = await fetch("/api/netsuite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: "HTTP " + r.status }));
      throw new Error(err.error || "HTTP " + r.status);
    }
    const d = await r.json();
    if (d.ok && Array.isArray(d.data)) {
      log(d.count + " rows from NetSuite", "success");
      return d.data;
    }
    throw new Error(d.error || "No data returned");
  } catch (e) { log("Error: " + e.message, "error"); return null; }
}

function Badge({cat}) {
  const c = CC[cat] || "#616161";
  return <span style={{padding:"1px 6px",borderRadius:3,fontSize:"0.65rem",fontWeight:600,...m,background:c+"22",color:c,border:"1px solid "+c+"44",textTransform:"capitalize"}}>{cat}</span>;
}

function InvTable({data, showCat}) {
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("all");
  if (!data || !data.length) return <div style={{color:"#475569",padding:20,textAlign:"center"}}>No data</div>;
  const rows = data.map(r => ({ name: String(r.itemid||r.itemId||""), qty: Number(r.totalquantityonhand||r.totalQuantityOnHand||0)||0, cost: Number(r.averagecost||r.averageCost||0)||0, cat: categorize(String(r.itemid||r.itemId||"")) }));
  const cats = [...new Set(rows.map(r=>r.cat))].sort();
  const sl = search.toLowerCase();
  const f = rows.filter(r=>(catF==="all"||r.cat===catF)&&(!sl||r.name.toLowerCase().includes(sl))).sort((a,b)=>b.qty-a.qty);
  const tv = f.reduce((s,r)=>s+r.qty*r.cost,0);
  return (<div>
    <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
      <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #2d3748",background:"#0b0f14",color:"#e2e8f0",...m,outline:"none",width:200}} />
      {showCat && <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
        {["all",...cats].map(c=><button key={c} onClick={()=>setCatF(c)} style={{padding:"2px 8px",borderRadius:4,border:"1px solid "+(catF===c?(CC[c]||"#c8854a"):"#2d3748"),background:catF===c?(CC[c]||"#c8854a")+"22":"transparent",color:catF===c?(CC[c]||"#c8854a"):"#64748b",cursor:"pointer",fontSize:"0.65rem",fontFamily:"'DM Sans'",textTransform:"capitalize"}}>{c} ({c==="all"?rows.length:rows.filter(r=>r.cat===c).length})</button>)}
      </div>}
      <span style={{marginLeft:"auto",fontSize:"0.7rem",color:"#64748b"}}>{f.length} items · ${Math.round(tv).toLocaleString()}</span>
    </div>
    <div style={{maxHeight:"50vh",overflow:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
        <thead style={{position:"sticky",top:0,background:"#111820",zIndex:1}}><tr>
          <th style={{padding:"7px 12px",textAlign:"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Item</th>
          {showCat && <th style={{padding:"7px 12px",textAlign:"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Cat</th>}
          <th style={{padding:"7px 12px",textAlign:"right",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>On Hand</th>
          <th style={{padding:"7px 12px",textAlign:"right",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>Value</th>
        </tr></thead>
        <tbody>{f.slice(0,150).map((r,i)=><tr key={i} style={{background:i%2?"#0d1117":"transparent"}}>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",fontWeight:500,color:"#f8fafc"}}>{r.name}</td>
          {showCat && <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08"}}><Badge cat={r.cat}/></td>}
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:r.qty>100?"#81c784":r.qty>10?"#e2e8f0":"#fca5a5"}}>{r.qty.toLocaleString(undefined,{maximumFractionDigits:1})}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:"#c8854a"}}>{r.qty*r.cost>0?"$"+Math.round(r.qty*r.cost).toLocaleString():"—"}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>);
}

function RecipeView({data}) {
  const [sel, setSel] = useState(null);
  if (!data || !data.length) return <div style={{color:"#475569",padding:20,textAlign:"center"}}>No BOM data</div>;
  const beers = [...new Set(data.filter(r=>r.beer).map(r=>r.beer))].sort();
  const cur = sel || beers[0] || "";
  const ings = data.filter(r=>r.beer===cur);
  return (<div>
    <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{beers.map(b=>
      <button key={b} onClick={()=>setSel(b)} style={{padding:"5px 12px",borderRadius:6,border:cur===b?"1px solid #c8854a":"1px solid #2d3748",background:cur===b?"#c8854a":"#1a2332",color:cur===b?"#0b0f14":"#e2e8f0",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:"0.75rem",fontWeight:600}}>{b}</button>
    )}</div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.8rem"}}>
      <thead><tr>{["Ingredient","Cat","Recipe Qty","On Hand","Batches"].map((h,i)=>
        <th key={i} style={{padding:"7px 12px",textAlign:i>1?"right":"left",color:"#94a3b8",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>{h}</th>
      )}</tr></thead>
      <tbody>{ings.map((r,i)=>{
        const cat = categorize(r.ingredient);
        const qty = Number(r.quantity)||0;
        const oh = Number(r.onhand)||0;
        const batches = qty>0&&oh>0 ? Math.floor(oh/qty) : oh>0 ? "∞" : 0;
        const warn = typeof batches==="number" && batches<5;
        return <tr key={i} style={{background:i%2?"#0d1117":"transparent"}}>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",fontWeight:500}}>{r.ingredient}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08"}}><Badge cat={cat}/></td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m}}>{qty.toFixed(3)}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,color:oh>0?"#81c784":"#fca5a5"}}>{oh.toLocaleString(undefined,{maximumFractionDigits:1})}</td>
          <td style={{padding:"5px 12px",borderBottom:"1px solid #1e293b08",textAlign:"right",...m,fontWeight:600,color:warn?"#fca5a5":"#81c784"}}>{String(batches)}{warn?" ⚠":""}</td>
        </tr>;
      })}</tbody>
    </table>
  </div>);
}

export default function NetSuiteInventory() {
  const [tab, setTab] = useState("raw");
  const [raw, setRaw] = useState(PRELOADED_RAW);
  const [fg, setFg] = useState(PRELOADED_FG);
  const [bom, setBom] = useState(PRELOADED_BOM);
  const [ld, setLd] = useState({});
  const [st, setSt] = useState({raw:"Pre-loaded",fg:"Pre-loaded",bom:"Pre-loaded"});
  const [logs, setLogs] = useState([{time:new Date().toLocaleTimeString(),msg:"Loaded pre-cached NetSuite data (3/9/2026)",type:"success"}]);
  const [err, setErr] = useState(null);

  const log = useCallback((msg,type)=>setLogs(p=>[{time:new Date().toLocaleTimeString(),msg,type:type||"info"},...p].slice(0,50)),[]);

  const sync = useCallback(async(key,sql,set)=>{
    setLd(p=>({...p,[key]:true})); setErr(null);
    const d = await queryNS(sql, log);
    if (d && Array.isArray(d) && d.length) { set(d); setSt(p=>({...p,[key]:new Date().toLocaleTimeString()})); }
    else if (!d) setErr("Live sync failed — showing cached data");
    setLd(p=>({...p,[key]:false}));
  },[log]);

  const rawV = (raw||[]).reduce((s,r)=>s+(Number(r.totalquantityonhand||0)*Number(r.averagecost||0)),0);
  const bomN = bom ? [...new Set(bom.filter(r=>r.beer).map(r=>r.beer))].length : 0;
  const anyLd = Object.values(ld).some(Boolean);
  const Btn = ({label,onClick,loading}) => <button onClick={onClick} disabled={loading} style={{padding:"6px 14px",borderRadius:6,border:"1px solid #c8854a",background:"#c8854a",color:"#0b0f14",cursor:loading?"wait":"pointer",fontFamily:"'DM Sans'",fontSize:"0.8rem",fontWeight:600,opacity:loading?0.6:1}}>{loading?"Syncing...":label}</button>;

  return (<div style={{fontFamily:"'DM Sans', sans-serif",background:"#0b0f14",color:"#e2e8f0",minHeight:"100vh"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:6px;height:6px} ::-webkit-scrollbar-track{background:#111820} ::-webkit-scrollbar-thumb{background:#2d3748;border-radius:3px} button:hover:not(:disabled){opacity:0.85}`}</style>

    <div style={{background:"#111820",borderBottom:"1px solid #1e293b",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,borderRadius:7,background:"linear-gradient(135deg,#c8854a,#8b5e34)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem"}}>🔗</div>
        <div><div style={{fontWeight:700,fontSize:"1rem",color:"#f8fafc"}}>NetSuite Live Inventory</div><div style={{fontSize:"0.65rem",color:"#475569"}}>Pre-loaded + live MCP sync</div></div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e"}} /><span style={{fontSize:"0.7rem",color:"#22c55e"}}>Data loaded</span>
        <Btn label="↻ Sync All" loading={anyLd} onClick={()=>{
          sync("raw","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='InvtPart' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setRaw);
          sync("fg","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='Assembly' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setFg);
        }} />
      </div>
    </div>

    <div style={{display:"flex",gap:2,background:"#111820",padding:"0 24px",borderBottom:"1px solid #1e293b"}}>
      {[{id:"raw",l:"🌾 Raw Materials",n:(raw||[]).length},{id:"fg",l:"🍺 Finished Goods",n:(fg||[]).length},{id:"bom",l:"📋 BOM Recipes",n:bomN},{id:"log",l:"🔌 API Log",n:logs.length}].map(t=>
        <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 16px",background:tab===t.id?"#1a2332":"transparent",color:tab===t.id?"#f8fafc":"#94a3b8",border:"none",borderBottom:tab===t.id?"2px solid #c8854a":"2px solid transparent",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:"0.85rem",fontWeight:tab===t.id?600:400}}>{t.l} ({t.n})</button>
      )}
    </div>

    <div style={{padding:"20px 24px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[{l:"Raw Materials",v:(raw||[]).length,c:"#c8854a",s:st.raw},{l:"Finished Goods",v:(fg||[]).length,c:"#3b82f6",s:st.fg},{l:"Raw Inventory Value",v:"$"+Math.round(rawV).toLocaleString(),c:"#22c55e"},{l:"BOM Recipes",v:bomN+" beers",c:"#ffe599",s:st.bom}].map((x,i)=>
          <div key={i} style={{background:"#111820",border:"1px solid #1e293b",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:"0.7rem",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{x.l}</div>
            <div style={{fontSize:"1.3rem",fontWeight:700,color:x.c,...m}}>{x.v}</div>
            {x.s && <div style={{fontSize:"0.65rem",color:"#475569",marginTop:2}}>{x.s}</div>}
          </div>
        )}
      </div>

      {err && <div style={{background:"#111820",border:"1px solid #ef444466",borderRadius:8,padding:"12px 16px",marginBottom:16,color:"#fca5a5",fontSize:"0.85rem"}}>⚠ {err}</div>}

      <div style={{background:"#111820",border:"1px solid #1e293b",borderRadius:8,padding:16}}>
        {tab==="raw" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Raw Material Inventory</div><div style={{fontSize:"0.75rem",color:"#475569"}}>From NetSuite · brewing ingredients, hops, malts, packaging</div></div>
            <Btn label="↻ Refresh" loading={ld.raw} onClick={()=>sync("raw","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='InvtPart' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setRaw)} />
          </div>
          <InvTable data={raw} showCat={true} />
        </div>}
        {tab==="fg" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Finished Goods</div><div style={{fontSize:"0.75rem",color:"#475569"}}>Packaged beers — kegs, cases, canned products</div></div>
            <Btn label="↻ Refresh" loading={ld.fg} onClick={()=>sync("fg","SELECT i.itemId,i.totalQuantityOnHand,i.averageCost FROM item i LEFT JOIN itemType it ON i.itemType=it.id WHERE i.isInactive='F' AND it.id='Assembly' AND i.totalQuantityOnHand>0 ORDER BY i.totalQuantityOnHand DESC",setFg)} />
          </div>
          <InvTable data={fg} showCat={false} />
        </div>}
        {tab==="bom" && <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div><div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc"}}>Beer Recipes (BOM)</div><div style={{fontSize:"0.75rem",color:"#475569"}}>Real NetSuite BOMs with batch feasibility</div></div>
            <Btn label="↻ Refresh" loading={ld.bom} onClick={()=>sync("bom","SELECT asm.itemId AS beer,comp.itemId AS ingredient,brc.quantity,comp.totalQuantityOnHand AS onhand FROM assemblyItemBom ab JOIN item asm ON ab.assembly=asm.id JOIN bomRevisionComponentMember brc ON brc.bomRevision=ab.currentRevision JOIN item comp ON brc.item=comp.id WHERE ab.masterDefault='T' AND ab.currentRevision IS NOT NULL AND ROWNUM<=300 ORDER BY asm.itemId,brc.lineId",setBom)} />
          </div>
          <RecipeView data={bom} />
        </div>}
        {tab==="log" && <div>
          <div style={{fontSize:"1rem",fontWeight:600,color:"#f8fafc",marginBottom:12}}>API Connection Log</div>
          <div style={{...m,fontSize:"0.75rem",marginBottom:12,padding:"8px 12px",background:"#0b0f14",borderRadius:6,border:"1px solid #1e293b"}}>
            <span style={{color:"#475569"}}>MCP: </span><span style={{color:"#81c784"}}>{NS.url.split("/services")[0]}</span>
          </div>
          {logs.map((l,i)=><div key={i} style={{padding:"5px 0",borderBottom:"1px solid #1e293b08",display:"flex",gap:10,alignItems:"baseline",fontSize:"0.75rem",...m}}>
            <span style={{color:"#475569",width:70,flexShrink:0}}>{l.time}</span>
            <span style={{width:6,height:6,borderRadius:"50%",background:l.type==="success"?"#22c55e":l.type==="error"?"#ef4444":"#3b82f6",flexShrink:0}} />
            <span style={{color:l.type==="error"?"#fca5a5":l.type==="success"?"#81c784":"#e2e8f0"}}>{l.msg}</span>
          </div>)}
        </div>}
      </div>
    </div>
  </div>);
}
