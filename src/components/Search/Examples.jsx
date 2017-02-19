import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

class Examples extends React.Component {
  examples() {
    return [
      {
        name: 'All Non-Metric Continua',
        q: 'compact + connected + t_2 + ~metrizable'
      },
      {
        name: 'A Common Non-Theorem',
        q: 'first countable + separable + ~second countable'
      },
      {
        name: 'A Class of Examples by Name',
        q: ':plank'
      }
      // {
      //   name: 'New Things to Prove',
      //   q: '?metacompact'
      // }
    ]
  }

  example(ex) {
    const { onSelect, parseFormula } = this.props
    const f = parseFormula(ex.q)

    return (
      <example key={ex.q}>
        <h5>{ex.name}</h5>
        <a onClick={() => onSelect({ q: ex.q, formula: f })}>
          <pre>{ex.q}</pre>
        </a>
      </example>
    )
  }

  render() {
    return (
      <div>
        <p>Not sure where to start? Try one of the following searches</p>
        {this.examples().map(ex =>
          this.example(ex)
        )}
      </div>
    )
  }
}

Examples.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default connect(
  (state) => ({
    parseFormula: (q) => Q.parseFormula(state, q)
  })
)(Examples)
