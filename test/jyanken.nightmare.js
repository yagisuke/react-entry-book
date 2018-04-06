import Nightmare from 'nightmare'
import assert from 'power-assert'
import { touchTap } from './helper';

describe('じゃんけんアプリ', () => {
    const nightmare = Nightmare({ show: false })
    const URL = 'http://localhost:8080/'

    it('アクセスすると「じゃんけん PON!!」と表示される', (done) => {
        nightmare
        .goto(URL)
        .evaluate(() => {
            return document.querySelector('h1').innerText
        })
        .then((title) => {
            assert.equal(title, 'じゃんけん PON!!')
            done()
        })
    })

    it('グーをクリックすると対戦が行われ、対戦結果が表示される', (done) => {
        nightmare
        .goto(URL)
        .click('.test-btn-guu')
        .getTexts('tbody td')
        .then((texts) => {
            const [time, human, computer, judgment] = texts

            assert.equal(human, '👊グー')
            assert.ok(computer.match(/^(👊グー|✌️チョキ|🖐パー)$/))
            assert.ok(judgment.match(/^(引き分け|勝ち|負け)$/))
            done()
        })
    })

    it('チョキをクリックした後に対戦成績をクリックすると、対戦成績が表示される', (done) => {
        nightmare
        .goto(URL)
        .click('.test-btn-choki')
        .click('.test-tab-status')
        .getTexts('tbody td')
        .then((texts) => {
            const [win, lose, draw] = texts.map((e) => Number(e))

            assert.ok(win >= 0 && win <= 1)
            assert.ok(lose >= 0 && lose <= 1)
            assert.ok(draw >= 0 && draw <= 1)
            assert.equal(win + lose + draw, 1)
            done()
        })
    })

    it('3回クリックすると、対戦結果が3行表示される', (done) => {
        nightmare
        .goto(URL)
        .click('.test-btn-guu')
        .click('.test-btn-choki')
        .click('.test-btn-paa')
        .getTexts('tbody tr')
        .then((texts) => {
            assert.equal(texts.length, 3)
            done()
        })
    })
})