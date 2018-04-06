export default class Jyanken {
    constructor() {
        this.scores = []
        this.statuses = [0, 0, 0] // [draw, win, lose]
    }

    pon(humanHand, computerHand = Math.floor(Math.random() * 3)) {
        const judgment = (computerHand - humanHand + 3) % 3

        this.scores.push({
            human: humanHand,
            computer: computerHand,
            createdAt: new Date(),
            judgment: judgment
        })
        this.statuses[judgment]++
    }

    getScores() {
        return this.scores.slice().reverse()
    }

    getStatuses() {
        return {
            draw: this.statuses[0],
            win: this.statuses[1],
            lose: this.statuses[2]
        }
    }
}