import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const frontendDirectory = path.resolve(scriptDirectory, '..')
const projectDirectory = path.resolve(frontendDirectory, '..')

const candidatesSource = JSON.parse(
  await readFile(path.join(projectDirectory, 'data/candidates.json'), 'utf8'),
)
const curriculumSource = JSON.parse(
  await readFile(path.join(projectDirectory, 'data/curriculum.json'), 'utf8'),
)

const snapshot = {
  source: {
    candidates: 'data/candidates.json',
    curriculum: 'data/curriculum.json',
  },
  candidates: candidatesSource.candidates.map(({ member, missions, signals }) => ({
    member: {
      id: member.id,
      name: member.name,
      jobRole: member.jobRole,
      yearsExperience: member.yearsExperience,
      education: member.education,
      status: member.status,
    },
    missions: missions.map((mission) => ({
      day: mission.day,
      ...(typeof mission.passed === 'boolean' ? { passed: mission.passed } : {}),
      ...(typeof mission.attempts === 'number' ? { attempts: mission.attempts } : {}),
      ...(mission.skipped ? { skipped: true } : {}),
    })),
    signals,
  })),
  curriculum: curriculumSource.days.map(({ day, title, type }) => ({ day, title, type })),
  modules: curriculumSource.modules,
}

await writeFile(
  path.join(frontendDirectory, 'src/data/officialData.json'),
  `${JSON.stringify(snapshot, null, 2)}\n`,
)

console.log(
  `Synced ${snapshot.candidates.length} candidates and ${snapshot.curriculum.length} curriculum days.`,
)
