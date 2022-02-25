import {expect, describe, it} from '@jest/globals'
import gitDiffParser, {Change, File} from 'gitdiff-parser'
import {isNilDiff} from './mocks/is-nil-diff.mock'
import {getFileScore} from '../src/score'

describe('Score', () => {
  it('should get 20+ points for the isNil diff', () => {
    const files = gitDiffParser.parse(isNilDiff)

    let score = 0
    for (const file of files) {
      score += getFileScore(file)
    }

    expect(score).toBe(21)
  })
})
