export default defineContentScript({
    matches: ["https://subscribestar.adult/*"],
    main() {
        updateAttachmentLinkHref();
        observeNewAttachments();
    },
});

function observeNewAttachments() {
    const target = document.querySelector(".section-body .posts .posts");
    if (!target) {
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length === 0) {
                return;
            }
            updateAttachmentLinkHref();
        });
    });

    observer.observe(target, {
        childList: true,
    });
    updateAttachmentLinkHref();
}

function updateAttachmentLinkHref() {
    const unprocessedDocTitles = [
        ...document.querySelectorAll(
            `.uploads-docs .doc_preview-data:not([href*="&filename="]) .doc_preview-title`,
        ),
    ];

    for (const docTitle of unprocessedDocTitles) {
        const originalFilename = docTitle.textContent;
        if (!originalFilename) {
            continue;
        }

        const docLink =
            docTitle.closest<HTMLAnchorElement>("a.doc_preview-data");
        if (!docLink) {
            continue;
        }
        const postId = docLink.href.match(/posts\/(\d+)\//)?.[1];
        if (!postId) {
            console.warn(
                "Could not find post ID for",
                originalFilename,
                docTitle,
            );
            continue;
        }
        const filename = `${postId}-${originalFilename}`;
        docLink.href += `&filename=${encodeURIComponent(filename)}`;
        console.log("Updated link", filename);
    }
}
