import React from 'react'
import testUtils from 'react-dom/test-utils'
import jestFetchMock from 'jest-fetch-mock'
import { mount as enzymeMount } from 'enzyme'

import { Formula, formula } from '@pi-base/core'
import { MemoryRouter as Router, Route } from 'react-router'
import { Property, Space, Store, Theorem } from '../models'
import * as Context from '../models/Store/context'

export const act = testUtils.act
export const fetch = jestFetchMock

// TODO: push these down to @pi-base/core
export function property({ uid, ...opts }: { uid: string } & Partial<Property>): Property {
  return {
    uid,
    counterexamples_id: undefined,
    name: uid,
    description: uid,
    aliases: [],
    refs: [],
    ...opts
  }
}

export function space({ uid, ...opts }: { uid: string } & Partial<Space>): Space {
  return {
    uid,
    counterexamples_id: undefined,
    name: uid,
    description: uid,
    aliases: [],
    refs: [],
    ambiguous_construction: false,
    ...opts
  }
}

export function theorem({ uid, when, then, ...opts }: {
  uid: string
  when: Formula<string>
  then: Formula<string>
} & Partial<Theorem>): Theorem {
  return {
    uid,
    counterexamples_id: undefined,
    description: uid,
    refs: [],
    when,
    then,
    ...opts
  }
}

export function wrap(component: JSX.Element) {
  return <Wrapper>{component}</Wrapper>
}

// From https://github.com/enzymejs/enzyme/issues/2073#issuecomment-531488981
export function wait(amount = 0) {
  return new Promise(resolve => setTimeout(resolve, amount))
}

// Use this in your test after mounting if you need just need to let the query finish without updating the wrapper
export async function actWait(amount = 0) {
  await act(async () => { await wait(amount) })
}

// Use this in your test after mounting if you want the query to finish and update the wrapper
export async function updateWrapper(wrapper: any, amount = 0) {
  await act(async () => {
    await wait(amount)
    wrapper.update()
  })
}

function index<T extends { uid: string }>(
  ...collection: T[]
) {
  return new Map(collection.map(item =>
    [item.uid, item]
  ))
}

export const defaultStore: Store = {
  spaces: index(
    space({ uid: 'S1' }),
    space({ uid: 'S2' }),
  ),
  properties: index(
    property({ uid: 'P1' }),
    property({ uid: 'P2' })
  ),
  traits: new Map(),
  theorems: index(
    theorem({
      uid: 'T1',
      when: formula.atom('P1'),
      then: formula.atom('P2')
    })
  ),
  version: {
    ref: 'test',
    sha: 'HEAD'
  },
  checked: new Set()
}

export function Wrapper({
  children,
  store = defaultStore,
  initialEntries = [{ pathname: '/test' }],
  ...props
}: any) {
  jest.spyOn(Context, 'useStore').mockImplementation(() => store)

  return (
    <Context.Provider value={store}>
      <Router
        initialEntries={initialEntries}
        {...props}
      >
        <Route path="/test">
          {children}
        </Route>
      </Router>
    </Context.Provider>
  )
}

// Currently, shallow rendering seems to be limited in some pretty limiting ways
// * useContext hooks appear to just be broken - https://github.com/enzymejs/enzyme/issues/2176
// * react-router hoooks like useHistory or nested routing with useRouteMatch are brittle
//
// For now, we'll tend towards fully mounting components, but should re-consider
// shallow mounting for unit tests in the future if possible.
export function mountedAt(component: React.ReactElement<{}>, pathname: string, props: any = {}) {
  return enzymeMount(
    component,
    {
      wrappingComponent: Wrapper,
      wrappingComponentProps: {
        initialEntries: [{ pathname: `/test${pathname}` }],
        ...props
      }
    }
  )
}

export function mount(component: React.ReactElement<{}>, props: any = {}) {
  return mountedAt(component, '/', props)
}