// ==UserScript==
// @name         XHR/Fetch Logger to CSV (Full Version)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Log failed XHR and fetch requests with payload and response to CSV file (with full debugging)
// @author       Prajwal
// @match        https://entersitehere.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Capture Failed XHR and Fetch Requests
    const failedRequests = [];

    // Debug logging function
    function debugLog(message) {
        console.log(`[XHR/Fetch Logger Debug]: ${message}`);
    }

    // XHR Interception
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    let xhrPayload = null;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._method = method;
        this._url = url;
        this.addEventListener('load', function() {
            if (this.status >= 400 && this.status <= 599) {
                logFailedRequest('XHR', this._url, this.status, this.responseText, xhrPayload);
            }
        });
        origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        xhrPayload = data;
        origSend.apply(this, arguments);
    };

    // Fetch Interception
    const origFetch = window.fetch;
    window.fetch = async function(...args) {
        let requestData = args[1]?.body || 'No payload';
        const response = await origFetch.apply(this, args);
        if (!response.ok) {
            const responseText = await response.clone().text();
            logFailedRequest('Fetch', response.url, response.status, responseText, requestData);
        }
        return response;
    };

    // Log failed request details and add to failedRequests array
    function logFailedRequest(requestType, url, status, responseText, requestData) {
        const timestamp = new Date().toLocaleString();
        const requestDetails = {
            type: requestType,
            url: url,
            status: status,
            response: responseText,
            payload: requestData,
            timestamp: timestamp
        };
        failedRequests.push(requestDetails);
        debugLog(`Logged failed ${requestType} request to ${url}`);

        // Print to console
        console.log(`---- ${requestType} Request Failed ----`);
        console.log(`URL: ${url}`);
        console.log(`Status: ${status}`);
        console.log(`Payload:`, requestData);
        console.log(`Response:`, responseText);
        console.log(`Timestamp: ${timestamp}`);
        console.log('----------------------------------');
    }

    // Function to convert failedRequests array to CSV
    function convertToCSV(objArray) {
        debugLog("Starting CSV conversion");
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        debugLog(`Array length: ${array.length}`);
        let str = 'Type,URL,Status,Response,Payload,Timestamp\r\n';

        for (let i = 0; i < array.length; i++) {
            debugLog(`Processing row ${i + 1}`);
            let line = '';
            for (let index in array[i]) {
                if (line !== '') line += ',';
                let value = array[i][index];
                debugLog(`Processing field: ${index}, Value: ${value}`);
                // Escape double quotes and wrap fields containing commas or newlines
                value = (value || '').toString().replace(/"/g, '""');
                if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                    value = `"${value}"`;
                }
                line += value;
            }
            str += line + '\r\n';
        }
        debugLog(`CSV conversion complete. Total rows: ${array.length + 1}`);
        debugLog(`CSV Preview (first 200 chars): ${str.substring(0, 200)}`);
        return str;
    }

    // Function to download CSV file
    function downloadCSV() {
        debugLog("Download button clicked");
        try {
            if (failedRequests.length === 0) {
                debugLog("No failed requests logged");
                alert("No failed requests logged yet.");
                return;
            }

            debugLog(`Number of failed requests: ${failedRequests.length}`);

            let csv;
            try {
                csv = convertToCSV(failedRequests);
                debugLog("CSV conversion successful");
            } catch (conversionError) {
                console.error("Error in CSV conversion:", conversionError);
                throw new Error(`CSV conversion failed: ${conversionError.message}`);
            }

            let blob;
            try {
                blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                debugLog("Blob created successfully");
            } catch (blobError) {
                console.error("Error creating Blob:", blobError);
                throw new Error(`Blob creation failed: ${blobError.message}`);
            }

            let url;
            try {
                url = URL.createObjectURL(blob);
                debugLog("URL created successfully");
            } catch (urlError) {
                console.error("Error creating URL:", urlError);
                throw new Error(`URL creation failed: ${urlError.message}`);
            }

            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'failed_requests.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);

            debugLog("Triggering download");
            link.click();
            document.body.removeChild(link);
            debugLog("Download complete");

        } catch (error) {
            console.error("Detailed error in downloadCSV:", error);
            alert(`An error occurred while downloading the CSV: ${error.message}. Check the console for details.`);
        }
    }

    // Create a button to trigger the CSV download
    function createDownloadButton() {
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download Failed Requests CSV';
        downloadButton.style.position = 'fixed';
        downloadButton.style.bottom = '20px';
        downloadButton.style.right = '20px';
        downloadButton.style.zIndex = '9999';
        downloadButton.addEventListener('click', downloadCSV);
        document.body.appendChild(downloadButton);
        debugLog("Download button created and added to the page");
    }

    // Wait for the DOM to be fully loaded before adding the button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDownloadButton);
    } else {
        createDownloadButton();
    }

    debugLog("Script initialized");
})();