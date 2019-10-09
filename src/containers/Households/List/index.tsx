import reducerRegistry from '@onaio/redux-reducer-registry';
import { some } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Input, InputGroup, InputGroupAddon, Table } from 'reactstrap';
import { Store } from 'redux';
import Loading from '../../../components/page/Loading';
import { OPENSRP_HOUSEHOLD_ENDPOINT, PAGINATION_SIZE } from '../../../configs/env';
import { OpenSRPService } from '../../../services/opensrp';
import clientsReducer, {
  fetchHouseholds,
  getHouseholdsArray,
  Household,
  reducerName as clientsReducerName,
} from '../../../store/ducks/clients';
import './householdList.css';

/** register the clients reducer */
reducerRegistry.register(clientsReducerName, clientsReducer);

/** props Interface for the householdList component */
export interface HouseholdListProps {
  opensrpService: typeof OpenSRPService;
  householdsArray: Household[];
  fetchHouseholdsActionCreator: typeof fetchHouseholds;
}

/** default props for the householdList component */
export const defaultHouseholdListProps: HouseholdListProps = {
  fetchHouseholdsActionCreator: fetchHouseholds,
  householdsArray: [],
  opensrpService: OpenSRPService,
};

/** Display the Household list  */
class HouseholdList extends React.Component<HouseholdListProps, {}> {
  public static defaultProps: HouseholdListProps = defaultHouseholdListProps;
  constructor(props: HouseholdListProps) {
    super(props);
  }

  public async componentDidMount() {
    const { fetchHouseholdsActionCreator, opensrpService } = this.props;
    const params = { clientType: 'ec_household', pageNumber: '0', pageSize: PAGINATION_SIZE };
    const clientService = new opensrpService(`${OPENSRP_HOUSEHOLD_ENDPOINT}`);
    const response = await clientService.list(params);
    fetchHouseholdsActionCreator(response.clients);
  }

  public render() {
    /** render loader if there are no households in state */
    const { householdsArray } = this.props;
    if (!some(householdsArray)) {
      return <Loading />;
    }
    return (
      <div>
        <InputGroup>
          <InputGroupAddon addonType="prepend">@</InputGroupAddon>
          <Input placeholder="search" />
        </InputGroup>
        <Table striped={true}>
          <thead>
            <tr>
              <th>HH ID Number</th>
              <th>Family Name</th>
              <th>Head of Household</th>
              <th>Phone</th>
              <th>Registered Date</th>
              <th>Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {householdsArray.map((household: Household) => {
              return (
                <tr key={household.baseEntityId}>
                  <td>{household.baseEntityId}</td>
                  <td>{household.lastName}</td>
                  <td>{household.attributes.HouseholdHead}</td>
                  <td>{household.attributes.phoneNumber}</td>
                  <td>{household.dateCreated}</td>
                  <td>{household.attributes.memberCount}</td>
                  <td>
                    <a href={`${'#'}`}> view </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export { HouseholdList };
/** Maybe define default props */
/** connect the component to the store */

/** Interface to describe props from mapStateToProps */
interface DispatchedStateProps {
  householdsArray: Household[];
}

/** Map props to state  */
const mapStateToProps = (state: Partial<Store>): DispatchedStateProps => {
  const result = {
    householdsArray: getHouseholdsArray(state),
  };
  return result;
};

/** map props to actions */
const mapDispatchToProps = { fetchHouseholdsActionCreator: fetchHouseholds };

/** connect householdsList to the redux store */
const ConnectedHouseholdList = connect(
  mapStateToProps,
  mapDispatchToProps
)(HouseholdList);

export default ConnectedHouseholdList;
