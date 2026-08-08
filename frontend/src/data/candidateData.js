import officialData from './officialData.json'

export const learningStatuses = {
  easy: {
    label: 'Completed easily',
    shortLabel: 'First try',
    tone: 'positive',
  },
  attempts: {
    label: 'Needed multiple attempts',
    shortLabel: 'Retried',
    tone: 'warning',
  },
  skipped: {
    label: 'Skipped',
    shortLabel: 'Skipped',
    tone: 'neutral',
  },
  failed: {
    label: 'Not passed',
    shortLabel: 'Needs review',
    tone: 'alert',
  },
}

export const curriculumDays = officialData.curriculum
export const curriculumModules = officialData.modules

const curriculumByDay = new Map(curriculumDays.map((item) => [item.day, item]))
const accents = ['violet', 'cyan', 'blue', 'rose']

export function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function getMissionStatus(mission) {
  if (mission.skipped) return 'skipped'
  if (mission.passed === false) return 'failed'
  if ((mission.attempts ?? 1) > 1) return 'attempts'
  return 'easy'
}

function toMissionSignal(mission) {
  const curriculum = curriculumByDay.get(mission.day)
  return {
    day: mission.day,
    title: curriculum?.title ?? `Curriculum Day ${mission.day}`,
    topic: `Day ${mission.day} · ${curriculum?.title ?? 'Curriculum topic'}`,
    status: getMissionStatus(mission),
    attempts: mission.attempts,
  }
}

function buildCardSignals(signals) {
  const firstTry = signals.filter((signal) => signal.status === 'easy').length
  const retried = signals.filter((signal) => signal.status === 'attempts').length
  const attention = signals.filter((signal) => ['skipped', 'failed'].includes(signal.status)).length

  return [
    firstTry > 0 && { label: `${firstTry} first-try`, tone: 'positive' },
    retried > 0 && { label: `${retried} retried`, tone: 'warning' },
    attention > 0 && { label: `${attention} need attention`, tone: 'alert' },
  ].filter(Boolean)
}

function attentionSignals(allSignals) {
  return allSignals
    .filter((signal) => signal.status !== 'easy')
    .sort((a, b) => {
      const priority = { failed: 0, skipped: 1, attempts: 2 }
      return (priority[a.status] ?? 3) - (priority[b.status] ?? 3) || (b.attempts ?? 0) - (a.attempts ?? 0)
    })
}

function representativeSignals(allSignals) {
  const attention = attentionSignals(allSignals)
  const confident = allSignals.filter((signal) => signal.status === 'easy')
  const selected = [...attention.slice(0, 3), ...confident.slice(0, Math.max(0, 5 - Math.min(attention.length, 3)))]

  return selected.sort((a, b) => a.day - b.day)
}

export const candidates = officialData.candidates.map((candidate, index) => {
  const allSignals = candidate.missions.map(toMissionSignal)
  const attentionAreas = attentionSignals(allSignals)

  return {
    id: candidate.member.id,
    name: candidate.member.name,
    initials: getInitials(candidate.member.name),
    role: candidate.member.jobRole,
    experience: candidate.member.yearsExperience,
    education: candidate.member.education,
    status: candidate.member.status,
    accent: accents[index % accents.length],
    signals: representativeSignals(allSignals),
    allSignals,
    attentionAreas,
    cardSignals: buildCardSignals(allSignals),
    journeyStats: candidate.signals,
    missionCount: candidate.missions.length,
    source: 'official',
  }
})

export function createCustomCandidate({ form, selectedHistory }) {
  const allSignals = Object.entries(selectedHistory)
    .map(([day, status]) => {
      const curriculum = curriculumByDay.get(Number(day))
      return {
        day: Number(day),
        title: curriculum.title,
        topic: `Day ${day} · ${curriculum.title}`,
        status,
      }
    })
    .sort((a, b) => a.day - b.day)

  return {
    id: `custom-${Date.now()}`,
    name: form.name.trim(),
    initials: getInitials(form.name) || 'YC',
    role: form.role.trim(),
    experience: Number(form.experience),
    education: form.education.trim(),
    accent: 'violet',
    signals: representativeSignals(allSignals),
    allSignals,
    attentionAreas: attentionSignals(allSignals),
    cardSignals: buildCardSignals(allSignals),
    missionCount: allSignals.length,
    source: 'custom',
  }
}

export const demoCandidate = candidates.find((candidate) => candidate.id === 'CAND-001')
