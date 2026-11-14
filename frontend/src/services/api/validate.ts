// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
import Ajv2020 from 'ajv/dist/2020'
import contractSchema from '../../../../contracts/simulation_schema.json'
import type { SimulationResponse } from '../../types/contract'

const ajv = new Ajv2020({ allErrors: true, strict: false })
const validateContract = ajv.compile<SimulationResponse>(contractSchema)

export class ContractValidationError extends Error {
  readonly details: string[]

  constructor(details: string[]) {
    super('The simulation response does not match contracts/simulation_schema.json.')
    this.name = 'ContractValidationError'
    this.details = details
  }
}

/** Throws ContractValidationError unless the payload satisfies the shared JSON contract. */
export function assertSimulationResponse(payload: unknown): SimulationResponse {
  if (validateContract(payload)) {
    return payload
  }
  const details = (validateContract.errors ?? []).map(
    (e) => `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}`,
  )
  throw new ContractValidationError(details)
}
