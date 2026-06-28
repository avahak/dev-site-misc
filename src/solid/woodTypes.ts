// AI-generated, just placeholders.
// NOTE! zRanges should ideally be powers of 2 or pixels might not match for the texture uvs.


import { WoodConfig } from "./woodSetup";

export const ScotsPineConfig: WoodConfig = {
    name: "Scots_Pine",
    zRange: 8,
    // Conifers have true whorls with high branch counts (3 to 5 branches)
    whorlSizes: [[3, 0.3], [4, 0.5], [5, 0.2]],
    whorlNum: 8,
    whorlOffsetDispersion: 0.12,
    verticalSlopeRange: [0.8, 1.2],
    radiusRange: [0.2, 0.3],
    deathRange: [0.1, 0.7],
    medullaryRayFrequency: 0, // Softwoods have microscopic, invisible rays
    knotColor: [0.25, 0.12, 0.08],

    heartwoodColor: { x: 0.65, y: 0.42, z: 0.28 },
    sapwoodColor: { x: 0.82, y: 0.72, z: 0.53 },
    heartwoodRadius: 0.65,
    transitionWidth: 0.05, // Relatively rapid, distinct color shift
    ageAtOne: 40,
    ringWidthDispersion: 0.18,
    ringWidthNoiseAlpha: 0.15,
    // High exponent creates a wide earlywood zone ending in a sharp latewood line
    ringShapeExponent: 7.0,
    earlywoodLighten: 1.08,
    latewoodDarken: 0.55,  // Latewood in pine is significantly darker and reddish
    yearlyNoiseAmplitude: 0.05,
    grainNoiseAmplitude: 0.03
};

export const EuropeanBeechConfig: WoodConfig = {
    name: "European_Beech",
    zRange: 8,
    whorlSizes: [[1, 1]], // Strict alternate pattern
    whorlNum: 24,
    whorlOffsetDispersion: 0.08,
    verticalSlopeRange: [1.1, 1.5],
    radiusRange: [0.15, 0.22],
    deathRange: [0.4, 0.9],
    medullaryRayFrequency: 18, // Highly prominent, broad radial silver rays
    alternateAngle: 2.4, // Golden angle divergence
    knotColor: [0.3, 0.2, 0.15],

    heartwoodColor: { x: 0.68, y: 0.52, z: 0.42 },
    sapwoodColor: { x: 0.74, y: 0.61, z: 0.48 },
    heartwoodRadius: 0.4,
    transitionWidth: 0.35, // Heartwood and sapwood blend almost seamlessly
    ageAtOne: 70,          // Fine, slow-growing tight rings
    ringWidthDispersion: 0.08,
    ringWidthNoiseAlpha: 0.05,
    ringShapeExponent: 2.2, // Diffuse-porous; very gentle gradient across the ring
    earlywoodLighten: 1.03,
    latewoodDarken: 0.88,  // Minimal contrast between early and latewood
    yearlyNoiseAmplitude: 0.02,
    grainNoiseAmplitude: 0.04  // Fine, uniform speckling
};

export const SugarMapleConfig: WoodConfig = {
    name: "Sugar_Maple",
    zRange: 8,
    whorlSizes: [[2, 1]], // Strict opposite branching pattern
    whorlNum: 14,
    whorlOffsetDispersion: 0.1,
    verticalSlopeRange: [1.0, 1.3],
    radiusRange: [0.15, 0.2],
    deathRange: [0.3, 0.8],
    medullaryRayFrequency: 5, // Present but fine and subtle
    knotColor: [0.35, 0.25, 0.15],

    heartwoodColor: { x: 0.55, y: 0.38, z: 0.28 },
    sapwoodColor: { x: 0.88, y: 0.82, z: 0.68 }, // Creamy, distinct white sapwood
    heartwoodRadius: 0.25, // Maple keeps a very small dark heartwood core
    transitionWidth: 0.15,
    ageAtOne: 55,
    ringWidthDispersion: 0.12,
    ringWidthNoiseAlpha: 0.08,
    ringShapeExponent: 3.0,
    earlywoodLighten: 1.02,
    latewoodDarken: 0.82,  // Clean, uniform appearance with quiet boundaries
    yearlyNoiseAmplitude: 0.015,
    grainNoiseAmplitude: 0.02
};

export const EnglishOakConfig: WoodConfig = {
    name: "English_Oak",
    zRange: 8,
    whorlSizes: [[1, 1]],
    whorlNum: 10,
    whorlOffsetDispersion: 0.2, // Gnarled, irregular spacing between branch offsets
    verticalSlopeRange: [1.2, 1.6],
    radiusRange: [0.2, 0.3],
    deathRange: [0.2, 0.7],
    medullaryRayFrequency: 28, // Extreme ray presence responsible for oak flakes
    alternateAngle: 2.4,
    knotColor: [0.2, 0.15, 0.1],

    heartwoodColor: { x: 0.52, y: 0.41, z: 0.31 }, // Rich, tan-brown heartwood
    sapwoodColor: { x: 0.78, y: 0.71, z: 0.58 }, // Narrow, lighter sapwood band
    heartwoodRadius: 0.75, // Oak is mostly heartwood
    transitionWidth: 0.08,
    ageAtOne: 50,
    ringWidthDispersion: 0.22, // High variation due to seasonal sensitivity
    ringWidthNoiseAlpha: 0.18,
    ringShapeExponent: 4.5, // Ring-porous thresholding
    earlywoodLighten: 1.12, // Porous earlywood captures more light
    latewoodDarken: 0.72,
    yearlyNoiseAmplitude: 0.06, // High contrast structural shifts
    grainNoiseAmplitude: 0.05
};

export const BlackWalnutParquetConfig: WoodConfig = {
    name: "Black_Walnut_Parquet",
    zRange: 8,
    whorlSizes: [[1, 1]], // Alternate branching pattern
    whorlNum: 12,
    whorlOffsetDispersion: 0.15,
    verticalSlopeRange: [0.2, 0.4],
    // verticalSlopeRange: [1.1, 1.4],
    // Tight, small radius range to simulate "Clear Grade" parquet boards with minimal knot sizes
    radiusRange: [0.2, 0.3],
    // Low death threshold means branches dropped off very early in the tree's lifespan
    deathRange: [0.1, 0.4],
    medullaryRayFrequency: 2, // Fine and nearly invisible on flat-sawn floor cuts
    alternateAngle: 2.4,
    knotColor: [0.15, 0.10, 0.08], // Deep, dark character knots

    heartwoodColor: { x: 0.38, y: 0.27, z: 0.20 }, // Deep rich chocolate brown
    sapwoodColor: { x: 0.82, y: 0.74, z: 0.60 },   // Creamy, high-contrast sapwood highlights
    heartwoodRadius: 0.72, // Large heartwood core relative to total trunk
    transitionWidth: 0.12,
    ageAtOne: 50,
    ringWidthDispersion: 0.14,
    ringWidthNoiseAlpha: 0.10,
    // Semi-ring-porous structure; elegant, distinct ring borders without being overly harsh
    ringShapeExponent: 4.0,
    earlywoodLighten: 1.05,
    latewoodDarken: 0.78,
    yearlyNoiseAmplitude: 0.03,
    grainNoiseAmplitude: 0.04
};