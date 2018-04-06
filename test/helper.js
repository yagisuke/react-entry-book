import Nightmare from 'nightmare'

// Nightmareは、↓のように独自APIをNightmare.action()で作成することが可能
Nightmare.action('getTexts', function(selector, done) {
    this.evaluate_now((selector) => {
        return [].slice.call(document.querySelectorAll(selector)).map((e) => e.innerText)
    }, done, selector)
})

// Nightmareは、↓のように独自プラグインを作成することが可能
export const touchTap = (selector) => {
    return (nightmare) => {
        nightmare
        .mousedown(selector)
        .mouseup(selector)
    }
}