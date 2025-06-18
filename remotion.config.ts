import { Config } from 'remotion';

Config.Rendering.setImageFormat('jpeg');
Config.Rendering.setQuality(90);
Config.Output.setOverwriteOutput(true);

// Set the maximum number of frames to render
Config.Rendering.setMaxConcurrency(4);

// Set the output directory
Config.Output.setOutputDirectory('public/renders');

// Set the composition ID to match the template ID
Config.Composition.setCompositionId('RoyalRajasthaniWedding'); 