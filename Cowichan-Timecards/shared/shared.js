// shared functions
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
 * Normalizes a raw name down to a "first last" key, applying the nickname map to the first
 * name e.g. "John Doe," "Jon Doe," and "Jonathan Doe" match.
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
