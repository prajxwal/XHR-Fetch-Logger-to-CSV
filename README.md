# XHR/Fetch Logger to CSV (Full Version)


**Description**: This Tampermonkey script captures failed XHR and Fetch requests made on a specified website, logging details such as URL, status code, response text, and payload data. The data is saved in a CSV file for easier analysis and debugging.

---

## Features

- **Interception of Failed Requests**: Captures all failed XHR and Fetch requests with status codes in the 400-599 range.
- **Detailed Logging**: Logs request details, including URL, status, response text, payload, and timestamp.
- **CSV Export**: Converts the collected request logs into a CSV format and provides an easy download option.
- **Debug Mode**: Adds debug logs in the browser console to assist with understanding the process flow and troubleshooting issues.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey and copy the code from this repository.
3. Save and enable the script. It will activate on pages that match the specified domain: `https://entersitehere.com/*`.

---

## Usage

1. **Logging Requests**: The script automatically logs failed XHR and Fetch requests. View the logs in the console under `[XHR/Fetch Logger Debug]`.
2. **Download CSV**: A "Download Failed Requests CSV" button appears at the bottom-right of the page. Click it to download the log data as a CSV file.

---

## CSV Format

The CSV file includes the following columns:

- **Type**: Request type (XHR or Fetch)
- **URL**: Request URL
- **Status**: HTTP status code
- **Response**: Response body
- **Payload**: Request payload data
- **Timestamp**: Time of the request

---

## Code Breakdown

- **Failed Request Logging**: Intercepts XHR and Fetch calls, logging relevant details if a request fails.
- **CSV Conversion**: Converts log data into a CSV format, handling special characters for compatibility.
- **Download Mechanism**: Utilizes Blob and URL API to allow downloading the CSV file directly from the browser.
- **Debug Logging**: Verbose logging in the console for debugging, with messages prefixed by `[XHR/Fetch Logger Debug]`.

---

## Troubleshooting

- **No Logs**: If the download button shows "No failed requests logged yet," verify that the requests are indeed failing (status codes 400–599).
- **Blob or URL Errors**: These indicate browser support issues. Ensure your browser is updated.

---

## Contributing

Feel free to submit issues or pull requests for feature suggestions, bug fixes, or optimizations.
