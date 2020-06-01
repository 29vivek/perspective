/******************************************************************************
 *
 * Copyright (c) 2019, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

exports.click_details = async (page, x = 310, y = 300) => {
    const viewer = await page.$("perspective-viewer");

    const click_event = page.evaluate(
        element =>
            new Promise(resolve => {
                element.addEventListener("perspective-click", e => {
                    resolve(e.detail);
                });
            }),
        viewer
    );
    await page.mouse.click(x, y);
    return await click_event;
};

exports.capture_update = async function capture_update(page, viewer, body) {
    await page.evaluate(element => {
        element.addEventListener("perspective-view-update", () => {
            element.setAttribute("test-updated", true);
        });
    }, viewer);
    await body();
    try {
        await page.waitFor(element => element.hasAttribute("test-updated"), {timeout: 3000}, viewer);
    } catch (e) {
        console.error("Missing 'test-updated' attribute");
    }
    await page.evaluate(element => element.removeAttribute("test-updated"), viewer);
};
