import React, { useEffect, useState } from "react"
import { Badge, Button, Card, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap"
import { Typeahead } from "react-bootstrap-typeahead"
import { useTitle } from "react-use"
import { ADHIKARAM, APP_NAME, KURAL, KURALS, SUBMIT, SAMACHEER_EDUCATION, SAMACHEER_CLASS } from "../constants"
import paals from "../data/paals.json"
import vaguppukkal from "../data/samacheer-classes.json"
import samacheerKurals from "../data/samacheer-kurals.json"
import { log } from "../helpers"
import { getAdhikarams, getKurals } from "../service/Thirukural"
import {getAdhikaramNumbers } from "../service/Samacheer"

const SamacheerKurals = () => {
  // const [selectedPaal, setSelectedPaal] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [adhikarams, setAdhikarams] = useState([]);
  const [selectedAdhikaram, setSelectedAdhikaram] = useState(null)
  const [kurals, setKurals] = useState([])
  const [termKurals, setTermKurals] = useState([])

  useTitle(`${KURALS} | ${APP_NAME}`)

  useEffect(() => {
    log(">>>>> side-effect")
    if (!selectedClass) {
      // const classes = getClassNumbers()
      const vaguppu = vaguppukkal[0]
      const termKurals = samacheerKurals[vaguppu]
      const paal = paals[0]
      const adhikarams = getAdhikarams(paal)
      log(`adhikarams for ${paal}: ${adhikarams}`)
      const adhikaram = adhikarams[13]
      const kurals = getKurals(adhikaram.no)
      log(`kurals for ${adhikaram.no}-${adhikaram.name}: ${JSON.stringify(kurals)}`)

      setSelectedClass([vaguppu])
      setAdhikarams(adhikarams)
      setSelectedAdhikaram([adhikaram])
      setTermKurals(termKurals)
      setKurals(kurals)
    }
    log("<<<<< side-effect")
  }, [selectedClass])

  const handleSubmit = (event) => {
    log("handle form submit")
    const adhikaram = selectedAdhikaram[0]
    log(`get kurals for adhikaram: ${adhikaram}`)
    const kurals = getKurals(adhikaram.no)
    log(`kurals: ${JSON.stringify(kurals)}`)
    setKurals(kurals)
    event.preventDefault()
  }

  // const handlePaalChange = (values) => {
  //   log(`handle paal change, values: ${values}`)
  //   setSelectedPaal(values)
  //   if (values.length) {
  //     const [paal] = values
  //     const adhikarams = getAdhikarams(paal)
  //     log(`adhikarams for ${paal}: ${adhikarams}`)
  //     setAdhikarams(adhikarams)
  //     setSelectedAdhikaram([adhikarams[0]])
  //   }
  // }

  const handleClassChange = (values) => {
    log(`handle class change, values: ${values}`)
    setSelectedClass(values)
    if (values.length) {
      const [vaguppu] = values
      const adhikarams = getAdhikaramNumbers(vaguppu)
      log(`adhikarams for ${vaguppu}: ${adhikarams}`)
      setAdhikarams(adhikarams)
      setSelectedAdhikaram([adhikarams[0]])
    }
  }

  const renderKurals = () => (
    kurals.map((k, idx) => (
      <Row key={idx} className="my-3">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="fs-5">
                <Col >
                  <Badge bg="primary">{`${KURAL} ${k.kuralNo}`}</Badge>
                </Col>
              </Row>
              <Row className="my-3">
                <Col className={(termKurals[0].includes(k.kuralNo) || termKurals[1].includes(k.kuralNo)) ? "kural-text kural-text-bold" : "kural-text"}>
                { k.kural }
                </Col>
              </Row>
              <Row className="my-3">
                  <audio src={"https://www.tamilvu.org/library/l2100/audio/" + k.kuralNo + ".mp3"} controls />
              </Row>
              <Tabs defaultActiveKey="0" className="my-3">
                {k.explanations.map((e, idx) => (<Tab key={idx} eventKey={idx} title={e.author}>{e.explanation}</Tab>))}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    ))
  )

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={{ span: 4, offset: 1 }}>
                <Form.Group>
                  <Form.Label>{SAMACHEER_EDUCATION}</Form.Label>
                  <Typeahead
                    id="samacheer-education-selector"
                    onChange={handleClassChange}
                    options={vaguppukkal}
                    placeholder={SAMACHEER_CLASS}
                    selected={selectedClass !== null ? selectedClass : []}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{ADHIKARAM}</Form.Label>
                  <Typeahead
                    id="adhikaram-selector"
                    onChange={setSelectedAdhikaram}
                    labelKey={(option) => `${option.no} - ${option.name}`}
                    options={adhikarams}
                    placeholder={ADHIKARAM}
                    selected={selectedAdhikaram !== null ? selectedAdhikaram : []}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>&nbsp;</Form.Label>
                  <Form.Control as={Button} type="submit">
                    {SUBMIT}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {renderKurals()}

      <Row className="mb-2">
        <Col>&nbsp;</Col>
      </Row>
    </Container>
  )
}

export default SamacheerKurals
