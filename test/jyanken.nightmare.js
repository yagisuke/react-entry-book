import Nightmare from 'nightmare'
import assert from 'power-assert'

describe('じゃんけんアプリ', () => {
    const nightmare = Nightmare({ show: false })

    it('アクセスすると「じゃんけん PON!!」と表示される', (done) => {
        nightmare
        .goto('http://localhost:8080')
        .evaluate(() => {
            return document.querySelector('h1').innerText
        })
        .then((title) => {
            assert.equal(title, 'じゃんけん PON!!')
            done()
        })
    })
})