// Shared helpers used across popup pages (timecards, sickdays, daysoff,
// settings) and the content script that runs on fdtpro.com.
//
// This is loaded as a plain classic script (no import/export) so it can be
// dropped in via a <script> tag before each page's own script, and via the
// content_scripts array in manifest.json before content.js. Every function
// here becomes a global, exactly like the old duplicated copies did.

/**
 * Parses the "nickname = actual name" text saved on the Settings page into
 * a lookup object, e.g. { mike: "michael" }.
 */
function parseNicknameMap(text) {
    const map = {};

    text.split("\n").forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const parts = trimmed.split("=");
        if (parts.length !== 2) return;

        const nickname = parts[0].trim().toLowerCase();
        const canonical = parts[1].trim().toLowerCase();

        map[nickname] = canonical;
    });

    return map;
}

/**
 * Loads and parses the nickname map from chrome.storage.local.
 */
async function getNicknameMap() {
    const result = await chrome.storage.local.get("nicknameMapText");
    return parseNicknameMap(result.nicknameMapText || "");
}

/**
 * Normalizes a raw name (from pasted pivot data, or read off the FDT Pro
 * page) down to a "first last" key, applying the nickname map to the first
 * name so e.g. "Mike Smith" and "Michael Smith" match.
 */
function normalizeName(str, nicknameMap) {
    const cleaned = str
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/\./g, "")
        .replace(/\s+/g, " ")
        .trim();

    const parts = cleaned.split(" ");
    if (parts.length < 2) return cleaned;

    const first = nicknameMap[parts[0]] || parts[0];
    const last = parts[parts.length - 1];

    return `${first} ${last}`;
}

/** Converts an "HH:MM" string into minutes since midnight. */
function timeToMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

/** Converts minutes since midnight back into an "HH:MM" string. */
function minutesToTime(mins) {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
}
