/*
 * Flufflator Translation Indicator Patch
 * Adds a translation notice for messages containing "What Linux Distro should I use?"
 */

import { addPatch } from "./shared";

// Patch to add translation notice after messages
addPatch({
    patches: [
        // This looks for a pattern common in message rendering components
        {
            find: "MessageContent",
            replacement: {
                match: /(?<=return\s+)([^;]*?)(?=;)/,
                replace: "$self.wrapWithTranslationNotice($1, arguments[0] || {})"
            }
        }
    ],

    // Wrap the returned element with a translation notice if needed
    wrapWithTranslationNotice(originalElement: any, props: any) {
        // Extract message content from props
        let content = null;
        if (props?.message?.content) {
            content = props.message.content;
        } else if (props?.children?.props?.message?.content) {
            content = props.children.props.message.content;
        }
        
        // Check if the message contains our target phrase
        if (content && typeof content === "string" && 
            /What Linux Distro should I use\??/gi.test(content)) {
            
            // Create the translation notice element
            const translationNotice = {
                type: "div",
                props: {
                    className: "flufflator-translation-notice",
                    style: {
                        fontSize: "12px",
                        color: "#b9bbbe",
                        marginTop: "4px",
                        fontStyle: "italic"
                    },
                    children: "(🌍 Translating from Nonsense to Fluff : I use Fluff Linux BTW.)"
                }
            };

            // Wrap both the original element and the notice in a fragment-like structure
            if (Array.isArray(originalElement)) {
                return [...originalElement, translationNotice];
            } else {
                return [originalElement, translationNotice];
            }
        }
        
        return originalElement;
    }
});