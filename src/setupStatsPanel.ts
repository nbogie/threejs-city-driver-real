import Stats from "three/examples/jsm/libs/stats.module";


/** Adds a Stats panel to the web page, capable of showing frame rate and, and memory usage.
 * @returns the Stats panel - be sure to call stats.update() each frame.
 * */
export function setupStatsPanel(): Stats {
    const stats = Stats();
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom

    //You could adjust the parent of the stats panel.
    document.body.appendChild(stats.dom);

    return stats;
}