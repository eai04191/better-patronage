export default defineBackground(() => {
    chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
        const refferrer = new URL(item.referrer);

        switch (refferrer.hostname) {
            case "subscribestar.adult": {
                const filename = new URL(item.url).searchParams.get("filename");
                if (!filename) {
                    console.warn("Could not find filename for", item);
                    return;
                }

                suggest({
                    conflictAction: "uniquify",
                    filename,
                });
                break;
            }
            case "www.patreon.com": {
                const postId = item.url.match(/h=(\d+)/)?.[1];
                if (!postId) {
                    console.warn("Could not find post ID for", item);
                    return;
                }

                suggest({
                    conflictAction: "uniquify",
                    filename: `${postId}-${item.filename}`,
                });
                break;
            }
        }
    });
});
