import thirukurals from "../data/thirukurals.json"
import { FROM_SAMACHEER_CLASS, TO_SAMACHEER_CLASS } from "../constants"
import samacheerKurals from "../data/samacheer-kurals.json"

const getKuralNumbers = (classNo, terms = []) => {
  const termKuralNumbers = samacheerKurals[classNo]
  if (terms.length) {
    terms = terms.map(term => parseInt(term))
    return termKuralNumbers.reduce((accumulator, kuralNumbers, idx) =>
      (terms.includes(idx + 1) ? accumulator.concat(...kuralNumbers) : accumulator), [])
  }
  return termKuralNumbers.flat()
}

const getAdhikaramNumbers = (classNo, terms = []) => {
  const termKuralNumbers = samacheerKurals[classNo]
  const lastTerm = termKuralNumbers[termKuralNumbers.length-1]
  if (lastTerm.length) {
    const kuralsForAdhikaram = lastTerm.filter( (kuralNumber) => (kuralNumber % 10 === 0)) 
    const aadhikaramNos = kuralsForAdhikaram.map( (kuralNumber) => (kuralNumber/10))
    return  getAdhikaramsAndKuralsForAdhikaramNumber(aadhikaramNos) .map((item) => ({ no: item.aadhikaramNo, name: item.adhikaramName }))
    // return aadhikaramNos.map( (aadhikaramNo) => (getAdhikaramsAndKuralsForAdhikaramNumber(parseInt(aadhikaramNo)) .map((item) => ({ no: item.aadhikaramNo, name: item.adhikaramName }))))
  }
}

const getClassNumbers = () => {
  return Array(TO_SAMACHEER_CLASS - FROM_SAMACHEER_CLASS + 1)
    .fill(FROM_SAMACHEER_CLASS)
    .map((start, idx) => start + idx)
}

const getAdhikaramsAndKuralsForAdhikaramNumber = (aadhikaramNos) => {
  return thirukurals.filter((thirukural) => aadhikaramNos.includes(thirukural.aadhikaramNo))
}

export { getClassNumbers, getKuralNumbers, getAdhikaramNumbers }
