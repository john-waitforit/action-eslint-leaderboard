const TITLE = `## :shield: Eslint heroes`
const YOUR_SCORE = `### Your score[^1]:`
const PODIUM = `### Podium[^2]:`
const LEADERBOARD = `<summary> :bar_chart:  Full leaderboard</summary>`
const FOOTNOTE = `[^1]: You earn \`+1\` point for each \`eslint-disable-next-line\` removed and \`+10\` for each \`eslint-disable\` (whole file) removed
[^2]: The leaderboard restarts every Mondays at 00:00`

interface LeaderboardEntry {
  author: string
  score: number
}

export const generatePrComment = (
  allScores: Record<string, number>,
  me: string,
  pullRequestScore: number
): string => {
  const sortedLeaderboardEntries = getSortedLeaderboardEntries(allScores)

  return `${TITLE}

${YOUR_SCORE}
${generateYourScore(sortedLeaderboardEntries, me, pullRequestScore)}

${PODIUM}
${generatePodium(sortedLeaderboardEntries)}

---

<details>
${LEADERBOARD}
${generateLeaderboard(sortedLeaderboardEntries)}
</details>

${FOOTNOTE}
`
}

export const generatePodium = (
  sortedLeaderboardEntries: LeaderboardEntry[]
): string => {
  const first = formatLeaderboardEntry(sortedLeaderboardEntries[0])
  const second = formatLeaderboardEntry(sortedLeaderboardEntries[1])
  const third = formatLeaderboardEntry(sortedLeaderboardEntries[2])

  return (
    `:1st_place_medal:|:2nd_place_medal:|:3rd_place_medal:\n` +
    `-|-|-\n` +
    `${first}|${second}|${third}`
  )
}

const formatLeaderboardEntry = (leaderboardEntry: LeaderboardEntry): string =>
  `**${leaderboardEntry.author}** (${leaderboardEntry.score})`

export const generateYourScore = (
  sortedLeaderboardEntries: LeaderboardEntry[],
  me: string,
  pullRequestScore: number
): string => {
  const myLeaderboardIndex = sortedLeaderboardEntries.findIndex(
    entry => entry.author === me
  )

  const weekScore =
    myLeaderboardIndex === -1
      ? ''
      : sortedLeaderboardEntries[myLeaderboardIndex].score

  const weekRank = myLeaderboardIndex === -1 ? '' : myLeaderboardIndex + 1

  const PR_SCORE = `- Points earned with this PR:`
  const WEEK_SCORE = `- Points earned since the beginning of the week:`
  const RANK = `- Rank:`

  return `${PR_SCORE} \`${pullRequestScore}\`
${WEEK_SCORE} \`${weekScore}\`
${RANK} \`${weekRank}\``
}

export const generateLeaderboard = (
  sortedLeaderboardEntries: LeaderboardEntry[]
): string => {
  return sortedLeaderboardEntries
    .map((entry, index) => `${index + 1}. ${formatLeaderboardEntry(entry)}`)
    .join('\n')
}

export const getSortedLeaderboardEntries = (
  allScores: Record<string, number>
): LeaderboardEntry[] =>
  Object.entries(allScores)
    .map(([author, score]) => ({
      author,
      score
    }))
    .sort((a, b) => (a.score > b.score ? -1 : 1))
