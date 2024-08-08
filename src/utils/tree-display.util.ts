export function treeDisplay(inputDict: Record<string, any>, depth: number = 0): string {
    // Define constants within the method
    const FINAL_CHAR = '  └ ';
    const ENTRY_CHAR = '  ├ ';
    const SKIP_CHAR = '  ┊ ';
    const KEY_CHAR = ': ';
    const NEWLINE_CHAR = '\n';

    let outStr = '';

    // Only add "Message" header at the top level
    // if (depth === 0) {
    //     outStr += 'Message\n';
    // }

    if (typeof inputDict === 'object' && inputDict !== null) {
        const entries = Object.entries(inputDict);
        const finalIndex = entries.length - 1;

        entries.forEach(([key, value], index) => {
            outStr += SKIP_CHAR.repeat(depth);

            if (index === finalIndex) {
                outStr += FINAL_CHAR;
            } else {
                outStr += ENTRY_CHAR;
            }

            if (typeof value === 'object' && value !== null) {
                outStr += `<b>${key}</b>${NEWLINE_CHAR}${treeDisplay(value, depth + 1)}`;
            } else {
                outStr += `<b>${key}</b>${KEY_CHAR}${value}${NEWLINE_CHAR}`;
            }
        });
    } else {
        outStr = String(inputDict);
    }

    return outStr;
}

export function cleanMessage(message: Record<string, any>): Record<string, any> {
    const cleanedMessage = { ...message };

    for (const key of Object.keys(cleanedMessage)) {
        if (key === 'forward_from' || key === 'from') {
            delete cleanedMessage[key]['is_bot'];
        } else if (key !== 'data' && key !== 'text') {
            delete cleanedMessage[key];
        }
    }

    return cleanedMessage;
}
