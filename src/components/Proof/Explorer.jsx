import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Implication from '../Implication'

class Explorer extends React.Component {
  render() {
    const { space, proof } = this.props

    if (!proof) { return null }

    return <div className="proofExplorer">
      <p>Automatically deduced from the following properties</p>
      <ul>
        {proof.get('traits').map(t =>
          <li key={'prop' + t.getIn(['property', 'uid'])}>
            <Link to={`/spaces/${space.get('name')}/properties/${t.getIn(['property', 'name'])}`}>
              {t.get('value') ? '' : '¬'}
              {t.getIn(['property', 'name'])}
            </Link>
          </li>
        )}
      </ul>

      <p>and theorems</p>
      <ul>
        {proof.get('theorems').map(t =>
          <li key={'implication' + t.get('uid')}>
            <Link to={`/theorems/${t.get('uid')}`}>
              <Implication theorem={t} link={false}/>
            </Link>
          </li>
        )}
      </ul>
    </div>
  }
}

Explorer.propTypes = {
  space: PropTypes.object.isRequired,
  trait: PropTypes.object.isRequired
}

export default connect(
  (state, ownProps) => ({
    proof: Q.getProof(state, ownProps.trait)
  })
)(Explorer)