import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const Config: React.FC = () => {
    useEffect(() => {
        microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
            // Notify Microsoft Teams that the configuration was successful
            const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
            microsoftTeams.pages.config.setConfig({
                entityId: "CloudCanvasViewer",
                contentUrl: baseUrl + "/index.html#/tab",
                suggestedDisplayName: "Cloud Canvas Viewer",
                websiteUrl: baseUrl + "/index.html#/tab",
            });

            saveEvent.notifySuccess();
        });

        // Set validity state to true to enable the Save button
        microsoftTeams.pages.config.setValidityState(true);
    }, []);

    return (
        <div>
            <h1>Configuration Page</h1>
            <p>All done.</p>
        </div>
    );
};

export default Config;