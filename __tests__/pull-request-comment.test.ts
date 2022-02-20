import {expect, describe, it} from '@jest/globals'
import {
  generatePrComment,
  getSortedLeaderboardEntries,
  generatePodium,
  generateLeaderboard,
  generateYourScore
} from '../src/pull-request-comment'

const ME = 'me'
const MY_SCORE = 10

const allScores: Record<string, number> = {
  batman: 100,
  'james-bond': 99,
  zoro: 101,
  [ME]: MY_SCORE
}

const sortedLeaderboardEntries = getSortedLeaderboardEntries(allScores)

describe('Pull request comment', () => {
  describe('generatePodium', () => {
    it('should show a podium', () => {
      const podium = generatePodium(sortedLeaderboardEntries)

      const expectedPodium =
        `:1st_place_medal:|:2nd_place_medal:|:3rd_place_medal:\n` +
        `-|-|-\n` +
        `**zoro** (101)|**batman** (100)|**james-bond** (99)`

      expect(podium).toBe(expectedPodium)
    })
  })

  describe('generateYourScore', () => {
    it('should show a podium', () => {
      const yourScore = generateYourScore(sortedLeaderboardEntries, ME, 2)

      const expectedYourScore =
        `- Points earned with this PR: \`2\`\n` +
        `- Points earned since the beginning of the week: \`10\`\n` +
        `- Rank: \`4\``

      expect(yourScore).toBe(expectedYourScore)
    })
  })

  describe('generateLeaderboard', () => {
    it('should show a podium', () => {
      const leaderboard = generateLeaderboard(sortedLeaderboardEntries)

      const expectedLeaderboard = `1. **zoro** (101)
2. **batman** (100)
3. **james-bond** (99)
4. **me** (10)`

      expect(leaderboard).toBe(expectedLeaderboard)
    })
  })

  describe('generatePrComment ', () => {
    it('should generate a correct full message', () => {
      const prComment = generatePrComment(allScores, ME, 2)

      const expectedPodium = `## :shield: Eslint heroes

### Your score[^1]:
- Points earned with this PR: \`2\`
- Points earned since the beginning of the week: \`10\`
- Rank: \`4\`

### Podium[^2]:
:1st_place_medal:|:2nd_place_medal:|:3rd_place_medal:
-|-|-
**zoro** (101)|**batman** (100)|**james-bond** (99)

---

<details>
<summary> :bar_chart:  Full leaderboard</summary>

1. **zoro** (101)
2. **batman** (100)
3. **james-bond** (99)
4. **me** (10)
</details>

[^1]: You earn \`+1\` point for each \`eslint-disable-next-line\` removed and \`+10\` for each \`eslint-disable\` (whole file) removed
[^2]: The leaderboard restarts every Mondays at 00:00
`

      expect(prComment).toBe(expectedPodium)
    })
  })
})
