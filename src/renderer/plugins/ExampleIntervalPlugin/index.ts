/*
 * Fluffcord, a custom Discord desktop app
 * Copyright (c) 2025 alexonvscode and FluffLinux team
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Simple plugin that creates an interval
let intervalId: NodeJS.Timeout | null = null;

export default {
    name: "ExampleIntervalPlugin",
    description: "A simple example plugin that creates an interval",
    authors: [{ name: "Fluffcord Team", id: 1234567890n }],
    enabledByDefault: false,

    start() {
        // Clear any existing interval to prevent duplicates
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Create an interval that runs every 5 seconds
        intervalId = setInterval(() => {
            console.log("PluginSuccessfullyExecuted");
        }, 5000);

        console.log("ExampleIntervalPlugin started");
    },

    stop() {
        // Clear the interval when the plugin is stopped
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            console.log("ExampleIntervalPlugin stopped");
        }
    }
};