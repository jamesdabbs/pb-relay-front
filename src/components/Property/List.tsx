import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { State } from '../../reducers'
import * as S from '../../selectors'
import * as T from '../../types'
import { by } from '../../utils'

import EditLink from '../Form/EditLink'
import List from '../List'
import Preview from '../Preview'
import Tex from '../Tex'

interface Item {
  uid: string
  name: string
  description: string
}

interface Props {
  object: Item
}

class Property extends React.Component<Props, { expanded: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { expanded: false }
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const property = this.props.object

    return (
      <Tex className="row">
        <div className="col-md-2">
          <h4>
            <Link to={`/properties/${property.uid}`}>
              {property.name}
            </Link>
          </h4>
        </div>
        <div className="col-md-10">
          <Preview text={property.description} />
        </div>
      </Tex>
    )
  }
}

interface StateProps {
  properties: T.Property[]
}
const Index = ({ properties }: StateProps) => {
  return (
    <div>
      <EditLink to="/properties/new" className="btn btn-default">New</EditLink>

      <List
        name="properties"
        objects={properties}
        component={Property}
      />
    </div>
  )
}

export default connect(
  (state: State) => ({
    properties: Array.from(state.properties.values()).sort(by('uid')).reverse()
  })
)(Index)