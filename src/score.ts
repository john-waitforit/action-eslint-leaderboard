import {containsEslintDisableFile, containsEslintDisableNextLine} from './utils'
import {getAuthor, getCommitDiff} from './git-commands'
import gitDiffParser, {Change, File} from 'gitdiff-parser'
import {POINTS} from './constants'

export const getAllScores = async (
  commits: string[]
): Promise<Record<string, number>> => {
  const allScores: Record<string, number> = {}

  for (const commit of commits) {
    const author = await getAuthor(commit)
    const score = await getCommitScore(commit)

    if (author in allScores) {
      allScores[author] += score
    } else {
      allScores[author] = 0
    }
  }

  return allScores
}

export const getPullRequestScore = async (
  pullRequestCommits: string[]
): Promise<number> => {
  let score = 0

  for (const commit of pullRequestCommits) {
    const commitScore = await getCommitScore(commit)
    score += commitScore
  }

  return score
}

export const getCommitScore = async (commit: string): Promise<number> => {
  try {
    const commitDiff = await getCommitDiff(commit)
    const files = gitDiffParser.parse(commitDiff)

    let score = 0
    for (const file of files) {
      score += getFileScore(file)
    }

    return score
  } catch (e) {
    return 0
  }
}

export const getFileScore = (file: File): number => {
  let score = 0

  for (const chunk of file.hunks) {
    for (const change of chunk.changes) {
      score += getChangeScore(change)
    }
  }

  return score
}

export const getChangeScore = (change: Change): number => {
  let score = 0
  const scoreMultiplier = getCommitScoreMultiplier(change)

  if (containsEslintDisableNextLine(change.content)) {
    score += scoreMultiplier * POINTS['NEXT_LINE']
  } else if (containsEslintDisableFile(change.content)) {
    score += scoreMultiplier * POINTS['FILE']
  }

  return score
}

const getCommitScoreMultiplier = (change: Change): number => {
  switch (change.type) {
    case 'delete':
      return 1
    case 'insert':
      return -1
    case 'normal':
      return 0
  }
}
