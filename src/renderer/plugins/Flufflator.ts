/*
 * Flufflator Plugin
 * Replaces "What Linux Distro should I use?" with "I use FluffLinux BTW."
 */

// Plugin that replaces "What Linux Distro should I use?" with "I use FluffLinux BTW."
const FlufflatorPlugin = {
    name: "Flufflator",
    description: "Replaces 'What Linux Distro should I use?' with 'I use FluffLinux BTW.'",
    authors: [{ name: "Fluffcord Team", id: 1234567890n }],
    enabledByDefault: true,
    required: false,
    hidden: false,

    // Hook into Discord's message sending process
    start() {
        console.log("Flufflator plugin started");
        
        // Store original function to restore later
        this.originalSendMessage = null;
        
        // Find and patch the message sending function
        try {
            // Use Vencord's webpack utilities to find and patch the function
            if (typeof Vencord !== "undefined" && Vencord.Webpack) {
                const { waitFor, filters } = Vencord.Webpack;
                
                // Wait for the MessageActions module to load
                waitFor(filters.byProps("sendMessage", "editMessage"), (MessageActions) => {
                    if (MessageActions && MessageActions.sendMessage) {
                        // Store original function
                        this.originalSendMessage = MessageActions.sendMessage;
                        
                        // Replace with our patched version
                        MessageActions.sendMessage = (channelId, message, ...args) => {
                            if (message && message.content) {
                                // Replace the target phrase in outgoing messages
                                message.content = message.content.replace(
                                    /What Linux Distro should I use\??/gi,
                                    "I use FluffLinux BTW."
                                );
                            }
                            // Call original function with modified message
                            return this.originalSendMessage.call(MessageActions, channelId, message, ...args);
                        };
                        
                        console.log("Flufflator: Message sending patched successfully");
                    }
                });
            }
        } catch (error) {
            console.error("Error patching message sending:", error);
        }
    },

    // Restore original function when stopping
    stop() {
        console.log("Flufflator plugin stopped");
        
        // Restore original function if we patched it
        if (this.originalSendMessage && typeof Vencord !== "undefined" && 
            Vencord.Webpack && Vencord.Webpack.Common) {
            const { waitFor, filters } = Vencord.Webpack;
            
            waitFor(filters.byProps("sendMessage", "editMessage"), (MessageActions) => {
                if (MessageActions && MessageActions.sendMessage && this.originalSendMessage) {
                    MessageActions.sendMessage = this.originalSendMessage;
                    this.originalSendMessage = null;
                    console.log("Flufflator: Original message sending restored");
                }
            });
        }
    }
};

// Try to register with Vencord directly
try {
    if (typeof Vencord !== "undefined" && 
        typeof Vencord.Plugins !== "undefined" && 
        typeof Vencord.Plugins.plugins !== "undefined") {
        Vencord.Plugins.plugins["Flufflator"] = FlufflatorPlugin;
        console.log("Flufflator plugin registered with Vencord!");
    } else {
        console.warn("Vencord not available yet, plugin will be registered when ready");
        
        // Try to register when Vencord becomes available
        const interval = setInterval(() => {
            if (typeof Vencord !== "undefined" && 
                typeof Vencord.Plugins !== "undefined" && 
                typeof Vencord.Plugins.plugins !== "undefined") {
                Vencord.Plugins.plugins["Flufflator"] = FlufflatorPlugin;
                console.log("Flufflator plugin registered with Vencord!");
                clearInterval(interval);
            }
        }, 1000);
        
        // Stop trying after 30 seconds
        setTimeout(() => clearInterval(interval), 30000);
    }
} catch (error) {
    console.error("Error registering Flufflator plugin:", error);
}

export default FlufflatorPlugin;